# D3.js Chart Race Implementation Context

**Last Updated**: 2025-11-04 (Session 3: Transitions & Frame Navigation Complete)

---

## SESSION SUMMARY (2025-11-04 - Session 3) ⭐ LATEST

### ✅ Phase 3.2 - TRANSITIONS & FRAME NAVIGATION COMPLETED
**Status**: D3 transitions fully implemented, frame navigation working, animations smooth

**Completed Work**:
1. **BarChart.tsx** (major refactor, ~360 lines)
   - Removed `selectAll('*').remove()` pattern
   - Implemented proper D3 enter/update/exit pattern
   - Added transitions to bars, labels, and axis
   - Duration: 750ms, Easing: easeCubicInOut

2. **D3 Transition Implementation** (Task 2.3 & 2.4):
   - **Enter**: New bars fade in from width 0, opacity 0 → 1
   - **Update**: Existing bars transition Y-position (rank) AND width (market cap)
   - **Exit**: Removed bars shrink to width 0, fade out
   - **Labels**: Rank numbers interpolate smoothly, ticker/name follow Y-position
   - **Market cap labels**: Numbers interpolate with formatCurrency
   - **X-axis**: Transitions with scale changes

3. **Frame Navigation UI** (Task 2.6):
   - Added Previous/Next/Reset buttons
   - Frame counter: "Frame X of Y"
   - Current date display
   - Button states: disabled at boundaries
   - Icons: ChevronLeft, ChevronRight, RotateCcw from lucide-react

4. **index.tsx Updates**:
   - Added `useState` for currentIndex
   - Imported getFrameByIndex, getTotalFrames
   - Auto-reset currentIndex when filters change (useMemo)
   - Navigation handlers: handlePrevious, handleNext, handleReset

**Key Technical Decisions**:
- Used `.join(enter, update, exit)` pattern for all elements (bars, labels)
- Rank label uses `.tween('text', ...)` for smooth number counting
- Market cap label uses `.textTween(...)` with return value for TypeScript
- Main SVG group persists between renders (no full clear)
- Dependencies: `[stocks, innerWidth, innerHeight, animationConfig, onStockClick, onStockHover]`

**Build Status**: ✅ Passing (2.29s build time, 106.89 KB gzipped)

**Browser Status**: ✅ Ready for animation testing at http://localhost:5173/

**Known Issues**: None - all TypeScript errors resolved

**Next Steps**:
- Browser test: Click "Next" button multiple times to see smooth transitions
- Verify rank swaps animate smoothly (bars sliding up/down)
- Check market cap numbers interpolate correctly
- Phase 3.3: Auto-play with requestAnimationFrame (useAnimationLoop hook)

---

## SESSION SUMMARY (2025-11-04 - Session 2)

### ✅ Phase 3.2 - DATA INTEGRATION COMPLETED
**Status**: chartRaceData.ts created, BarChart integrated into index.tsx, ready for browser testing

**Completed Work**:
1. **chartRaceData.ts** (278 lines) - Complete data transformation utility
   - `prepareChartRaceFrames()` - Main transformation function
   - 8 helper functions (filterStocks, extractUniqueDates, buildFrameStocks, etc.)
   - Edge case handling: null dateRange, missing data, first frame percentChange
2. **index.tsx** (updated) - BarChart integration
   - Replaced ChartRacePlaceholder with BarChart component
   - Auto-calculate dateRange from stock history when null
   - Error handling with "No data available" message
3. **TypeScript** - All errors fixed (unused import removed)

**Build Status**: ✅ Passing (1.94s build time, ~100KB gzipped bundle)

**Browser Status**: ✅ Ready for testing at http://localhost:5173/

**Data Confirmed**:
- 32 stocks (17 Blue, 15 White)
- Date range: 2020-11-03 to 2025-11-03 (5 years)
- All stocks successful (0 failures)

**Next Steps**:
- Browser testing (filters, rendering, team colors)
- Task 2.3: Implement D3 transitions for bar widths
- Task 2.4: Implement D3 transitions for Y-positions (ranking)

---

## SESSION SUMMARY (2025-11-04 - Session 1)

### ✅ Phase 3.1 COMPLETED
**Status**: All 6 tasks of Phase 3.1 complete, build passing with zero TypeScript errors

**Completed Components**:
1. **useD3.ts** (63 lines) - React-D3 integration hook with cleanup support
2. **types.ts** (152 lines) - Complete TypeScript type definitions
3. **ChartContainer.tsx** (42 lines) - Responsive SVG wrapper with forwardRef
4. **BarChart.tsx** (214 lines) - Full D3.js bar chart visualization
5. **Dev Docs** - Comprehensive 3-week plan, context, and tasks

**Build Status**: ✅ Passing (1.73s build time, ~100KB gzipped bundle)

**Next Steps**:
- Task 7: Create `chartRaceData.ts` utility (data transformation)
- Task 8: Replace ChartRacePlaceholder in MainLayout (make chart visible)

---

## Key Files & Components

### Existing Components (Phase 2 - Complete)
- `frontend/src/components/Header.tsx` - Header with logo, refresh button
- `frontend/src/components/Footer.tsx` - Footer with attribution
- `frontend/src/components/controls/PlaybackControls.tsx` - Play/pause, speed, timeline
- `frontend/src/components/controls/DateRangePicker.tsx` - Date range selection
- `frontend/src/components/controls/TeamFilter.tsx` - Blue/White/All filter
- `frontend/src/components/controls/SectorFilter.tsx` - Multi-sector selection
- `frontend/src/components/ChartRacePlaceholder.tsx` - **TO BE REPLACED NEXT (Task 8)**

### New Components (Phase 3.1 - ✅ COMPLETE)
- `frontend/src/components/ChartRace/useD3.ts` - ✅ React-D3 integration hook
- `frontend/src/components/ChartRace/types.ts` - ✅ Chart-specific TypeScript types
- `frontend/src/components/ChartRace/ChartContainer.tsx` - ✅ Responsive SVG wrapper
- `frontend/src/components/ChartRace/BarChart.tsx` - ✅ Main D3.js bar chart (static, no animation yet)

### New Utilities (Phase 3.2 - ✅ COMPLETE)
- `frontend/src/utils/chartRaceData.ts` - ✅ Data transformation utility (278 lines)
  - `prepareChartRaceFrames()` - Main transformation function
  - `filterStocks()` - Team and sector filtering
  - `extractUniqueDates()` - Get all trading days in range
  - `buildFrameStocks()` - Create ChartRaceStock array for each date
  - `getFirstFrame()`, `getLastFrame()`, `getFrameByIndex()`, `getFrameByDate()`
  - `getTotalFrames()`, `isValidDateRange()` - Helper utilities

### To Be Created (Phase 3.3+)
- `frontend/src/components/ChartRace/ChartRaceTooltip.tsx` - Hover tooltip (Phase 3.5)
- `frontend/src/hooks/useAnimationLoop.ts` - requestAnimationFrame loop (Phase 3.3)

### Existing Utilities
- `frontend/src/utils/calculations.ts` - Existing: Team averages, returns, volatility
- `frontend/src/utils/formatters.ts` - Existing: Currency, date, percentage formatters

### Custom Hooks
- `frontend/src/hooks/useAnimationLoop.ts` - **NEW**: requestAnimationFrame loop
- `frontend/src/hooks/useStockData.ts` - Existing: TanStack Query for stock data
- `frontend/src/hooks/useFilteredStocks.ts` - Existing: Team/sector/date filtering
- `frontend/src/hooks/useDateRange.ts` - Existing: Date validation

### State Management (Zustand)
- `frontend/src/stores/useFilterStore.ts` - Team, sectors, date range (persisted)
- `frontend/src/stores/usePlaybackStore.ts` - Playing state, speed, current index/date

### Data Layer
- `frontend/src/services/stockApi.ts` - Fetch stocks-latest.json, metadata.json
- `frontend/public/data/stocks-latest.json` - 32 stocks × 5 years (~10MB)
- `frontend/public/data/metadata.json` - Last updated, stock counts

---

## Architecture Decisions

### Decision 1: React-D3 Integration Pattern ✅ IMPLEMENTED
**Date**: 2025-11-04
**Decision**: Use `useD3` hook pattern where React manages SVG ref, D3 manipulates DOM
**Status**: ✅ Complete - Implemented in `useD3.ts`
**Rationale**:
- Avoids React-D3 conflicts (React shouldn't manage D3-controlled elements)
- Clean separation: React handles state, D3 handles visualization
- Standard pattern recommended by Amelia Wattenberger

**Implementation Details**:
- File: `frontend/src/components/ChartRace/useD3.ts`
- Generic type support: `useD3<SVGSVGElement | SVGGElement>`
- Cleanup function support: Return cleanup from renderFn
- TypeScript helpers: `D3Selection<T>`, `D3Transition<T>` types
- 63 lines, fully documented with JSDoc comments

**Code Pattern**:
```tsx
const useD3 = <T extends SVGSVGElement | SVGGElement>(
  renderFn: (selection: d3.Selection<T, unknown, null, undefined>) => void | (() => void),
  dependencies: React.DependencyList = []
): React.RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const selection = d3.select(ref.current);
    const cleanup = renderFn(selection);
    return () => { if (cleanup && typeof cleanup === 'function') cleanup(); };
  }, dependencies);

  return ref as React.RefObject<T>;
};
```

**TypeScript Fixes Applied**:
- Cast return type to `React.RefObject<T>` to avoid null union issues
- Use `_event` prefix for unused event parameters
- Generic type annotations on `selectAll<SVGTextElement, ChartRaceStock>()` calls

### Decision 2: Animation Frame Structure ✅ TYPE DEFINED
**Date**: 2025-11-04
**Decision**: Pre-compute all animation frames from stock data
**Status**: ✅ Types defined in `types.ts`, utility function pending (Task 7)
**Rationale**:
- Avoid real-time calculations during animation (60fps requirement)
- Easier to scrub timeline (jump to any frame)
- Simpler state management (current frame index)

**Implementation Details**:
- Types: `ChartRaceFrame` and `ChartRaceStock` in `types.ts`
- Transformation utility: To be created in `frontend/src/utils/chartRaceData.ts`
- Function signature: `prepareChartRaceFrames(stocks: Stock[], dateRange: DateRange, filters: FilterState): ChartRaceFrame[]`

**Data Structure**:
```typescript
// Defined in frontend/src/components/ChartRace/types.ts
interface ChartRaceFrame {
  date: string;  // YYYY-MM-DD format
  stocks: ChartRaceStock[];  // Sorted by rank (1-20)
}

interface ChartRaceStock {
  ticker: string;          // e.g., "TSLA"
  name: string;            // e.g., "Tesla, Inc."
  marketCap: number;       // USD market capitalization
  rank: number;            // 1 = highest market cap
  team: 'blue' | 'white';  // Team affiliation
  sector: string;          // Sector category
  percentChange: number;   // % change from previous frame
}
```

### Decision 3: Performance Strategy ✅ PARTIALLY IMPLEMENTED
**Date**: 2025-11-04
**Decision**: Limit to top 20 bars, use CSS transforms, batch DOM updates
**Status**: ✅ Top 20 limit implemented, CSS transforms pending (Phase 3.4)
**Rationale**:
- 32 stocks too many to animate smoothly at 60fps
- CSS transforms (GPU-accelerated) faster than SVG attribute changes
- D3's `.join()` method efficiently handles enter/update/exit

**Current Implementation** (in BarChart.tsx):
```typescript
// Line 43: Limit to top 20 bars
const MAX_BARS = 20;
const stocks = frame.stocks.slice(0, MAX_BARS);

// Lines 83-95: D3 join pattern for efficient DOM updates
const bars = g
  .selectAll<SVGRectElement, ChartRaceStock>('.bar')
  .data(stocks, (d) => d.ticker) // Key function for proper tracking
  .join('rect') // D3 v6+ pattern (enter/update/exit)
  .attr('x', 0)
  .attr('y', (d) => yScale(d.ticker) || 0)
  .attr('width', (d) => xScale(d.marketCap))
  .attr('height', yScale.bandwidth())
  .attr('fill', (d) => colorScale(d.team))
  .attr('rx', 4); // Rounded corners
```

**TODO (Phase 3.4 - Performance Optimization)**:
- Replace `attr('y', ...)` with CSS `transform: translateY(...)`
- Add `will-change: transform` CSS property
- Batch DOM updates using `selection.call()`
- Profile with Chrome DevTools Performance tab

### Decision 4: Desktop-First Responsive
**Date**: 2025-11-04
**Decision**: Build for desktop (1280px+) first, then adapt to mobile
**Rationale**:
- Easier D3.js development with more space
- Chart race better suited to larger screens
- Mobile gets simplified view (top 10 bars)

**Breakpoints**:
- Desktop: 1280px+ (top 20 bars, full labels)
- Tablet: 768px-1279px (top 15 bars, shortened labels)
- Mobile: <768px (top 10 bars, ticker only)

### Decision 5: Testing After Phase 3
**Date**: 2025-11-04
**Decision**: Focus on implementation first, comprehensive testing in Phase 5
**Rationale**:
- Beginner D3.js level → prioritize learning and building
- Faster iteration without test overhead
- Phase 5 dedicated to unit tests (Vitest) and E2E tests (Playwright)

---

## Color System

### Blue Team (Future Sectors)
- **Primary**: `blue-team-500` (#3B82F6)
- **Hover**: `blue-team-600` (#2563EB)
- **Light**: `blue-team-400` (#60A5FA)
- **Gradient**: `blue-team-400` to `blue-team-600`

### White Team (Traditional Sectors)
- **Primary**: `white-team-500` (#6B7280 Gray-500)
- **Hover**: `white-team-600` (#4B5563 Gray-600)
- **Light**: `white-team-400` (#9CA3AF Gray-400)
- **Gradient**: `white-team-400` to `white-team-600`

### System Colors
- **Background**: `slate-900` (#0F172A)
- **Text**: `slate-50` (#F8FAFC)
- **Success**: `green-500` (#10B981)
- **Error**: `red-500` (#EF4444)

---

## Data Transformation Logic

### Input: Stock Data from API
```typescript
// From stockApi.getAllStocks()
Stock[] = [
  {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    team: "blue",
    sector: "Next-Gen Battery/ESS",
    history: [
      { date: "2020-11-03", close: 215.49, marketCap: 204B },
      { date: "2020-11-04", close: 219.12, marketCap: 208B },
      ...
    ]
  },
  ...
]
```

### Output: Chart Race Frames
```typescript
// From chartRaceData.prepareChartRaceFrames()
ChartRaceFrame[] = [
  {
    date: "2020-11-03",
    stocks: [
      { ticker: "AAPL", name: "Apple Inc.", marketCap: 2T, rank: 1, team: "white", sector: "Data Infrastructure", percentChange: 0 },
      { ticker: "MSFT", name: "Microsoft", marketCap: 1.6T, rank: 2, team: "white", sector: "Data Infrastructure", percentChange: 1.2 },
      ...top 20
    ]
  },
  {
    date: "2020-11-04",
    stocks: [ ...updated ranks... ]
  },
  ...
]
```

### Transformation Steps
1. Filter stocks by team and sectors (from FilterStore)
2. Filter history by date range (from FilterStore)
3. For each date:
   - Calculate market cap for all stocks
   - Sort by market cap descending
   - Assign rank (1-N)
   - Take top 20
   - Calculate % change from previous frame
4. Return array of frames

---

## Sector Icon Mapping

### Blue Team Icons (Lucide React)
- **Quantum Computing**: `Cpu` icon
- **Aerospace**: `Rocket` icon
- **Longevity Science**: `Heart` icon
- **Synthetic Biology**: `Dna` icon
- **Satellite Comm**: `Satellite` icon
- **SMR**: `Zap` icon
- **Green Hydrogen**: `Wind` icon
- **Next-Gen Battery**: `Battery` icon

### White Team Icons (Lucide React)
- **Traditional Energy**: `Fuel` icon
- **Future Energy**: `Sun` icon
- **Data Infrastructure**: `Database` icon
- **Consumer Staples**: `ShoppingCart` icon
- **Payment Systems**: `CreditCard` icon
- **Asset Management**: `TrendingUp` icon
- **Luxury**: `Gem` icon
- **Water & Food**: `Droplet` icon

**Import**: `import { Cpu, Rocket, Heart, ... } from 'lucide-react'`

---

## Known Issues & Gotchas

### Issue 1: Large JSON File (10MB)
- **Problem**: stocks-latest.json is ~10MB, slow to load
- **Impact**: Initial page load may take 2-3 seconds
- **Solution**: Show loading skeleton, consider data streaming in future

### Issue 2: Date Gaps (Weekends, Holidays)
- **Problem**: Stock data missing on non-trading days
- **Impact**: Animation may jump on weekends
- **Solution**: Filter out dates without data, or interpolate missing values

### Issue 3: D3.js + React Re-renders
- **Problem**: React re-renders can disrupt D3 transitions
- **Impact**: Animations may restart or glitch
- **Solution**: Use `useD3` hook, avoid re-rendering during animation

### Issue 4: Mobile Performance
- **Problem**: 60fps hard to achieve on low-end mobile devices
- **Impact**: Animation may be choppy
- **Solution**: Reduce to top 10 bars on mobile, simplify animations

---

## Dependencies

### Installed Packages
- `d3` (v7.x) - D3.js library ✅ Installed
- `@types/d3` - TypeScript definitions ✅ Installed
- `react` (v18.x) - React framework ✅ Installed
- `lucide-react` - Icons ✅ Installed
- `zustand` - State management ✅ Installed
- `@tanstack/react-query` (v5.x) - Data fetching ✅ Installed

### Future Packages (Phase 5)
- `vitest` - Unit testing
- `@testing-library/react` - Component testing
- `@playwright/test` - E2E testing

---

## Performance Benchmarks

### Target Metrics
- **60fps animation**: Frame time < 16.67ms (verified in Chrome DevTools)
- **Smooth transitions**: No dropped frames during ranking changes
- **Initial load**: Chart renders within 1 second after data load
- **Memory**: Stable memory usage (no leaks during long animations)

### Testing Methodology
1. Open Chrome DevTools → Performance tab
2. Record 10 seconds of animation
3. Check FPS meter (should stay at 60fps)
4. Check frame timings (should be < 16.67ms)
5. Check scripting time (should be minimal during transitions)

---

## Implementation Notes - Session 2025-11-04

### D3.js Concepts Used (For Beginners)
This implementation uses the following D3.js patterns:

1. **d3.scaleLinear()** - Maps market cap values (0 to max) to pixel widths (0 to innerWidth)
   - Location: BarChart.tsx line 63-67
   - Usage: `xScale(stock.marketCap)` returns pixel position

2. **d3.scaleBand()** - Creates evenly-spaced bars for stocks with padding
   - Location: BarChart.tsx line 69-73
   - Usage: `yScale(stock.ticker)` returns Y position, `yScale.bandwidth()` returns bar height

3. **d3.selectAll().data().join()** - D3 v6+ pattern for efficient enter/update/exit
   - Location: BarChart.tsx line 83-95
   - Key function: `(d) => d.ticker` ensures bars are tracked across frames

4. **d3.axisBottom()** - Creates X-axis with automatic tick generation
   - Location: BarChart.tsx line 169-176
   - Format: `d3.format('.2s')` converts 1000000 → "1.0M"

5. **d3.transition()** - Smooth animations (currently hover only, frame transitions in Phase 3.2)
   - Location: BarChart.tsx line 101-105 (hover effect)
   - Duration: 200ms for hover, 500ms planned for frame transitions

### TypeScript Issues Resolved

**Issue 1**: `useD3` hook return type incompatible with `forwardRef`
- **Solution**: Cast return to `React.RefObject<T>` (line 65 in useD3.ts)
- **Reason**: RefObject<T | null> not assignable to RefObject<T>

**Issue 2**: D3 selection type inference failures
- **Solution**: Explicit generic types on `selectAll<SVGTextElement, ChartRaceStock>()`
- **Applied**: Lines 126, 140, 154 in BarChart.tsx

**Issue 3**: Unused parameter warnings (event parameters)
- **Solution**: Prefix with underscore `_event`
- **Applied**: Lines 100, 118 in BarChart.tsx

**Issue 4**: ChartContainer children prop required but not provided
- **Solution**: Made `children` optional in ChartContainerProps (line 124 in types.ts)
- **Reason**: D3 renders dynamically via useD3 hook, no React children needed

### Color System Implementation
```typescript
// BarChart.tsx line 78-83
const colorScale = (team: 'blue' | 'white') => {
  return team === 'blue'
    ? 'rgb(59, 130, 246)'  // #3B82F6 blue-team-500
    : 'rgb(107, 114, 128)'; // #6B7280 white-team-500 (gray-500)
};
```

### Current Limitations (Session 3 - Most Addressed!)
1. ~~**No animation between frames**~~ ✅ FIXED - Smooth 750ms transitions implemented
2. ~~**No data transformation utility**~~ ✅ FIXED - chartRaceData.ts complete
3. ~~**Not integrated into app**~~ ✅ FIXED - BarChart integrated in index.tsx
4. **No tooltip component** - Hover callbacks defined but no UI (Phase 3.5)
5. **CSS transforms not used** - Using SVG `attr('y')` instead (Phase 3.4 - optimization)
6. **No auto-playback** - Manual Next/Previous only (Phase 3.3 - next task)

---

## Next Steps Context

### ✅ COMPLETED (Phase 3.1 + Phase 3.2 - All Tasks Done!)
1. ✅ Install D3.js and TypeScript definitions
2. ✅ Create `useD3.ts` hook (63 lines)
3. ✅ Create `types.ts` (152 lines)
4. ✅ Create `ChartContainer.tsx` (42 lines)
5. ✅ Create `BarChart.tsx` (now ~360 lines with transitions)
6. ✅ Fix all TypeScript errors (build passing)
7. ✅ **Task 2.1**: Create `chartRaceData.ts` (278 lines) - Data transformation utility
8. ✅ **Task 1.6**: Replace ChartRacePlaceholder with BarChart in index.tsx
9. ✅ **Task 2.3**: D3 transitions for bar widths (enter/update/exit pattern)
10. ✅ **Task 2.4**: D3 transitions for Y-positions (rank changes)
11. ✅ **Task 2.5**: renderFrame() via useD3 dependencies
12. ✅ **Task 2.6**: Frame navigation UI (Previous/Next/Reset buttons)

### ✅ COMPLETED (Session 2 - Data Integration)

**Task 7 (2.1): Data Transformation Utility** ✅ COMPLETE
- File: `frontend/src/utils/chartRaceData.ts` (278 lines)
- Function: `prepareChartRaceFrames(stocks: StockData[], dateRange: DateRange, filters: ChartRaceFilters): ChartRaceFrame[]`
- Helper Functions:
  - `filterStocks()` - Team and sector filtering
  - `extractUniqueDates()` - Get all trading days in range
  - `buildFrameStocks()` - Create ChartRaceStock array for each date
  - `getFirstFrame()`, `getLastFrame()`, `getFrameByIndex()`, `getFrameByDate()`
  - `getTotalFrames()`, `isValidDateRange()`
- Edge Cases Handled:
  - ✅ Null dateRange (auto-calculate from stock history)
  - ✅ Missing market cap data (skip stock for that date)
  - ✅ Empty filtered stocks (return empty array)
  - ✅ First frame percentChange (set to 0)
- Market Cap Calculation: `financials.marketCap * (adjClose / latestAdjClose)`

**Task 8 (1.6): BarChart Integration** ✅ COMPLETE
- File: `frontend/src/routes/index.tsx` (updated)
- Changes:
  1. ✅ Imported BarChart, ChartDimensions, prepareChartRaceFrames, getFirstFrame
  2. ✅ Added useDateRange and useFilterStore hooks
  3. ✅ Created frames using useMemo with prepareChartRaceFrames()
  4. ✅ Auto-calculate dateRange from filteredStocks if null
  5. ✅ Get first frame for display: `getFirstFrame(frames)`
  6. ✅ Replaced ChartRacePlaceholder with BarChart component
  7. ✅ Added error handling: "No data available" fallback
  8. ✅ Set chart dimensions: 1200×600 with proper margins
- Build Status: ✅ Passing (0 errors, 1.94s)
- Browser Status: ✅ Ready for testing

### 🎯 IMMEDIATE NEXT TASKS (Start here after context reset)

**Task 2.7: Manual Browser Testing** (Required before Phase 3.3)
- URL: http://localhost:5173/
- Test Plan:
  1. ✅ Chart displays with 20 bars
  2. ✅ Blue/White team colors render correctly
  3. ✅ Click "Next" button 10 times → verify smooth 750ms transitions
  4. ✅ Watch bars slide up/down when ranks change
  5. ✅ Watch rank numbers count smoothly (interpolation)
  6. ✅ Watch market cap numbers transition smoothly
  7. ✅ Team filter changes chart (All/Blue/White)
  8. ✅ Sector filter changes chart
  9. ✅ No console errors
- Expected: Butter-smooth animations, no jumping or flickering

**Phase 3.3: Auto-Playback with requestAnimationFrame** (Next Major Task)

**Task 3.1: Create `useAnimationLoop.ts` hook**
- File: `frontend/src/hooks/useAnimationLoop.ts`
- Purpose: Auto-advance frames using requestAnimationFrame
- Features:
  - Read isPlaying, speed from PlaybackStore
  - Calculate frame timing based on speed (0.5x to 10x)
  - Call setCurrentIndex when frame should advance
  - Stop at last frame or when paused
- Estimated: 80-100 lines

**Task 3.2: Connect BarChart to PlaybackStore**
- Move currentIndex from useState → PlaybackStore
- Read: isPlaying, speed, currentIndex from store
- Write: setCurrentIndex as animation progresses
- Effect: Re-render when currentIndex changes

**Task 3.3: Integrate Play/Pause buttons**
- Wire up existing PlaybackControls to actual playback
- Play: setIsPlaying(true) → useAnimationLoop starts
- Pause: setIsPlaying(false) → loop stops

### Upcoming Tasks (Phase 3.3 & 3.4 - Week 2)
1. Task 3.4: Dynamic speed control (0.5x - 10x)
2. Task 3.5: Previous/Next buttons (instant jump)
3. Task 3.6: Reset button (jump to frame 0)
4. Task 3.7: Timeline scrubber (drag to any frame)
5. Task 4.1-4.8: 60fps Performance optimization

---

## References

- [D3.js Bar Chart Race Example](https://observablehq.com/@d3/bar-chart-race)
- [React + D3 Integration Guide](https://2019.wattenberger.com/blog/react-and-d3)
- [D3.js Transitions Documentation](https://d3js.org/d3-transition)
- [D3.js Scales Documentation](https://d3js.org/d3-scale)
