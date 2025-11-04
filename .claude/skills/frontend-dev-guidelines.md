# Frontend Development Guidelines

**Version**: 1.0.0
**Last Updated**: 2025-01-02
**Purpose**: Comprehensive guidelines for React 18+ frontend development with Vite, D3.js, TailwindCSS, and TanStack ecosystem

## Overview

This skill provides patterns and best practices for the Team Race frontend application. Use progressive disclosure to load detailed resource files only when needed.

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite 5+
- **Routing**: TanStack Router (file-based routing)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query v5
- **Styling**: TailwindCSS v3
- **Visualization**: D3.js v7 (see `d3-visualization-guidelines` skill for details)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Quick Reference

### When to Load Resource Files

| Topic | Resource File | When to Load |
|-------|--------------|--------------|
| React patterns | `react-patterns.md` | Creating/modifying components |
| TanStack Query | `tanstack-query.md` | Data fetching, caching |
| TanStack Router | `tanstack-router.md` | Routing, navigation |
| Zustand | `zustand-patterns.md` | State management |
| TailwindCSS | `tailwind-patterns.md` | Styling components |
| Component structure | `component-organization.md` | Project structure questions |
| TypeScript | `typescript-patterns.md` | Type definitions, generics |
| Performance | `performance-optimization.md` | Optimization, bundle size |
| Testing | `frontend-testing.md` | Writing tests |
| Forms & Validation | `forms-validation.md` | Form handling |

Load resource files on-demand using: `@.claude/skills/resources/<filename>`

---

## Core Principles

### 1. TypeScript First
- **Always** use TypeScript, never `any` type
- Define interfaces for all props, state, API responses
- Use type inference where possible
- Prefer types over interfaces for unions/intersections

```typescript
// ✅ Good
interface StockData {
  ticker: string;
  price: number;
  change: number;
}

const StockCard: React.FC<{ data: StockData }> = ({ data }) => {
  // ...
};

// ❌ Bad
const StockCard = ({ data }: any) => {
  // ...
};
```

### 2. Functional Components with Hooks
- **Always** use functional components
- Never use class components
- Follow hooks rules (top-level, no conditionals)
- Extract custom hooks for reusable logic

```typescript
// ✅ Good
const useStockData = (ticker: string) => {
  return useQuery({
    queryKey: ['stocks', ticker],
    queryFn: () => api.getStock(ticker),
  });
};

// ❌ Bad
class StockDataProvider extends React.Component {
  // Don't use class components
}
```

### 3. Component Organization
```
frontend/src/
├── components/
│   ├── ChartRace/           # Feature-based grouping
│   │   ├── ChartRace.tsx
│   │   ├── ChartRaceCanvas.tsx
│   │   ├── ChartRaceControls.tsx
│   │   └── index.ts         # Barrel export
│   ├── StockCard/
│   │   ├── StockCard.tsx
│   │   ├── StockMetrics.tsx
│   │   └── index.ts
│   └── common/              # Shared components
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Loader.tsx
├── pages/                   # Route pages
├── hooks/                   # Custom hooks
├── stores/                  # Zustand stores
├── services/                # API clients
├── utils/                   # Utility functions
└── types/                   # TypeScript types
```

### 4. Props Pattern
```typescript
// ✅ Good - Explicit interface
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'md',
  onClick,
  children
}) => {
  return (
    <button
      className={cn(buttonVariants[variant], sizeVariants[size])}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ❌ Bad - Inline types, no defaults
const Button = ({ variant, size, onClick, children }: {
  variant: string;
  size: string;
  onClick: Function;
  children: any;
}) => {
  // ...
};
```

---

## File Organization

### 1. Component Files
```typescript
// StockCard.tsx
import React from 'react';
import { Card } from '@/components/common/Card';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import type { StockData } from '@/types/stock';

interface StockCardProps {
  data: StockData;
  onClick?: () => void;
}

export const StockCard: React.FC<StockCardProps> = ({ data, onClick }) => {
  return (
    <Card onClick={onClick} className="hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold">{data.ticker}</h3>
      <p className="text-2xl">{formatCurrency(data.price)}</p>
      <p className={data.change >= 0 ? 'text-green-500' : 'text-red-500'}>
        {formatPercent(data.change)}
      </p>
    </Card>
  );
};
```

### 2. Index Barrel Exports
```typescript
// components/StockCard/index.ts
export { StockCard } from './StockCard';
export { StockMetrics } from './StockMetrics';
export type { StockCardProps } from './StockCard';
```

### 3. Page Components
```typescript
// pages/Home.tsx
import { ChartRace } from '@/components/ChartRace';
import { useStockData } from '@/hooks/useStockData';

export const Home: React.FC = () => {
  const { data, isLoading } = useStockData();

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Team Race</h1>
      <ChartRace data={data} />
    </div>
  );
};
```

---

## State Management

### TanStack Query for Server State
Use TanStack Query for ALL server data. Never use useState for server data.

```typescript
// ✅ Good - TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['stocks', ticker],
  queryFn: () => stockApi.getStockData(ticker),
  staleTime: 1000 * 60 * 60 * 24, // 24 hours
  gcTime: 1000 * 60 * 60 * 24,
});

// ❌ Bad - useState for server data
const [data, setData] = useState(null);
useEffect(() => {
  fetchData().then(setData);
}, []);
```

**Key TanStack Query Patterns**:
- Use stable queryKey arrays
- Set appropriate staleTime (24h for stock data)
- Use mutations for POST/PUT/DELETE
- Invalidate queries after mutations

For details: Load `@.claude/skills/resources/tanstack-query.md`

### Zustand for UI State
Use Zustand for client-side UI state only.

```typescript
// stores/uiStore.ts
import { create } from 'zustand';

interface UIState {
  isDarkMode: boolean;
  selectedTeam: 'blue' | 'white' | 'all';
  setSelectedTeam: (team: 'blue' | 'white' | 'all') => void;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: true,
  selectedTeam: 'all',
  setSelectedTeam: (team) => set({ selectedTeam: team }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));

// Usage in component
const { selectedTeam, setSelectedTeam } = useUIStore();
```

For details: Load `@.claude/skills/resources/zustand-patterns.md`

---

## Styling with TailwindCSS

### 1. Use Utility Classes
```typescript
// ✅ Good - Tailwind utilities
<div className="flex items-center justify-between p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
  <h2 className="text-xl font-semibold text-white">Title</h2>
  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
    Click me
  </button>
</div>

// ❌ Bad - Inline styles
<div style={{ display: 'flex', padding: '16px', backgroundColor: '#1f2937' }}>
  {/* ... */}
</div>
```

### 2. Use `cn()` Helper for Conditional Classes
```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// Usage
<button className={cn(
  'px-4 py-2 rounded',
  variant === 'primary' && 'bg-blue-600 text-white',
  variant === 'secondary' && 'bg-gray-600 text-white',
  disabled && 'opacity-50 cursor-not-allowed'
)}>
  {children}
</button>
```

### 3. Color System
Use project color palette from `@.claude/skills/resources/color-system.md`

```typescript
// Blue Team colors
'text-blue-400'  // #60A5FA
'bg-blue-600'    // #3B82F6

// White Team colors
'text-gray-400'  // #9CA3AF
'bg-gray-600'    // #6B7280

// Dark theme background
'bg-slate-900'   // #0F172A
```

For details: Load `@.claude/skills/resources/tailwind-patterns.md`

---

## Routing with TanStack Router

### File-Based Routing Structure
```
frontend/src/routes/
├── __root.tsx              # Root layout
├── index.tsx               # / (Home - Chart Race)
├── stocks/
│   ├── index.tsx           # /stocks (Stock list)
│   └── $ticker.tsx         # /stocks/:ticker (Stock details)
└── comparison.tsx          # /comparison
```

### Route File Example
```typescript
// routes/stocks/$ticker.tsx
import { createFileRoute } from '@tanstack/react-router';
import { stockApi } from '@/services/api/stockApi';

export const Route = createFileRoute('/stocks/$ticker')({
  loader: async ({ params }) => {
    // Pre-load data before rendering
    return await stockApi.getStockData(params.ticker);
  },
  component: StockDetails,
});

function StockDetails() {
  const { ticker } = Route.useParams();
  const data = Route.useLoaderData();

  return (
    <div>
      <h1>{ticker}</h1>
      {/* Use pre-loaded data */}
    </div>
  );
}
```

For details: Load `@.claude/skills/resources/tanstack-router.md`

---

## Performance Best Practices

### 1. Code Splitting
```typescript
// Lazy load routes
import { lazy } from 'react';

const StockDetails = lazy(() => import('./pages/StockDetails'));

// Wrap in Suspense
<Suspense fallback={<Loader />}>
  <StockDetails />
</Suspense>
```

### 2. Memoization
```typescript
import { useMemo, useCallback } from 'react';

// Expensive calculations
const sortedStocks = useMemo(() => {
  return stocks.sort((a, b) => b.change - a.change);
}, [stocks]);

// Callback functions
const handleClick = useCallback(() => {
  console.log('Clicked', ticker);
}, [ticker]);
```

### 3. React 18 Concurrent Features
```typescript
// Use Suspense for data fetching
<Suspense fallback={<Skeleton />}>
  <StockList />
</Suspense>

// Use transitions for non-urgent updates
const [isPending, startTransition] = useTransition();

const handleSearch = (query: string) => {
  startTransition(() => {
    setSearchQuery(query);
  });
};
```

For details: Load `@.claude/skills/resources/performance-optimization.md`

---

## Error Handling

### 1. Error Boundaries
```typescript
// components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Optional: Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold text-red-500">
            Something went wrong
          </h2>
          <p className="text-gray-600 mt-2">
            {this.state.error?.message}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 2. TanStack Query Error Handling
```typescript
const { data, error, isError } = useQuery({
  queryKey: ['stocks', ticker],
  queryFn: () => stockApi.getStockData(ticker),
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

if (isError) {
  return <ErrorMessage error={error} />;
}
```

---

## Accessibility

### 1. Semantic HTML
```typescript
// ✅ Good
<button onClick={handleClick}>Click me</button>
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/stocks">Stocks</a></li>
  </ul>
</nav>

// ❌ Bad
<div onClick={handleClick}>Click me</div>
```

### 2. ARIA Labels
```typescript
<button
  aria-label="Close dialog"
  aria-describedby="dialog-description"
  onClick={onClose}
>
  <XIcon />
</button>
```

### 3. Keyboard Navigation
```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
};

<div
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={handleClick}
>
  {children}
</div>
```

### 4. Color Contrast
All colors must meet WCAG 2.1 AA standards (4.5:1 contrast ratio for text).
Reference: `@.claude/skills/resources/color-system.md`

---

## Testing

### 1. Component Tests with Vitest + Testing Library
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StockCard } from './StockCard';

describe('StockCard', () => {
  it('renders stock data correctly', () => {
    const data = {
      ticker: 'AAPL',
      price: 150.25,
      change: 2.5,
    };

    render(<StockCard data={data} />);

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('$150.25')).toBeInTheDocument();
    expect(screen.getByText('+2.50%')).toBeInTheDocument();
  });
});
```

For details: Load `@.claude/skills/resources/frontend-testing.md`

---

## Common Patterns

### 1. Loading States
```typescript
const { data, isLoading, isError } = useStockData(ticker);

if (isLoading) return <Skeleton />;
if (isError) return <ErrorMessage />;
if (!data) return null;

return <StockCard data={data} />;
```

### 2. Conditional Rendering
```typescript
// ✅ Good - Early returns
if (isLoading) return <Loader />;
if (isError) return <Error />;

return <Content />;

// ❌ Bad - Nested ternaries
return isLoading ? <Loader /> : isError ? <Error /> : <Content />;
```

### 3. Lists with Keys
```typescript
// ✅ Good - Stable keys
{stocks.map((stock) => (
  <StockCard key={stock.ticker} data={stock} />
))}

// ❌ Bad - Index as key (unstable)
{stocks.map((stock, index) => (
  <StockCard key={index} data={stock} />
))}
```

---

## Integration with D3.js

For D3.js specific patterns, use the `d3-visualization-guidelines` skill.

**Basic React + D3 Pattern**:
```typescript
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ChartRaceCanvas: React.FC<{ data: ChartData }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    // D3 operations here

    return () => {
      // Cleanup
      svg.selectAll('*').remove();
    };
  }, [data]);

  return <svg ref={svgRef} className="w-full h-full" />;
};
```

---

## Resource Files Reference

Load these files on-demand for detailed guidance:

1. **react-patterns.md**: React 18 hooks, Suspense, concurrent features
2. **tanstack-query.md**: Data fetching, caching, mutations
3. **tanstack-router.md**: File-based routing, loaders, navigation
4. **zustand-patterns.md**: State management patterns
5. **tailwind-patterns.md**: Styling patterns, responsive design
6. **component-organization.md**: Component structure, barrel exports
7. **typescript-patterns.md**: Type definitions, generics, utility types
8. **performance-optimization.md**: Bundle optimization, code splitting
9. **frontend-testing.md**: Vitest, Testing Library, E2E with Playwright
10. **forms-validation.md**: Form handling, validation, React Hook Form

---

## Checklist Before Committing

- [ ] No TypeScript errors (`pnpm exec tsc --noEmit`)
- [ ] No ESLint errors (`pnpm lint`)
- [ ] Code formatted (`pnpm format`)
- [ ] All imports organized (group by external, internal, relative)
- [ ] No `console.log` in production code
- [ ] Props interfaces defined
- [ ] Accessibility considered (semantic HTML, ARIA labels)
- [ ] Responsive design tested
- [ ] Loading/error states handled
- [ ] Tests written for new components

---

**Last Updated**: 2025-01-02
**Skill Version**: 1.0.0
**Compatible With**: React 18+, Vite 5+, TypeScript 5.3+
