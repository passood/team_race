# Session Handoff - Frontend UI Implementation

**Session Date**: 2025-11-03
**Phase**: 2.1 & 2.2 (Project Foundation & Core Infrastructure)
**Status**: 70% Complete - BLOCKER: Tailwind CSS Installation Issue

---

## CRITICAL ISSUE - MUST FIX FIRST

### Tailwind CSS Installation Problem

**Problem**: npm workspace configuration causing Tailwind CSS to not install correctly in `frontend/node_modules`

**Symptoms**:
```
Cannot find module 'tailwindcss'
Require stack: /Users/joono/Projects/team_race/frontend/postcss.config.js
```

**Root Cause**:
- Root `package.json` has `workspaces: ["frontend"]`
- npm workspace tries to hoist dependencies to root
- Tailwind gets installed to root `node_modules` but frontend PostCSS config can't find it
- Multiple attempts to install directly in frontend fail due to workspace

**Files Involved**:
- `/Users/joono/Projects/team_race/package.json` (has workspace config)
- `/Users/joono/Projects/team_race/frontend/package.json` (lists tailwindcss in devDependencies)
- `/Users/joono/Projects/team_race/frontend/postcss.config.js` (trying to require tailwindcss)

**Solution Options**:
1. **Remove workspace** (RECOMMENDED):
   - Remove `workspaces` array from root `package.json`
   - Delete root `node_modules` and `package-lock.json`
   - Delete frontend `node_modules` and `package-lock.json`
   - Run `cd frontend && npm install` fresh

2. **Fix workspace resolution**:
   - Ensure PostCSS config resolves from root node_modules
   - May need to adjust paths or use different PostCSS setup

**Commands to Run**:
```bash
# Option 1: Remove workspace (RECOMMENDED)
# 1. Edit root package.json - remove "workspaces" key
# 2. Clean everything
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
# 3. Fresh install
cd frontend && npm install
# 4. Verify Tailwind exists
test -d node_modules/tailwindcss && echo "SUCCESS" || echo "FAILED"
# 5. Start dev server
npm run dev
```

---

## What Was Completed ✅

### Phase 2.1: Project Foundation (COMPLETE)

1. **Vite + React + TypeScript Setup**
   - Created via temp Vite project, copied config files
   - Fixed directory nesting issue (removed `frontend/frontend/`)
   - Files: `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `index.html`

2. **Path Aliases**
   - Configured `@/` → `src/` in both Vite and TypeScript
   - Working in imports (verified in components)

3. **TanStack Router**
   - Plugin added to `vite.config.ts`
   - Routes moved from `src/pages/` to `src/routes/` (TanStack Router convention)
   - Files created:
     - `src/routes/__root.tsx` (root layout with Outlet)
     - `src/routes/index.tsx` (home page)
     - `src/routes/$404.tsx` (404 page)

4. **Configuration Files**
   - `tailwind.config.js` - Blue Team / White Team colors, dark mode
   - `postcss.config.js` - Tailwind + Autoprefixer
   - `src/styles/index.css` - Tailwind directives + dark theme defaults

5. **Dependencies Installed** (in frontend/package.json):
   ```json
   "dependencies": {
     "@tanstack/react-query": "^5.90.6",
     "@tanstack/react-router": "^1.134.9",
     "clsx": "^2.1.1",
     "date-fns": "^4.1.0",
     "lucide-react": "^0.552.0",
     "react": "^18.3.0",
     "react-dom": "^18.3.0",
     "tailwind-merge": "^3.3.1",
     "zustand": "^5.0.8"
   },
   "devDependencies": {
     "@tanstack/react-query-devtools": "^5.90.2",
     "@tanstack/router-devtools": "^1.134.9",
     "@tanstack/router-vite-plugin": "^1.134.9",
     "autoprefixer": "^10.4.21",
     "postcss": "^8.5.6",
     "tailwindcss": "^3.4.18",
     ...
   }
   ```

### Phase 2.2: Core Infrastructure (90% COMPLETE)

1. **TanStack Query Setup** ✅
   - File: `src/main.tsx`
   - QueryClient configured with infinite cache strategy
   - React Query Devtools added (dev only)
   - Configuration:
     ```typescript
     staleTime: Infinity
     gcTime: Infinity
     refetchOnWindowFocus: false
     refetchOnMount: false
     refetchOnReconnect: false
     retry: 3
     ```

2. **Custom Hooks** ✅
   - File: `src/hooks/useStockData.ts`
   - `useStockData()` - fetches all stocks via TanStack Query
   - `useStockMetadata()` - fetches metadata
   - Both use infinite cache config

3. **Zustand Stores** ✅
   - **FilterStore** (`src/stores/useFilterStore.ts`):
     - State: team, sectors, dateRange
     - Actions: setTeam, setSectors, setDateRange, toggleSector, clearSectors, reset
     - Persisted to localStorage via zustand persist middleware

   - **PlaybackStore** (`src/stores/usePlaybackStore.ts`):
     - State: isPlaying, speed, currentIndex, currentDate
     - Actions: play, pause, toggle, setSpeed, seekToIndex, setCurrentDate, nextFrame, previousFrame, reset
     - NOT persisted (resets on page load)

4. **UI Component Library** ✅
   - **Button** (`src/components/UI/Button.tsx`):
     - Variants: primary, secondary, ghost, danger
     - Sizes: sm, md, lg
     - Loading state with spinner
     - Fully typed with TypeScript

   - **Card** (`src/components/UI/Card.tsx`):
     - Optional header, footer
     - noPadding prop for custom content
     - Dark theme styled

   - **LoadingSpinner** (`src/components/UI/LoadingSpinner.tsx`):
     - Sizes: sm, md, lg, xl
     - Optional label
     - Blue team color

   - **ErrorMessage** (`src/components/UI/ErrorMessage.tsx`):
     - Title, message props
     - Optional retry button with callback
     - Lucide React AlertCircle icon

**IMPORTANT**: All components use `type` imports for React types due to `verbatimModuleSyntax` TypeScript setting.

---

## Project Structure Created

```
frontend/
├── src/
│   ├── routes/              ✅ (was pages, renamed for TanStack Router)
│   │   ├── __root.tsx       ✅
│   │   ├── index.tsx        ✅
│   │   └── $404.tsx         ✅
│   ├── components/          ✅
│   │   └── UI/              ✅
│   │       ├── Button.tsx   ✅
│   │       ├── Card.tsx     ✅
│   │       ├── LoadingSpinner.tsx  ✅
│   │       └── ErrorMessage.tsx    ✅
│   ├── hooks/               ✅
│   │   └── useStockData.ts  ✅
│   ├── stores/              ✅
│   │   ├── useFilterStore.ts      ✅
│   │   └── usePlaybackStore.ts    ✅
│   ├── services/            ✅ (from Phase 1)
│   │   └── stockApi.ts      ✅
│   ├── types/               ✅ (from Phase 1)
│   │   └── stock.ts         ✅
│   ├── styles/              ✅
│   │   └── index.css        ✅
│   └── main.tsx             ✅
├── index.html               ✅ (dark class on html tag)
├── vite.config.ts           ✅ (path aliases, TanStack Router plugin)
├── tailwind.config.js       ✅ (Blue/White team colors)
├── postcss.config.js        ✅ ⚠️ BLOCKED by Tailwind install issue
├── tsconfig*.json           ✅
└── package.json             ✅
```

---

## What's Pending

### Immediate Next Steps (After Fixing Tailwind):

1. **Verify Dev Server**
   - Should run without errors on http://localhost:5173/
   - Should show Team Race homepage with dark theme
   - TailwindCSS classes should work

2. **Phase 2.3: Layout Components** (Days 5-6)
   - Build Header with logo, refresh button, last updated
   - Build MainLayout (header + control panel + content + footer)
   - Build Footer with attribution

3. **Phase 2.4: Control Panel Components** (Days 7-8)
   - DateRangePicker (presets: 1M, 3M, 6M, 1Y, 3Y, 5Y, Custom)
   - TeamFilter (All / Blue / White radio group)
   - SectorFilter (multi-select dropdown)
   - PlaybackControls (play/pause, speed, timeline)

4. **Phase 2.5: Data Integration & Utilities** (Day 9)
   - `useDateRange.ts` hook
   - `useFilteredStocks.ts` hook
   - `utils/formatters.ts` (formatCurrency, formatDate, formatPercentage)
   - `utils/calculations.ts` (calculateTeamAverages, filterByDateRange, getSectorCounts)
   - ChartRacePlaceholder component

5. **Phase 2.6: Polish & Testing** (Day 10)
   - UI polish, loading skeletons, transitions
   - Manual testing mobile/desktop
   - Production build verification

---

## Key Decisions Made

1. **Type Imports**: Using `import type` syntax for all React types due to `verbatimModuleSyntax` in tsconfig
2. **Routes Not Pages**: TanStack Router looks for `src/routes/` not `src/pages/`
3. **Infinite Cache**: Perfect for static JSON data updated daily
4. **Zustand Persist**: Only FilterStore persists, PlaybackStore resets on load
5. **Dark Theme Only**: No light mode toggle, simplified implementation
6. **No Component Library**: Building custom components for full control

---

## Tricky Issues Solved

### Issue 1: Directory Nesting
**Problem**: Vite project created nested `frontend/frontend/` directories
**Solution**: Removed nested directory, moved files to correct location

### Issue 2: TanStack Router Directory
**Problem**: Router plugin expected `src/routes/` but we had `src/pages/`
**Solution**: Renamed `pages` to `routes`

### Issue 3: Type Import Errors
**Problem**: `verbatimModuleSyntax` requires explicit `import type`
**Solution**: Changed all React type imports to use `import type { ... } from 'react'`

### Issue 4: Package Manager Confusion
**Problem**: Root had pnpm workspace config but using npm
**Solution**:
- Removed `pnpm-workspace.yaml`
- Changed root package.json scripts from pnpm to npm workspace commands
- Removed `shared` from workspace (it has no package.json)

### Issue 5: Tailwind Version Conflict (ONGOING)
**Problem**: Tailwind v4 got installed at root, v3 at frontend, causing PostCSS errors
**Attempts**:
- Uninstalled from root multiple times
- Reinstalled frontend node_modules multiple times
- Cleared Vite cache
- Package.json shows v3.4.18 but node_modules doesn't have it
**Status**: BLOCKED - workspace hoisting prevents proper installation

---

## Background Servers Running

Multiple dev servers may still be running in background (shell IDs: 69fb0b, 5afca4, 3a3af3, cf543a, 90ff6f, e6b253, 49510a)

**Clean up command**:
```bash
# Kill all node processes
pkill -f "vite"
# Or manually
ps aux | grep vite
```

---

## Commands That Need to Run

After fixing Tailwind installation:

```bash
# 1. Verify Tailwind is installed
cd frontend
ls node_modules/tailwindcss

# 2. Start dev server
npm run dev

# 3. Should see:
#    VITE v7.1.12  ready in ~500ms
#    ➜  Local:   http://localhost:5173/
#    (no PostCSS errors)

# 4. Open browser to http://localhost:5173/
#    Should see: "Team Race" title with dark background and blue team color
```

---

## Testing Checklist (After Tailwind Fix)

- [ ] Dev server starts without errors
- [ ] Homepage renders with dark theme
- [ ] Blue team colors visible (text-blue-team-500)
- [ ] TanStack Router Devtools visible (bottom right, dev only)
- [ ] React Query Devtools visible (bottom left, dev only)
- [ ] No TypeScript errors in terminal
- [ ] HMR (Hot Module Replacement) works on file save

---

## Files Modified This Session

**Created**:
- `frontend/src/main.tsx`
- `frontend/src/routes/__root.tsx`
- `frontend/src/routes/index.tsx`
- `frontend/src/routes/$404.tsx`
- `frontend/src/hooks/useStockData.ts`
- `frontend/src/stores/useFilterStore.ts`
- `frontend/src/stores/usePlaybackStore.ts`
- `frontend/src/components/UI/Button.tsx`
- `frontend/src/components/UI/Card.tsx`
- `frontend/src/components/UI/LoadingSpinner.tsx`
- `frontend/src/components/UI/ErrorMessage.tsx`
- `frontend/src/styles/index.css`
- `frontend/vite.config.ts`
- `frontend/tailwind.config.js`
- `frontend/postcss.config.js`
- `frontend/tsconfig.app.json` (modified)
- `frontend/index.html` (modified)
- `frontend/package.json` (modified)

**Modified**:
- Root `package.json` (removed pnpm-workspace, changed to npm workspaces)

**Deleted**:
- `pnpm-workspace.yaml`
- `frontend/frontend/` (nested directory mistake)

---

## Next Session Start

1. **First Priority**: Fix Tailwind CSS installation (see CRITICAL ISSUE section)
2. **Then**: Verify dev server runs cleanly
3. **Then**: Continue with Phase 2.3 (Layout Components)

---

**Last Updated**: 2025-11-03 23:35 UTC
**Created By**: Claude (Sonnet 4.5)
**Session Duration**: ~2 hours
**Progress**: Phase 2.1 (100%), Phase 2.2 (90%), Overall Phase 2 (~40%)
