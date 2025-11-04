# Frontend UI Implementation - Context & Decisions

**Last Updated**: 2025-11-03

---

## Project Context

### What We're Building
The Team Race frontend UI - a React-based web application that visualizes stock performance through chart race animations, comparing Blue Team (future sectors) vs White Team (traditional sectors).

### Why This Phase Matters
Phase 1 established serverless data infrastructure with GitHub Actions. Phase 2 builds the interactive UI foundation that will host the D3.js chart race in Phase 3.

---

## Key Files and Their Roles

### Existing Files (Phase 1 - Complete)

#### Data Files
- **`frontend/public/data/stocks-latest.json`** (9.6MB)
  - 32 stocks × 5 years of historical data
  - Generated daily by GitHub Actions
  - Contains: ticker, name, sector, team, history[], financials{}

- **`frontend/public/data/metadata.json`** (235B)
  - lastUpdated timestamp
  - dateRange (start/end)
  - stock counts (total, blue, white)

#### API Layer
- **`frontend/src/services/stockApi.ts`**
  - `getAllStocks()`: Fetch stocks-latest.json
  - `getStocksByDate(date)`: Fetch archived data
  - `getStockMetadata()`: Fetch metadata
  - Filter utilities (team, sector, date range)
  - Cache config for TanStack Query

#### Type Definitions
- **`frontend/src/types/stock.ts`**
  - `StockData`: Complete stock information
  - `HistoricalDataPoint`: OHLCV + date
  - `FinancialMetrics`: Debt-to-equity, current ratio, market cap
  - `StockMetadata`: Update info

#### Configuration
- **`shared/config/stock-tickers.ts`**
  - `ALL_TICKERS`: Array of 32 stocks
  - `BLUE_TEAM_ALL`: 17 future-focused stocks
  - `WHITE_TEAM_ALL`: 15 traditional stocks
  - Utility functions (getTeamByTicker, etc.)

### New Files (Phase 2 - To Create)

#### Project Setup
- `frontend/index.html` - HTML entry point
- `frontend/vite.config.ts` - Vite configuration
- `frontend/tsconfig.json` - TypeScript config
- `frontend/tailwind.config.js` - TailwindCSS theme
- `frontend/postcss.config.js` - PostCSS config
- `frontend/package.json` - Dependencies

#### Application Core
- `frontend/src/main.tsx` - React entry point
- `frontend/src/App.tsx` - Root component
- `frontend/src/styles/index.css` - Global styles

#### Routing
- `frontend/src/pages/__root.tsx` - Root layout
- `frontend/src/pages/HomePage.tsx` - Main page
- `frontend/src/pages/NotFoundPage.tsx` - 404 page

#### State Management
- `frontend/src/stores/useFilterStore.ts` - Filter state
- `frontend/src/stores/usePlaybackStore.ts` - Playback state

#### Layout Components
- `frontend/src/components/Layout/Header.tsx`
- `frontend/src/components/Layout/MainLayout.tsx`
- `frontend/src/components/Layout/Footer.tsx`

#### Control Components
- `frontend/src/components/Controls/DateRangePicker.tsx`
- `frontend/src/components/Controls/TeamFilter.tsx`
- `frontend/src/components/Controls/SectorFilter.tsx`
- `frontend/src/components/Controls/PlaybackControls.tsx`

#### UI Components
- `frontend/src/components/UI/Button.tsx`
- `frontend/src/components/UI/Card.tsx`
- `frontend/src/components/UI/LoadingSpinner.tsx`
- `frontend/src/components/UI/ErrorMessage.tsx`

#### Hooks
- `frontend/src/hooks/useStockData.ts`
- `frontend/src/hooks/useDateRange.ts`
- `frontend/src/hooks/useFilteredStocks.ts`

#### Utilities
- `frontend/src/utils/formatters.ts`
- `frontend/src/utils/calculations.ts`

---

## Architectural Decisions

### Decision 1: TanStack Router over React Router
**Rationale**:
- File-based routing is more intuitive
- Built-in code splitting
- Better TypeScript support
- Modern, actively maintained

**Trade-offs**:
- Slightly steeper learning curve
- Less community resources than React Router
- Requires understanding of route trees

**Chosen**: TanStack Router

---

### Decision 2: Zustand over Redux/Context
**Rationale**:
- Lightweight (< 1KB)
- No boilerplate (no actions, reducers)
- Simple API: `create()` and `useStore()`
- Built-in persistence via middleware
- Perfect for filter and playback state

**Trade-offs**:
- Less ecosystem than Redux
- No DevTools Redux extension integration
- May need migration if app grows significantly

**Chosen**: Zustand

---

### Decision 3: TanStack Query with Infinite Cache
**Rationale**:
- Data updates only once daily (GitHub Actions)
- No need to refetch on window focus
- Reduces server load (actually CDN load)
- Perfect for static JSON strategy

**Configuration**:
```typescript
export const STOCK_DATA_CACHE_CONFIG = {
  staleTime: Infinity,
  cacheTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
};
```

**Trade-offs**:
- Users won't see updates until manual refresh
- Need clear "Last Updated" timestamp
- Must provide manual refresh button

**Chosen**: Infinite cache with manual refresh

---

### Decision 4: Dark Theme Only
**Rationale**:
- Matches stock market terminal aesthetic
- Better for data visualization
- Reduces eye strain for long sessions
- Simpler (no theme switcher needed)

**Implementation**:
- TailwindCSS dark mode: `'class'` strategy
- `<html class="dark">` by default
- Custom color palette:
  - Blue Team: Blue-500, Blue-400, Blue-600
  - White Team: Gray-500, Gray-400, Gray-600
  - Background: Slate-900
  - Text: Slate-50

**Trade-offs**:
- No light mode option
- May not suit all users
- Need to ensure good contrast

**Chosen**: Dark theme only

---

### Decision 5: Mobile-First Responsive Design
**Rationale**:
- TailwindCSS encourages mobile-first
- Easier to scale up than down
- Better default experience

**Breakpoints**:
- `sm`: 640px (mobile)
- `md`: 768px (tablet)
- `lg`: 1024px (laptop)
- `xl`: 1280px (desktop)
- `2xl`: 1536px (large desktop)

**Layout Strategy**:
- Mobile: Single column, stacked controls
- Tablet: Two-column where appropriate
- Desktop: Full layout with sidebars

---

### Decision 6: Component Composition over Configuration
**Rationale**:
- More flexible
- Easier to understand
- Better TypeScript support
- Follows React best practices

**Example**:
```tsx
// ❌ Configuration approach
<Button variant="primary" size="lg" icon="play" />

// ✅ Composition approach
<Button className="...">
  <PlayIcon />
  Play
</Button>
```

**Chosen**: Composition with sensible defaults

---

### Decision 7: No Component Library (Build Custom)
**Rationale**:
- Full control over styling
- Smaller bundle size
- Learn component patterns
- Avoid library lock-in

**Trade-offs**:
- More development time
- Need to handle accessibility manually
- May reinvent the wheel

**Mitigation**:
- Use HeadlessUI for accessible patterns
- Reference Shadcn/UI for inspiration
- Keep components simple initially

**Chosen**: Custom components with HeadlessUI primitives

---

## Data Flow Architecture

```
GitHub Actions (Daily)
    ↓
stocks-latest.json (9.6MB)
    ↓
TanStack Query (Infinite Cache)
    ↓
useStockData() Hook
    ↓
useFilterStore (Team, Sector, Date)
    ↓
useFilteredStocks() Hook
    ↓
HomePage Component
    ↓
ChartRacePlaceholder (Phase 2)
    ↓
ChartRace Component (Phase 3)
```

---

## State Management Strategy

### Filter Store (useFilterStore)
```typescript
interface FilterStore {
  team: 'all' | 'blue' | 'white';
  sectors: string[];
  dateRange: { start: string; end: string };
  setTeam: (team) => void;
  setSectors: (sectors) => void;
  setDateRange: (range) => void;
  reset: () => void;
}
```

**Persistence**: localStorage (optional)

### Playback Store (usePlaybackStore)
```typescript
interface PlaybackStore {
  isPlaying: boolean;
  speed: 0.5 | 1 | 2 | 5 | 10;
  currentIndex: number;
  currentDate: string;
  play: () => void;
  pause: () => void;
  setSpeed: (speed) => void;
  seekToIndex: (index) => void;
  reset: () => void;
}
```

**Persistence**: Not needed (reset on page load)

---

## Performance Considerations

### Bundle Size Strategy
- **Target**: < 500KB gzipped (excluding JSON)
- **Code Splitting**: Lazy load routes
- **Tree Shaking**: Import only what's needed
- **Vendor Splitting**: Separate vendor chunk

### JSON Loading Strategy
**Problem**: 9.6MB JSON file is large

**Solutions**:
1. **Lazy Loading**: Only load when needed
2. **Web Worker**: Parse JSON in background thread
3. **Pagination**: Load data in chunks (future)
4. **Compression**: Ensure gzip enabled on CDN
5. **IndexedDB**: Cache in browser (future)

**Phase 2 Approach**: Simple fetch + TanStack Query cache

---

## Styling Guidelines

### TailwindCSS Conventions
- Use `clsx` for conditional classes
- Use `tailwind-merge` to dedupe classes
- Create custom utilities for common patterns
- Avoid inline style objects

### Color Palette
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Blue Team
        'blue-team': {
          50: '#eff6ff',
          // ... (using Tailwind blue scale)
          500: '#3b82f6',
          600: '#2563eb',
        },
        // White Team
        'white-team': {
          // ... (using Tailwind gray scale)
          500: '#6b7280',
          600: '#4b5563',
        },
      },
    },
  },
};
```

---

## Testing Strategy (Phase 2)

### Manual Testing Checklist
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile (iOS and Android)
- [ ] Test all date range presets
- [ ] Test team filter switching
- [ ] Test sector multi-select
- [ ] Test playback controls
- [ ] Test loading states
- [ ] Test error states
- [ ] Test responsive breakpoints
- [ ] Test keyboard navigation

### Automated Testing (Future - Phase 5)
- Unit tests: Vitest
- E2E tests: Playwright
- Visual regression: Chromatic (optional)

---

## Dependencies & Versions

### Required Installations
```bash
# Core
npm install react@^18.3.0 react-dom@^18.3.0

# Routing
npm install @tanstack/react-router@^1.x

# State
npm install zustand@^4.x

# Data fetching
npm install @tanstack/react-query@^5.x

# Styling
npm install -D tailwindcss@^3.x postcss@^8.x autoprefixer@^10.x
npm install clsx@^2.x tailwind-merge@^2.x

# Utilities
npm install date-fns@^3.x lucide-react@^0.x

# Dev tools
npm install -D vite@^5.x @vitejs/plugin-react@^4.x
npm install -D typescript@^5.x @types/react@^18.x @types/react-dom@^18.x
```

---

## Known Issues & Workarounds

### Issue 1: Large JSON File
**Problem**: 9.6MB JSON takes time to download on slow connections

**Workarounds**:
- Show loading indicator
- Display skeleton UI during load
- Consider service worker caching (future)

---

### Issue 2: TanStack Router Learning Curve
**Problem**: Team may not be familiar with file-based routing

**Workarounds**:
- Follow official examples closely
- Start with simple routes
- Document routing patterns in this file

---

## Future Considerations

### Phase 3 Integration Points
- `ChartRacePlaceholder` will be replaced with `ChartRace` component
- D3.js will use filtered data from `useFilteredStocks`
- Playback controls will drive D3.js animation

### Phase 4 Integration Points
- Stock detail modal will use data from `useStockData`
- Comparison charts will use team averages from utilities

---

## Contact & Resources

### Documentation
- React: https://react.dev
- Vite: https://vitejs.dev
- TanStack Router: https://tanstack.com/router
- TanStack Query: https://tanstack.com/query
- Zustand: https://github.com/pmndrs/zustand
- TailwindCSS: https://tailwindcss.com

### Internal Resources
- PRD: `PRD.md`
- Architecture: `PROJECT_KNOWLEDGE.md`
- Troubleshooting: `TROUBLESHOOTING.md`

---

**Document Status**: Living document - update as decisions are made
**Review Frequency**: Weekly during Phase 2
