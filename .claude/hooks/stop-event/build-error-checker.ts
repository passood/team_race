/**
 * Build Error Checker Hook
 *
 * This hook runs AFTER Claude finishes responding (stop event).
 * It detects which workspaces were modified and runs build checks.
 *
 * Based on Reddit post: "#NoMessLeftBehind" philosophy
 * Prevents TypeScript errors from accumulating.
 */

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface EditLog {
  timestamp: string;
  files: string[];
  workspace?: string;
}

interface BuildResult {
  workspace: string;
  success: boolean;
  errors: string[];
  errorCount: number;
}

export default async function buildErrorChecker(context: {
  cwd: string;
  editedFiles?: string[];
}): Promise<string> {
  try {
    // Check if there were any file edits in this response
    if (!context.editedFiles || context.editedFiles.length === 0) {
      return ''; // No files edited, nothing to check
    }

    // Determine which workspaces were affected
    const affectedWorkspaces = getAffectedWorkspaces(context.editedFiles, context.cwd);

    if (affectedWorkspaces.size === 0) {
      return ''; // No workspaces affected
    }

    // Run builds on affected workspaces
    const buildResults = await runBuilds(affectedWorkspaces, context.cwd);

    // Format and return results
    return formatBuildResults(buildResults);
  } catch (error) {
    console.error('Build error checker hook error:', error);
    return ''; // Silently fail
  }
}

function getAffectedWorkspaces(files: string[], cwd: string): Set<string> {
  const workspaces = new Set<string>();

  for (const file of files) {
    // Check if file is in frontend
    if (file.startsWith('frontend/')) {
      workspaces.add('frontend');
    }

    // Check if file is in backend services
    const backendMatch = file.match(/^backend\/([^/]+)\//);
    if (backendMatch) {
      workspaces.add(`backend/${backendMatch[1]}`);
    }

    // Check if file is in shared
    if (file.startsWith('shared/')) {
      workspaces.add('shared');
    }
  }

  return workspaces;
}

async function runBuilds(
  workspaces: Set<string>,
  cwd: string
): Promise<BuildResult[]> {
  const results: BuildResult[] = [];

  for (const workspace of workspaces) {
    const workspacePath = path.join(cwd, workspace);

    // Check if workspace has package.json
    const packageJsonPath = path.join(workspacePath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      continue; // No package.json, skip
    }

    // Check if workspace has build script
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    if (!packageJson.scripts || !packageJson.scripts.build) {
      // Try TypeScript check instead
      if (fs.existsSync(path.join(workspacePath, 'tsconfig.json'))) {
        const result = await runTypeScriptCheck(workspace, workspacePath);
        results.push(result);
      }
      continue;
    }

    // Run build
    const result = await runBuild(workspace, workspacePath);
    results.push(result);
  }

  return results;
}

async function runBuild(workspace: string, workspacePath: string): Promise<BuildResult> {
  try {
    const { stdout, stderr } = await execAsync('pnpm build', {
      cwd: workspacePath,
      timeout: 60000, // 60 second timeout
    });

    return {
      workspace,
      success: true,
      errors: [],
      errorCount: 0,
    };
  } catch (error: any) {
    // Build failed
    const output = error.stdout + error.stderr;
    const errors = parseTypeScriptErrors(output);

    return {
      workspace,
      success: false,
      errors: errors.slice(0, 10), // Limit to first 10 errors
      errorCount: errors.length,
    };
  }
}

async function runTypeScriptCheck(
  workspace: string,
  workspacePath: string
): Promise<BuildResult> {
  try {
    const { stdout, stderr } = await execAsync('pnpm exec tsc --noEmit', {
      cwd: workspacePath,
      timeout: 60000,
    });

    return {
      workspace,
      success: true,
      errors: [],
      errorCount: 0,
    };
  } catch (error: any) {
    const output = error.stdout + error.stderr;
    const errors = parseTypeScriptErrors(output);

    return {
      workspace,
      success: false,
      errors: errors.slice(0, 10),
      errorCount: errors.length,
    };
  }
}

function parseTypeScriptErrors(output: string): string[] {
  const errors: string[] = [];
  const lines = output.split('\n');

  for (const line of lines) {
    // Match TypeScript error format: file.ts(line,col): error TS1234: message
    if (line.includes('error TS') || line.includes('Error:')) {
      errors.push(line.trim());
    }
  }

  return errors;
}

function formatBuildResults(results: BuildResult[]): string {
  const failedBuilds = results.filter(r => !r.success);

  if (failedBuilds.length === 0) {
    return ''; // All builds passed, no message needed
  }

  let message = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  message += '🔍 BUILD CHECK RESULTS\n';
  message += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

  for (const result of failedBuilds) {
    message += `❌ ${result.workspace}: ${result.errorCount} error(s) found\n\n`;

    if (result.errorCount <= 5) {
      // Show all errors if 5 or fewer
      message += '```\n';
      message += result.errors.join('\n');
      message += '\n```\n\n';
      message += '**Action Required**: Please fix these errors before proceeding.\n\n';
    } else {
      // Show first 5 errors if more than 5
      message += '```\n';
      message += result.errors.slice(0, 5).join('\n');
      message += `\n... and ${result.errorCount - 5} more errors\n`;
      message += '```\n\n';
      message += `**⚠️ ${result.errorCount} errors detected** - Consider using the build-error-resolver agent:\n\n`;
      message += '```bash\n';
      message += `# Launch agent to fix errors systematically\n`;
      message += `/agent build-error-resolver workspace=${result.workspace}\n`;
      message += '```\n\n';
    }
  }

  message += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

  return message;
}
