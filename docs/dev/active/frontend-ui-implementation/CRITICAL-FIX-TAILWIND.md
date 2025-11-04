# CRITICAL FIX: Tailwind CSS Installation

**Priority**: MUST FIX IMMEDIATELY
**Status**: BLOCKING all progress
**Issue Date**: 2025-11-03

---

## Problem

Tailwind CSS v3.4.18 is listed in `frontend/package.json` devDependencies but is NOT installed in `frontend/node_modules/`.

**Error Message**:
```
Failed to load PostCSS config: Cannot find module 'tailwindcss'
Require stack: /Users/joono/Projects/team_race/frontend/postcss.config.js
```

**Root Cause**: npm workspace hoisting dependencies to root node_modules, but frontend PostCSS config can't resolve from root.

---

## Solution Steps (RECOMMENDED)

### Option 1: Remove Workspace Configuration

```bash
# 1. Edit root package.json
#    Remove "workspaces" key entirely OR
#    Keep only if actually using workspaces properly

# 2. Clean all node_modules
cd /Users/joono/Projects/team_race
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

# 3. Install root dependencies (if needed)
npm install

# 4. Install frontend dependencies
cd frontend
npm install

# 5. Verify Tailwind is present
ls node_modules/tailwindcss
# Should show tailwindcss directory with lib/, dist/, etc.

# 6. Start dev server
npm run dev

# 7. Should see clean startup:
#    VITE v7.1.12  ready in ~500ms
#    ➜  Local:   http://localhost:5173/
#    (NO PostCSS errors)
```

### Option 2: Fix Workspace Resolution

If you want to keep workspace:

```bash
# Edit frontend/postcss.config.js
export default {
  plugins: {
    tailwindcss: require.resolve('tailwindcss'),
    autoprefixer: require.resolve('autoprefixer'),
  },
}
```

But this is NOT recommended - Option 1 is cleaner.

---

## Verification Checklist

After fix:

- [ ] `frontend/node_modules/tailwindcss` directory exists
- [ ] `npm run dev` starts without errors
- [ ] Browser shows http://localhost:5173/ with dark background
- [ ] No PostCSS errors in terminal
- [ ] TailwindCSS classes work (check blue-team-500 color on page title)

---

## Current State

**Root package.json**:
```json
{
  "workspaces": ["frontend"]
}
```

**Frontend package.json** (excerpt):
```json
{
  "devDependencies": {
    "tailwindcss": "^3.4.18",
    "postcss": "^8.5.6",
    "autoprefixer": "^10.4.21"
  }
}
```

**Actual node_modules**:
- Root: Has various dependencies
- Frontend: Missing tailwindcss directory

---

## Why This Matters

**Nothing can work without Tailwind CSS**:
- All components use TailwindCSS classes
- Dark theme relies on Tailwind
- Custom Blue/White team colors defined in Tailwind config
- PostCSS needs Tailwind to process CSS

**Estimated Fix Time**: 5 minutes

---

## After Fix - Next Steps

1. Verify dev server runs clean
2. Check homepage renders with dark theme
3. Continue with Phase 2.3: Layout Components
4. Build Header, MainLayout, Footer

---

**Last Updated**: 2025-11-03 23:40 UTC
**Severity**: CRITICAL - BLOCKS ALL PROGRESS
**Owner**: Next session developer
