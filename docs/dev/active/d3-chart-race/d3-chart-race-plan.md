# D3.js Chart Race Implementation Plan

**Task**: Phase 3 - D3.js Chart Race Animation
**Timeline**: 3 weeks (15 working days)
**Status**: In Progress
**Started**: 2025-11-04
**Last Updated**: 2025-11-04

---

## Overview

Implement a fully-functional chart race animation using D3.js v7 integrated with React 18. The chart race will display the top 20 stocks (Blue Team vs White Team) with smooth 60fps animations, playback controls, and interactive features.

**User Profile**:
- D3.js Experience: Beginner
- Priority: Desktop-first (1280px+)
- Testing Strategy: After Phase 3 completes
- Approach: Full implementation (not prototype)

---

## Phase 3 Breakdown (3 Weeks)

### Week 1: D3.js Setup & Basic Transitions (Days 1-5)

**Phase 3.1: Install D3.js & Create Basic Bar Chart (Days 1-2)** ✅ IN PROGRESS
- [x] Install d3 and @types/d3 packages
- [ ] Create `useD3.ts` hook for React-D3 integration
- [ ] Build `ChartContainer.tsx` responsive SVG component
- [ ] Create `BarChart.tsx` static horizontal bar chart
- [ ] Apply blue-team/white-team Tailwind colors
- [ ] Desktop viewport optimization (1280px+)

**Phase 3.2: Animation System - Basic Transitions (Days 3-5)**
- [ ] Create `utils/chartRaceData.ts` - Transform stock data into frames
- [ ] Implement D3 transitions for bar width changes
- [ ] Implement D3 transitions for Y-position changes (ranking)
- [ ] Use `d3.easeCubicInOut` for smooth motion
- [ ] Add manual "next frame" button for testing
- [ ] Verify transitions work for 2-3 frames

### Week 2: Playback Controls & Performance (Days 6-10)

**Phase 3.3: Playback Integration (Days 1-3)**
- [ ] Connect chart to PlaybackStore (isPlaying, speed, currentIndex)
- [ ] Implement `useAnimationLoop` custom hook with requestAnimationFrame
- [ ] Dynamic speed control (0.5x to 10x multiplier)
- [ ] Timeline scrubber integration (drag to any date)
- [ ] Play/Pause/Previous/Next/Reset button functionality
- [ ] Update currentDate in store as animation progresses

**Phase 3.4: 60fps Performance Optimization (Days 4-5)**
- [ ] Chrome DevTools Performance profiling (record 10s animation)
- [ ] Use CSS transforms (`translateY`) instead of `attr('y')`
- [ ] Batch DOM updates with `d3.selection.data()` enter/update/exit
- [ ] Limit to top 20 visible bars (virtual scrolling if needed)
- [ ] Apply `will-change` CSS property for animated elements
- [ ] Debounce window resize events
- [ ] Verify 60fps on low-end devices (CPU throttling test)

### Week 3: Visual Polish & Interactivity (Days 11-15)

**Phase 3.5: Visual Enhancements (Days 1-3)**
- [ ] Map sectors to Lucide React icons
- [ ] Display sector icon next to ticker symbol
- [ ] Hover interactions: Highlight bar + tooltip with market cap details
- [ ] Click interactions: Prepare for stock detail modal (Phase 4)
- [ ] Visual polish: Add gradients and drop shadows to bars
- [ ] Animate rank number changes (smooth number transitions)
- [ ] Add team badges (Blue/White) on left side of bars
- [ ] Large current date display at top-right corner
- [ ] Loading skeleton bars with fade-in animation

**Phase 3.6: Desktop Responsive (Days 4-5)**
- [ ] Optimize for 1280px viewport
- [ ] Optimize for 1440px viewport
- [ ] Optimize for 1920px+ ultra-wide viewport
- [ ] Adjust bar heights and font sizes per breakpoint
- [ ] Test on Chrome, Safari, Firefox (desktop)
- [ ] Basic mobile layout (375px) - simplified, top 10 bars only

---

## D3.js Learning Resources (Beginner-Friendly)

### Essential Reading
1. **Observable D3.js Tutorials**: https://observablehq.com/@d3/learn-d3
2. **D3.js Official Documentation**: https://d3js.org/
3. **React + D3 Integration**: https://2019.wattenberger.com/blog/react-and-d3

### Key Concepts to Learn
- **Selections**: `d3.select()`, `d3.selectAll()`
- **Data Binding**: `.data()`, `.join()` (D3 v6+ pattern)
- **Transitions**: `.transition()`, `.duration()`, `.ease()`
- **Scales**: `d3.scaleLinear()`, `d3.scaleBand()`
- **Axes**: `d3.axisBottom()`, `d3.axisLeft()`

### Code Examples
- **Bar Chart Race**: https://observablehq.com/@d3/bar-chart-race
- **Smooth Transitions**: https://observablehq.com/@d3/sortable-bar-chart

---

## Technical Architecture

### Component Structure
```
frontend/src/
├── components/
│   └── ChartRace/
│       ├── ChartContainer.tsx      # Responsive SVG wrapper
│       ├── BarChart.tsx            # Main chart race component
│       ├── useD3.ts                # React-D3 integration hook
│       ├── ChartRaceTooltip.tsx    # Hover tooltip
│       └── types.ts                # Chart-specific TypeScript types
├── utils/
│   └── chartRaceData.ts            # Data transformation for frames
└── hooks/
    └── useAnimationLoop.ts          # requestAnimationFrame loop
```

### Data Flow
```
Stock Data (from API)
  ↓
chartRaceData.ts → prepareChartRaceFrames()
  ↓
Array of Frames [{ date, stocks: [...] }]
  ↓
BarChart.tsx → D3.js rendering
  ↓
60fps Animation (requestAnimationFrame)
```

### State Management
- **PlaybackStore** (Zustand):
  - `isPlaying: boolean`
  - `speed: number` (0.5x to 10x)
  - `currentIndex: number`
  - `currentDate: string`
  - `setIsPlaying()`, `setSpeed()`, `setCurrentIndex()`

- **FilterStore** (Zustand):
  - `team: 'all' | 'blue' | 'white'`
  - `selectedSectors: string[]`
  - `dateRange: { start: string, end: string }`

---

## Performance Requirements

### Critical Metrics
- **60fps animation**: Verified with Chrome DevTools Performance tab
- **Smooth transitions**: No frame drops during ranking changes
- **Responsive**: Works on 1280px, 1440px, 1920px viewports
- **Fast initial load**: Chart renders within 1 second of data load

### Optimization Strategies
1. **CSS Transforms**: Use `transform: translateY()` instead of SVG `y` attribute
2. **Batch Updates**: Update all bars in a single D3 transition batch
3. **Virtual Scrolling**: Only render top 20 bars (or top 10 on mobile)
4. **Debouncing**: Debounce window resize events (300ms)
5. **Will-Change**: Apply `will-change: transform` to animated bars

---

## Success Criteria

### Functional Requirements
- ✅ Chart race displays all 32 stocks (filtered by team/sector)
- ✅ Smooth 60fps transitions verified in Performance tab
- ✅ Playback controls work (play, pause, speed, scrubber, prev/next, reset)
- ✅ Hover tooltip shows market cap, sector, % change
- ✅ Click bar prepares for modal (Phase 4)
- ✅ Sector icons display correctly
- ✅ Team colors match Tailwind blue-team/white-team palette
- ✅ Zero TypeScript errors
- ✅ Zero console warnings

### Technical Requirements
- ✅ D3.js v7 integrated with React 18
- ✅ useD3 hook pattern for React-D3 integration
- ✅ requestAnimationFrame for animation loop
- ✅ Responsive SVG using viewBox
- ✅ CSS transforms for performance

---

## Risk Mitigation

### Identified Risks
1. **D3.js Learning Curve** (High Probability, High Impact)
   - Mitigation: Use Observable examples, follow established patterns, start simple
2. **60fps Performance Not Achievable** (Medium Probability, High Impact)
   - Mitigation: CSS transforms, virtual scrolling, limit to top 20 bars
3. **React-D3 Integration Complexity** (Medium Probability, Medium Impact)
   - Mitigation: Use useD3 hook pattern, let D3 manage DOM, React manage state

---

## Next Steps After Phase 3

Once Phase 3 is complete:
1. **Phase 4**: Stock Detail Modal & Team Comparison Charts (1 week)
2. **Phase 5**: Unit & E2E Testing (1 week)
3. **Phase 6**: Vercel Deployment & CI/CD (1 week)

**Total Remaining Timeline**: 6 weeks
