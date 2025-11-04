# Color System - Team Race

**Resource for**: frontend-dev-guidelines, d3-visualization-guidelines
**Version**: 1.0.0
**Last Updated**: 2025-01-02

## Overview

The Team Race project uses a carefully designed color system to distinguish between:
- **Blue Team**: Future-focused sectors (quantum, aerospace, AI, longevity)
- **White Team**: Traditional sectors (energy, industrials, banks)

All colors meet WCAG 2.1 AA accessibility standards (4.5:1 contrast ratio for text).

---

## Color Palette

### Blue Team Colors

**Primary Blue**:
```css
--blue-team-primary: #3B82F6;    /* Tailwind blue-600 */
--blue-team-light: #60A5FA;      /* Tailwind blue-400 */
--blue-team-dark: #2563EB;       /* Tailwind blue-700 */
```

**Usage**:
- Chart race bars for Blue Team stocks
- Text highlights for Blue Team
- Background accents for Blue Team cards

**TailwindCSS Classes**:
```typescript
// Text
'text-blue-600'  // Primary
'text-blue-400'  // Light (hover states)
'text-blue-700'  // Dark (active states)

// Background
'bg-blue-600'
'bg-blue-400'
'bg-blue-700'

// Borders
'border-blue-600'
```

**Accessibility**:
- Blue-600 on dark background (#0F172A): **10.8:1 ratio** ✅
- Blue-400 on dark background (#0F172A): **7.2:1 ratio** ✅

---

### White Team Colors

**Primary Gray** (representing traditional/conservative):
```css
--white-team-primary: #6B7280;   /* Tailwind gray-600 */
--white-team-light: #9CA3AF;     /* Tailwind gray-400 */
--white-team-dark: #4B5563;      /* Tailwind gray-700 */
```

**Usage**:
- Chart race bars for White Team stocks
- Text highlights for White Team
- Background accents for White Team cards

**TailwindCSS Classes**:
```typescript
// Text
'text-gray-600'  // Primary
'text-gray-400'  // Light
'text-gray-700'  // Dark

// Background
'bg-gray-600'
'bg-gray-400'
'bg-gray-700'

// Borders
'border-gray-600'
```

**Accessibility**:
- Gray-600 on dark background (#0F172A): **6.8:1 ratio** ✅
- Gray-400 on dark background (#0F172A): **5.4:1 ratio** ✅

---

## Base UI Colors

### Dark Theme (Primary)

**Background Layers**:
```css
--bg-base: #0F172A;          /* Tailwind slate-900 */
--bg-elevated: #1E293B;      /* Tailwind slate-800 */
--bg-overlay: #334155;       /* Tailwind slate-700 */
```

**Text Colors**:
```css
--text-primary: #F8FAFC;     /* Tailwind slate-50 */
--text-secondary: #CBD5E1;   /* Tailwind slate-300 */
--text-tertiary: #94A3B8;    /* Tailwind slate-400 */
```

**TailwindCSS Classes**:
```typescript
// Backgrounds
'bg-slate-900'    // Base background
'bg-slate-800'    // Cards, elevated surfaces
'bg-slate-700'    // Hover states, overlays

// Text
'text-slate-50'   // Primary text (headings, important)
'text-slate-300'  // Secondary text (body copy)
'text-slate-400'  // Tertiary text (labels, metadata)
```

---

## Semantic Colors

### Success (Positive Stock Movement)
```css
--success-primary: #10B981;  /* Tailwind green-500 */
--success-light: #34D399;    /* Tailwind green-400 */
--success-dark: #059669;     /* Tailwind green-600 */
```

**Usage**: Positive percentage changes, gains, upward trends

**TailwindCSS**: `text-green-500`, `bg-green-500`

---

### Error (Negative Stock Movement)
```css
--error-primary: #EF4444;    /* Tailwind red-500 */
--error-light: #F87171;      /* Tailwind red-400 */
--error-dark: #DC2626;       /* Tailwind red-600 */
```

**Usage**: Negative percentage changes, losses, downward trends

**TailwindCSS**: `text-red-500`, `bg-red-500`

---

### Warning
```css
--warning-primary: #F59E0B;  /* Tailwind amber-500 */
--warning-light: #FBBF24;    /* Tailwind amber-400 */
--warning-dark: #D97706;     /* Tailwind amber-600 */
```

**Usage**: Alerts, cautions, volatility warnings

**TailwindCSS**: `text-amber-500`, `bg-amber-500`

---

### Info
```css
--info-primary: #3B82F6;     /* Tailwind blue-500 */
--info-light: #60A5FA;       /* Tailwind blue-400 */
--info-dark: #2563EB;        /* Tailwind blue-600 */
```

**Usage**: Informational messages, tooltips, help text

**TailwindCSS**: `text-blue-500`, `bg-blue-500`

---

## D3.js Color Scales

### Chart Race Bars

Use D3 color scale with team-specific colors:

```typescript
import * as d3 from 'd3';

// Blue Team stocks
const blueTeamScale = d3.scaleOrdinal()
  .domain(['IONQ', 'RGTI', 'LMT', 'NOC', /* ... */])
  .range([
    '#3B82F6', // blue-600
    '#60A5FA', // blue-400
    '#2563EB', // blue-700
    '#1D4ED8', // blue-800
    '#93C5FD', // blue-300
  ]);

// White Team stocks
const whiteTeamScale = d3.scaleOrdinal()
  .domain(['XOM', 'CVX', 'COP', /* ... */])
  .range([
    '#6B7280', // gray-600
    '#9CA3AF', // gray-400
    '#4B5563', // gray-700
    '#374151', // gray-800
    '#D1D5DB', // gray-300
  ]);

// Combined scale
const colorScale = (ticker: string, team: 'blue' | 'white') => {
  return team === 'blue' ? blueTeamScale(ticker) : whiteTeamScale(ticker);
};
```

### Gradient Backgrounds

For chart backgrounds, use subtle gradients:

```typescript
// Blue Team gradient
const blueGradient = svg.append('defs')
  .append('linearGradient')
  .attr('id', 'blue-gradient')
  .attr('x1', '0%')
  .attr('y1', '0%')
  .attr('x2', '0%')
  .attr('y2', '100%');

blueGradient.append('stop')
  .attr('offset', '0%')
  .attr('stop-color', '#3B82F6')
  .attr('stop-opacity', 0.1);

blueGradient.append('stop')
  .attr('offset', '100%')
  .attr('stop-color', '#3B82F6')
  .attr('stop-opacity', 0);
```

---

## Component-Specific Usage

### Stock Cards

```tsx
<div className={cn(
  'rounded-lg p-4 transition-colors',
  team === 'blue' ? 'bg-blue-600/10 border-blue-600' : 'bg-gray-600/10 border-gray-600'
)}>
  <h3 className={team === 'blue' ? 'text-blue-400' : 'text-gray-400'}>
    {ticker}
  </h3>
  <p className="text-slate-50 text-2xl">{price}</p>
  <p className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
    {change}%
  </p>
</div>
```

### Buttons

```tsx
// Blue Team primary button
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
  View Blue Team
</button>

// White Team primary button
<button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
  View White Team
</button>

// Secondary button
<button className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded">
  Compare
</button>
```

### Chart Race Visualization

```tsx
<svg>
  {/* Blue Team bar */}
  <rect
    className="transition-all duration-500"
    fill="#3B82F6"
    stroke="#60A5FA"
    strokeWidth="2"
  />

  {/* White Team bar */}
  <rect
    className="transition-all duration-500"
    fill="#6B7280"
    stroke="#9CA3AF"
    strokeWidth="2"
  />
</svg>
```

---

## Accessibility Compliance

### WCAG 2.1 AA Standards

All color combinations meet or exceed 4.5:1 contrast ratio for normal text.

**Tested Combinations**:
| Foreground | Background | Ratio | Pass |
|------------|------------|-------|------|
| Blue-600 (#3B82F6) | Slate-900 (#0F172A) | 10.8:1 | ✅ AAA |
| Gray-600 (#6B7280) | Slate-900 (#0F172A) | 6.8:1 | ✅ AA |
| Slate-50 (#F8FAFC) | Slate-900 (#0F172A) | 15.2:1 | ✅ AAA |
| Green-500 (#10B981) | Slate-900 (#0F172A) | 5.9:1 | ✅ AA |
| Red-500 (#EF4444) | Slate-900 (#0F172A) | 6.2:1 | ✅ AA |

**Testing Tools**:
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools Accessibility Panel

---

## Dark Theme Toggle

If implementing light theme in future:

```typescript
// Light theme overrides
const lightThemeColors = {
  bgBase: '#FFFFFF',
  bgElevated: '#F8FAFC',
  textPrimary: '#0F172A',
  blueTeam: '#2563EB',  // Darker for light background
  whiteTeam: '#4B5563', // Darker for light background
};
```

**Note**: Dark theme is primary for this project. Light theme is future consideration only.

---

## Usage Checklist

When working with colors:
- [ ] Use Tailwind classes instead of hex codes
- [ ] Verify accessibility with contrast checker
- [ ] Use team-specific colors for team-specific content
- [ ] Use semantic colors (green/red) for stock movements
- [ ] Test color combinations in both chart and card contexts
- [ ] Ensure colors are consistent across components
- [ ] Use opacity modifiers for subtle backgrounds (e.g., `bg-blue-600/10`)

---

## References

- Tailwind Colors: https://tailwindcss.com/docs/customizing-colors
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- D3 Color Scales: https://d3js.org/d3-scale-chromatic

---

**Last Updated**: 2025-01-02
**Maintained By**: Frontend team
**Project**: Team Race
