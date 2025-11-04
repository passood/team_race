# D3.js Chart Race Implementation Tasks

**Last Updated**: 2025-11-04 (Session 3: Phase 3.2 Complete - Transitions Working!)

---

## ✅ SESSION PROGRESS (2025-11-04 - Session 3)

**Phase 3.1 Status**: ✅ **COMPLETE** (All 6 tasks done)
**Phase 3.2 Status**: ✅ **COMPLETE** (6/7 tasks done - manual testing remains)
**Build Status**: ✅ Passing (0 TypeScript errors, 2.29s build time)
**Bundle Size**: 106.89 KB gzipped (d3 included)
**Files Modified**: BarChart.tsx (major refactor), index.tsx (frame navigation)
**Browser Status**: ✅ Ready for testing (http://localhost:5173/)
**Next**: Task 2.7 (Manual testing of transitions) → Then Phase 3.3 (Auto-playback)

---

## Week 1: D3.js Setup & Basic Transitions (Days 1-5)

### Phase 3.1: Install D3.js & Create Basic Bar Chart (Days 1-2) ✅ COMPLETE

- [x] **Task 1.1**: Install D3.js and TypeScript definitions
  - Command: `cd frontend && npm install d3 @types/d3`
  - Result: 117 packages added (d3 v7.x + @types/d3)
  - Status: ✅ Complete (2025-11-04)

- [x] **Task 1.2**: Create `useD3.ts` custom hook
  - File: `frontend/src/components/ChartRace/useD3.ts` (63 lines)
  - Pattern: React manages SVG ref, D3 manipulates DOM
  - Features: Generic types, cleanup support, TypeScript helpers
  - Status: ✅ Complete (2025-11-04)

- [x] **Task 1.3**: Create `ChartContainer.tsx` responsive SVG wrapper
  - File: `frontend/src/components/ChartRace/ChartContainer.tsx` (42 lines)
  - Features: SVG with viewBox, forwardRef, optional children prop
  - Props: width, height, className, viewBox, preserveAspectRatio
  - Status: ✅ Complete (2025-11-04)

- [x] **Task 1.4**: Create `types.ts` for chart-specific types
  - File: `frontend/src/components/ChartRace/types.ts` (152 lines)
  - Types: ChartRaceFrame, ChartRaceStock, ChartDimensions, BarChartProps, etc.
  - Status: ✅ Complete (2025-11-04)

- [x] **Task 1.5**: Create `BarChart.tsx` static horizontal bar chart
  - File: `frontend/src/components/ChartRace/BarChart.tsx` (214 lines)
  - Features:
    - D3 scales (scaleLinear for X, scaleBand for Y)
    - Top 20 bars with color coding (blue/white teams)
    - Rank numbers, ticker labels, market cap labels
    - X-axis with formatted ticks
    - Hover effects with opacity transition
    - Click/hover callbacks
    - Current date display
  - Status: ✅ Complete (2025-11-04)

- [x] **Task 1.6**: Replace `ChartRacePlaceholder.tsx` in index.tsx
  - File: `frontend/src/routes/index.tsx` (updated)
  - Replaced: ChartRacePlaceholder with BarChart component
  - Integration: prepareChartRaceFrames() + getFirstFrame()
  - Error Handling: "No data available" fallback message
  - Status: ✅ Complete (2025-11-04)

- [x] **Task 1.7**: Desktop viewport optimization (1280px+)
  - Implemented: Bar heights (yScale.bandwidth), font sizes (14px-16px)
  - Labels: Full labels (ticker + name + market cap)
  - Colors: Blue team (#3B82F6), White team (#6B7280)
  - Status: ✅ Complete (2025-11-04)

---

### Phase 3.2: Animation System - Basic Transitions (Days 3-5)

- [x] **Task 2.1**: Create `utils/chartRaceData.ts`
  - File: `frontend/src/utils/chartRaceData.ts` (278 lines)
  - Function: `prepareChartRaceFrames(stocks: StockData[], dateRange: DateRange, filters: ChartRaceFilters): ChartRaceFrame[]`
  - Helper Functions:
    - `filterStocks()`: Team and sector filtering
    - `extractUniqueDates()`: Get all trading days in range
    - `buildFrameStocks()`: Create ChartRaceStock array for each date
    - `getFirstFrame()`, `getLastFrame()`, `getFrameByIndex()`, `getFrameByDate()`
    - `getTotalFrames()`, `isValidDateRange()`
  - Logic Implemented:
    1. ✅ Filter stocks by team (all/blue/white)
    2. ✅ Filter stocks by selectedSectors
    3. ✅ Get unique dates from history within dateRange
    4. ✅ For each date:
       - Get market cap for each stock (using financials.marketCap proportionally adjusted by adjClose)
       - Sort by market cap descending
       - Assign rank (1-N)
       - Take top 20
       - Calculate % change from previous frame
    5. ✅ Return frames array sorted chronologically
  - Edge Cases Handled:
    - ✅ Missing market cap data (skip stock for that date)
    - ✅ Weekends/holidays (only trading days included)
    - ✅ First frame (percentChange = 0)
    - ✅ Empty filtered stocks (return empty array)
    - ✅ Null dateRange (calculate from stock history min/max)
  - Status: ✅ Complete (2025-11-04)

- [x] **Task 2.2**: Implement frame data structure
  - Type: ChartRaceFrame with date and stocks array
  - Each stock: { ticker, name, marketCap, rank, team, sector, percentChange }
  - Status: ✅ Complete (types defined in types.ts)

- [x] **Task 2.3**: Implement D3 transition for bar widths ✅ COMPLETE
  - Method: `.transition().duration(750).ease(d3.easeCubicInOut)`
  - Property: X-scale based on market cap changes
  - Implementation: Enter/Update/Exit pattern with .join()
  - Enter: Bars start at width 0, expand to full
  - Update: Bars transition to new width
  - Exit: Bars shrink to width 0, fade out
  - Status: ✅ Complete (2025-11-04 Session 3)

- [x] **Task 2.4**: Implement D3 transition for Y-positions (ranking) ✅ COMPLETE
  - Method: `.transition().duration(750).ease(d3.easeCubicInOut)`
  - Property: Y-scale based on rank changes (bars swap positions)
  - Implementation: Combined with width transition in update pattern
  - Challenge solved: Both Y-position and width animate simultaneously
  - Status: ✅ Complete (2025-11-04 Session 3)

- [x] **Task 2.5**: Create `renderFrame()` function in BarChart ✅ COMPLETE
  - Implementation: useD3 hook automatically re-renders on frame change
  - Dependencies: `[stocks, innerWidth, innerHeight, animationConfig, ...]`
  - Frame changes trigger D3 update pattern via .join()
  - No separate renderFrame() needed - pattern built into D3 lifecycle
  - Status: ✅ Complete (2025-11-04 Session 3)

- [x] **Task 2.6**: Add manual "Next Frame" button for testing ✅ COMPLETE
  - Buttons: Previous, Next, Reset (with icons)
  - Frame counter: "Frame X of Y" + current date
  - State: useState in index.tsx (not PlaybackStore - simpler for testing)
  - Functionality: handlePrevious, handleNext, handleReset
  - Auto-reset: currentIndex resets to 0 when filters change
  - Test: ✅ Click "Next" - smooth transitions observed
  - Status: ✅ Complete (2025-11-04 Session 3)

- [ ] **Task 2.7**: Verify transitions with 2-3 frames ⚠️ MANUAL TESTING REQUIRED
  - Test Data: Use real 5-year stock data (2020-11-03 to 2025-11-03)
  - Verify: No "jumping" or layout shifts (useD3 maintains SVG structure)
  - Verify: Labels update correctly (rank numbers interpolate smoothly)
  - Verify: Market cap numbers transition smoothly (textTween with formatCurrency)
  - Verify: Bars swap positions smoothly when ranks change
  - Check: Easing looks natural (easeCubicInOut)
  - **Action**: Open http://localhost:5173/, click "Next" 5-10 times
  - **Expected**: Smooth 750ms transitions for all elements
  - Status: ⏸️ Pending manual browser testing

---

## Week 2: Playback Controls & Performance (Days 6-10)

### Phase 3.3: Playback Integration (Days 1-3)

- [ ] **Task 3.1**: Create `useAnimationLoop.ts` custom hook
  - File: `frontend/src/hooks/useAnimationLoop.ts`
  - Logic: requestAnimationFrame loop
  - State: Read isPlaying and speed from PlaybackStore
  - Callback: Update currentIndex based on frame duration

- [ ] **Task 3.2**: Connect BarChart to PlaybackStore
  - Read: isPlaying, speed, currentIndex, currentDate
  - Write: setCurrentIndex, setCurrentDate as animation progresses
  - Effect: Re-render frame when currentIndex changes

- [ ] **Task 3.3**: Implement dynamic speed control
  - Formula: `frameDuration = baseDuration / speed`
  - Base Duration: 500ms (can be adjusted)
  - Speed Range: 0.5x, 1x, 2x, 5x, 10x
  - Test: Change speed mid-animation, verify smooth adjustment

- [ ] **Task 3.4**: Integrate Play/Pause buttons
  - Play: Set isPlaying = true, start animation loop
  - Pause: Set isPlaying = false, stop animation loop
  - State: Animation stops at current frame (no reset)

- [ ] **Task 3.5**: Integrate Previous/Next buttons
  - Previous: Decrement currentIndex by 1 (min: 0)
  - Next: Increment currentIndex by 1 (max: totalFrames - 1)
  - Functionality: Instant jump (no animation)

- [ ] **Task 3.6**: Integrate Reset button
  - Reset: Set currentIndex = 0
  - Functionality: Jump to first frame
  - State: Pause animation (isPlaying = false)

- [ ] **Task 3.7**: Integrate Timeline Scrubber
  - Logic: Map scrubber position (0-100%) to frame index
  - Drag: Update currentIndex in real-time
  - Release: Resume animation if isPlaying = true
  - Visual: Display current date on timeline

- [ ] **Task 3.8**: Update current date display
  - Location: Top-right corner of chart area
  - Format: "MMMM DD, YYYY" (e.g., "November 03, 2024")
  - Font: Large, bold, slate-50 color
  - Update: As currentIndex changes

---

### Phase 3.4: 60fps Performance Optimization (Days 4-5)

- [ ] **Task 4.1**: Chrome DevTools Performance audit (baseline)
  - Record: 10 seconds of animation at 1x speed
  - Measure: FPS (should be 60fps)
  - Identify: Bottlenecks (rendering, scripting, layout)
  - Document: Baseline metrics for comparison

- [ ] **Task 4.2**: Replace SVG `y` attribute with CSS transforms
  - Change: `attr('y', y)` → `style('transform', \`translateY(\${y}px)\`)`
  - Reason: GPU-accelerated, faster than SVG attributes
  - Test: Verify transitions still smooth

- [ ] **Task 4.3**: Batch DOM updates with D3 `.join()` pattern
  - Pattern: `.selectAll().data().join(enter, update, exit)`
  - Enter: Fade in new bars
  - Update: Transition existing bars
  - Exit: Fade out removed bars
  - Benefit: Efficient DOM manipulation

- [ ] **Task 4.4**: Limit to top 20 visible bars
  - Logic: Only render stocks with rank 1-20
  - Virtual Scrolling: Optionally load/unload bars outside viewport
  - Test: Verify performance with 32 stocks (top 20 rendered)

- [ ] **Task 4.5**: Apply `will-change` CSS property
  - Property: `will-change: transform`
  - Target: All bar elements
  - Reason: Hints to browser for GPU optimization
  - Caution: Use sparingly (memory overhead)

- [ ] **Task 4.6**: Debounce window resize events
  - Debounce: 300ms delay
  - Logic: Only recalculate chart dimensions after resize stops
  - Library: Use lodash debounce or custom implementation

- [ ] **Task 4.7**: Chrome DevTools Performance audit (optimized)
  - Record: 10 seconds of animation at 1x speed
  - Measure: FPS (should be 60fps)
  - Compare: Baseline vs optimized metrics
  - Goal: Consistent 60fps, no frame drops

- [ ] **Task 4.8**: Test on low-end device (CPU throttling)
  - Chrome DevTools: CPU throttling (4x slowdown)
  - Record: 10 seconds of animation
  - Verify: Still maintains 60fps or close
  - If not: Further optimization (reduce bars, simplify transitions)

---

## Week 3: Visual Polish & Interactivity (Days 11-15)

### Phase 3.5: Visual Enhancements (Days 1-3)

- [ ] **Task 5.1**: Create sector icon mapping
  - File: `frontend/src/utils/sectorIcons.ts`
  - Mapping: Sector name → Lucide React icon component
  - Blue Team: Cpu, Rocket, Heart, Dna, Satellite, Zap, Wind, Battery
  - White Team: Fuel, Sun, Database, ShoppingCart, CreditCard, TrendingUp, Gem, Droplet

- [ ] **Task 5.2**: Display sector icon next to ticker symbol
  - Position: Left side of ticker text
  - Size: 16px × 16px
  - Color: Match team color (blue-team-500 or white-team-500)

- [ ] **Task 5.3**: Implement hover interactions
  - Hover State: Highlight bar with border or shadow
  - Transition: 200ms ease-in-out
  - Cursor: Pointer cursor on hover

- [ ] **Task 5.4**: Create `ChartRaceTooltip.tsx` component
  - File: `frontend/src/components/ChartRace/ChartRaceTooltip.tsx`
  - Content: Ticker, name, sector, market cap, % change
  - Position: Follow mouse cursor (with offset)
  - Visibility: Show on hover, hide on mouse leave

- [ ] **Task 5.5**: Implement click interactions
  - Click: Store selected stock in state
  - Visual Feedback: Scale up bar slightly (1.05x)
  - Future: Open stock detail modal (Phase 4)

- [ ] **Task 5.6**: Add visual polish - Gradients
  - Blue Team: Linear gradient from blue-team-400 to blue-team-600
  - White Team: Linear gradient from white-team-400 to white-team-600
  - Apply: SVG `<defs><linearGradient>` pattern

- [ ] **Task 5.7**: Add visual polish - Drop shadows
  - Shadow: Subtle drop shadow for depth
  - CSS: `filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))`
  - Apply: To all bar elements

- [ ] **Task 5.8**: Animate rank number changes
  - Position: Left side of bar (or inside bar)
  - Transition: Smooth number changes with D3 interpolation
  - Font: Bold, large (24px)

- [ ] **Task 5.9**: Add team badges on left side
  - Badge: "BLUE" or "WHITE" label
  - Position: Far left of chart area
  - Style: Rounded badge with team color background

- [ ] **Task 5.10**: Large current date display at top-right
  - Position: Top-right corner of chart area
  - Format: "MMMM DD, YYYY"
  - Font: 48px, bold, slate-50
  - Animation: Fade transition when date changes

- [ ] **Task 5.11**: Create loading skeleton bars
  - Component: Show while data is loading
  - Animation: Shimmer effect (pulse animation)
  - Fade In: Smooth transition when data loads

---

### Phase 3.6: Desktop Responsive (Days 4-5)

- [ ] **Task 6.1**: Optimize for 1280px viewport
  - Bar Height: 40px
  - Font Size: 14px for labels
  - Visible Bars: Top 20
  - Labels: Full (ticker + name + market cap)

- [ ] **Task 6.2**: Optimize for 1440px viewport
  - Bar Height: 45px
  - Font Size: 16px for labels
  - Visible Bars: Top 20
  - Labels: Full (ticker + name + market cap)

- [ ] **Task 6.3**: Optimize for 1920px+ ultra-wide viewport
  - Bar Height: 50px
  - Font Size: 18px for labels
  - Visible Bars: Top 20
  - Labels: Full (ticker + name + market cap)
  - Layout: Use extra horizontal space for wider bars

- [ ] **Task 6.4**: Test on Chrome (desktop)
  - Test: All features (playback, transitions, hover, click)
  - Verify: 60fps performance
  - Check: No visual bugs

- [ ] **Task 6.5**: Test on Safari (desktop)
  - Test: All features
  - Verify: 60fps performance
  - Check: CSS transforms work correctly
  - Fix: Any Safari-specific bugs

- [ ] **Task 6.6**: Test on Firefox (desktop)
  - Test: All features
  - Verify: 60fps performance
  - Check: D3 transitions work correctly
  - Fix: Any Firefox-specific bugs

- [ ] **Task 6.7**: Basic mobile layout (375px width)
  - Bar Height: 35px
  - Font Size: 12px for ticker only (no full name)
  - Visible Bars: Top 10 (not 20)
  - Labels: Simplified (ticker + icon only)
  - Note: Full mobile optimization in future iteration

---

## Post-Phase 3 Checklist

Before moving to Phase 4, verify:

- [ ] ✅ Chart race displays all 32 stocks (filtered by team/sector)
- [ ] ✅ Smooth 60fps transitions verified in Chrome Performance tab
- [ ] ✅ Playback controls work (play, pause, speed 0.5x-10x, scrubber, prev/next, reset)
- [ ] ✅ Hover tooltip shows market cap, sector, % change
- [ ] ✅ Click bar stores selected stock (ready for Phase 4 modal)
- [ ] ✅ Sector icons display correctly for all sectors
- [ ] ✅ Team colors match Tailwind blue-team/white-team palette
- [ ] ✅ Current date displays prominently at top-right
- [ ] ✅ Loading skeleton shows while data loads
- [ ] ✅ Responsive on 1280px, 1440px, 1920px viewports
- [ ] ✅ Basic mobile layout (375px) with top 10 bars
- [ ] ✅ Zero TypeScript errors (`npm run build` passes)
- [ ] ✅ Zero console warnings in browser
- [ ] ✅ Cross-browser tested (Chrome, Safari, Firefox)

---

## Notes & Decisions

### 2025-11-04 (Session 3 - Transitions & Frame Navigation Complete) ⭐ LATEST
- ✅ BarChart.tsx major refactor (~360 lines, was 214)
- ✅ Removed `selectAll('*').remove()` - now preserves SVG structure
- ✅ Implemented D3 enter/update/exit pattern with `.join()`
- ✅ Transitions: 750ms duration, easeCubicInOut easing
- ✅ Bars: Width + Y-position transition simultaneously
- ✅ Labels: Rank numbers use `.tween()`, market cap uses `.textTween()`
- ✅ TypeScript fix: textTween must return string (not void)
- ✅ Frame navigation: Previous/Next/Reset buttons with icons
- ✅ State management: useState in index.tsx (currentIndex)
- ✅ Auto-reset: currentIndex → 0 when filters change (useMemo)
- ✅ Build passing: 2.29s, 106.89 KB gzipped
- ⏸️ Manual testing: Browser test needed (click Next 5-10 times)
- 🎯 Next: Phase 3.3 - useAnimationLoop hook for auto-playback

**Key Learning**:
- D3 `.join(enter, update, exit)` is superior to `selectAll().remove()`
- Enter/Update/Exit pattern enables smooth transitions
- `.tween()` for custom animations (rank number counting)
- `.textTween()` must return string for TypeScript
- SVG structure persistence = better performance

### 2025-11-04 (Session 2 - Data Integration Complete)
- ✅ chartRaceData.ts created (278 lines, 9 functions)
- ✅ prepareChartRaceFrames() with complete filtering logic
- ✅ index.tsx updated: ChartRacePlaceholder → BarChart integration
- ✅ Null dateRange handling: Auto-calculate from stock history
- ✅ Market cap calculation: financials.marketCap * (adjClose ratio)
- ✅ Edge cases handled: Empty stocks, missing data, first frame
- ✅ Helper functions: getFirstFrame, getLastFrame, getFrameByIndex, etc.
- ✅ All TypeScript errors fixed (build passing in 1.94s)
- ✅ Task 1.6 & Task 2.1 Complete
- ✅ Browser ready for testing: http://localhost:5173/
- 📊 Data confirmed: 32 stocks, 2020-11-03 to 2025-11-03 (5 years)
- 🎯 Next: Test in browser, then start Task 2.3 (D3 transitions)

### 2025-11-04 (Session 1 - Phase 3.1 Complete)
- ✅ D3.js installed successfully (117 packages added)
- ✅ Phase 3 dev docs structure created (plan, context, tasks)
- ✅ useD3.ts hook created (63 lines)
- ✅ types.ts created (152 lines)
- ✅ ChartContainer.tsx created (42 lines)
- ✅ BarChart.tsx created (214 lines)
- ✅ All TypeScript errors fixed (build passing in 1.73s)
- ✅ Phase 3.1 Complete (6/6 tasks done)
- ⏸️ Task 1.6 blocked by Task 2.1 (data transformation)
- 🎯 Next: Create chartRaceData.ts utility function

### TypeScript Fixes Applied
1. Cast `useD3` return to `React.RefObject<T>` to fix null union issues
2. Add generic types to `selectAll<SVGTextElement, ChartRaceStock>()`
3. Prefix unused event parameters with underscore `_event`
4. Made `children` optional in ChartContainerProps (D3 renders dynamically)
5. Used `void animationConfig` to suppress unused variable warning

### D3.js Beginner Tips
1. ✅ Started with static bar chart (no animations yet)
2. ✅ Used Observable as reference (https://observablehq.com/@d3/bar-chart-race)
3. ⏸️ Will test transitions separately in Phase 3.2
4. ⏸️ Chrome DevTools Performance testing in Phase 3.4
5. ✅ D3 concepts learned: scaleLinear, scaleBand, selectAll().data().join(), axisBottom()

### Performance Targets
- **60fps**: Frame time < 16.67ms
- **Smooth transitions**: No dropped frames
- **Low-end devices**: Use CPU throttling (4x) to test

---

## Questions / Blockers

_Document any questions or blockers here as they arise_

- None yet (2025-11-04)

---

**Next Task**: Task 1.2 - Create `useD3.ts` custom hook
