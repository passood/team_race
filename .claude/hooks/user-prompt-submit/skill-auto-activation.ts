/**
 * Skill Auto-Activation Hook
 *
 * This hook runs BEFORE Claude sees the user's prompt.
 * It analyzes the prompt and file context to automatically suggest relevant skills.
 *
 * Based on Reddit post: "Claude Code is a Beast – Tips from 6 Months of Hardcore Use"
 * This is the "game changer" hook that makes skills actually work.
 */

import * as fs from 'fs';
import * as path from 'path';

interface SkillRule {
  type: string;
  enforcement: string;
  priority: 'high' | 'medium' | 'low';
  promptTriggers: {
    keywords: string[];
    intentPatterns: string[];
  };
  fileTriggers: {
    pathPatterns: string[];
    contentPatterns: string[];
  };
}

interface SkillRules {
  skills: Record<string, SkillRule>;
  activationConfig: {
    maxSkillsPerPrompt: number;
    priorityWeighting: Record<string, number>;
    matchScoring: Record<string, number>;
  };
  displayTemplates: {
    activationMessage: string;
    skillListItem: string;
    noActivation: string;
  };
}

interface SkillMatch {
  skillName: string;
  score: number;
  reasons: string[];
  priority: 'high' | 'medium' | 'low';
}

export default async function skillAutoActivation(
  prompt: string,
  context: {
    files?: string[];
    cwd: string;
  }
): Promise<string> {
  try {
    // Load skill rules
    const rulesPath = path.join(context.cwd, '.claude', 'skills', 'skill-rules.json');

    if (!fs.existsSync(rulesPath)) {
      return prompt; // No rules file, return prompt unchanged
    }

    const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
    const rules: SkillRules = JSON.parse(rulesContent);

    // Analyze prompt and context
    const matches = analyzePromptAndContext(prompt, context, rules);

    // No matches found
    if (matches.length === 0) {
      return prompt;
    }

    // Sort by score and priority
    const sortedMatches = matches.sort((a, b) => {
      const priorityDiff =
        rules.activationConfig.priorityWeighting[b.priority] -
        rules.activationConfig.priorityWeighting[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.score - a.score;
    });

    // Limit to max skills per prompt
    const topMatches = sortedMatches.slice(0, rules.activationConfig.maxSkillsPerPrompt);

    // Build activation message
    const activationMessage = buildActivationMessage(topMatches, rules);

    // Prepend to user's prompt
    return `${activationMessage}\n\n---\n\nUser's request:\n${prompt}`;
  } catch (error) {
    console.error('Skill auto-activation hook error:', error);
    return prompt; // On error, return prompt unchanged
  }
}

function analyzePromptAndContext(
  prompt: string,
  context: { files?: string[]; cwd: string },
  rules: SkillRules
): SkillMatch[] {
  const matches: SkillMatch[] = [];
  const promptLower = prompt.toLowerCase();

  for (const [skillName, rule] of Object.entries(rules.skills)) {
    let score = 0;
    const reasons: string[] = [];

    // Check keyword matches
    const keywordMatches = rule.promptTriggers.keywords.filter(keyword =>
      promptLower.includes(keyword.toLowerCase())
    );

    if (keywordMatches.length > 0) {
      score += keywordMatches.length * rules.activationConfig.matchScoring.keywordMatch;
      reasons.push(`Keywords: ${keywordMatches.join(', ')}`);
    }

    // Check intent pattern matches
    for (const pattern of rule.promptTriggers.intentPatterns) {
      try {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(prompt)) {
          score += rules.activationConfig.matchScoring.intentPatternMatch;
          reasons.push(`Intent pattern matched`);
          break; // Only count once per skill
        }
      } catch (e) {
        // Invalid regex, skip
      }
    }

    // Check file context matches
    if (context.files && context.files.length > 0) {
      for (const file of context.files) {
        // Check path patterns
        for (const pathPattern of rule.fileTriggers.pathPatterns) {
          const pattern = pathPattern
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*');

          try {
            const regex = new RegExp(pattern);
            if (regex.test(file)) {
              score += rules.activationConfig.matchScoring.filePathMatch;
              reasons.push(`File path: ${file}`);
              break;
            }
          } catch (e) {
            // Invalid regex, skip
          }
        }

        // Check content patterns (if file is accessible)
        try {
          const filePath = path.join(context.cwd, file);
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');

            for (const contentPattern of rule.fileTriggers.contentPatterns) {
              try {
                const regex = new RegExp(contentPattern, 'm');
                if (regex.test(content)) {
                  score += rules.activationConfig.matchScoring.contentPatternMatch;
                  reasons.push(`File content pattern matched`);
                  break;
                }
              } catch (e) {
                // Invalid regex, skip
              }
            }
          }
        } catch (e) {
          // Can't read file, skip
        }
      }
    }

    // Only add if there are matches
    if (score > 0) {
      matches.push({
        skillName,
        score,
        reasons,
        priority: rule.priority,
      });
    }
  }

  return matches;
}

function buildActivationMessage(matches: SkillMatch[], rules: SkillRules): string {
  if (matches.length === 0) {
    return rules.displayTemplates.noActivation;
  }

  // Extract topics from reasons
  const topics = new Set<string>();
  matches.forEach(match => {
    match.reasons.forEach(reason => {
      if (reason.startsWith('Keywords:')) {
        const keywords = reason.replace('Keywords: ', '').split(', ');
        keywords.forEach(k => topics.add(k));
      }
    });
  });

  // Build skill list
  const skillList = matches
    .map(match => {
      const reasonSummary = match.reasons[0] || 'General match';
      return rules.displayTemplates.skillListItem
        .replace('{skillName}', match.skillName)
        .replace('{reason}', reasonSummary);
    })
    .join('\n');

  // Build final message
  const message = rules.displayTemplates.activationMessage
    .replace('{topics}', Array.from(topics).join(', ') || 'multiple topics')
    .replace('{skills}', skillList);

  return message;
}
