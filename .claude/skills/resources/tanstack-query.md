# TanStack Query v5 Patterns

**Resource for**: frontend-dev-guidelines skill
**Version**: 1.0.0
**TanStack Query Version**: v5.x

## Overview

TanStack Query (formerly React Query) manages server state with intelligent caching, background refetching, and optimistic updates. Use it for ALL server data in the Team Race project.

## Core Concepts

### 1. Server State vs Client State

**Server State (Use TanStack Query)**:
- Stock data from Yahoo Finance API
- User authentication status
- Any data fetched from backend

**Client State (Use Zustand or useState)**:
- UI state (dark mode, selected team)
- Form input values (before submission)
- Local flags and toggles

## Basic Query Pattern

### Simple Query
```typescript
import { useQuery } from '@tanstack/react-query';
import { stockApi } from '@/services/api/stockApi';

const { data, isLoading, isError, error } = useQuery({
  queryKey: ['stocks', ticker],
  queryFn: () => stockApi.getStockData(ticker),
  staleTime: 1000 * 60 * 60 * 24, // 24 hours
  gcTime: 1000 * 60 * 60 * 24,    // Keep in cache for 24 hours
});
```

### Query Key Structure

**Critical**: Query keys must be stable and unique

```typescript
// ✅ Good - Stable, unique keys
['stocks', ticker]
['stocks', 'batch', sortedTickers]
['stocks', ticker, 'history', { start, end }]

// ❌ Bad - Unstable keys
[Math.random()]
[new Date()]
[ticker, someObject] // Object reference changes
```

**Best Practices**:
1. Array format for complex keys
2. Sort arrays to ensure consistency
3. Serialize objects in keys

```typescript
// For multiple tickers
const tickers = ['AAPL', 'GOOGL', 'MSFT'];
const queryKey = ['stocks', 'batch', [...tickers].sort()];

// With date range
const queryKey = ['stocks', ticker, 'history', {
  start: startDate.toISOString(),
  end: endDate.toISOString(),
}];
```

## Advanced Query Patterns

### 1. Parallel Queries
```typescript
// Fetch multiple stocks independently
const blueTeamQueries = blueTeamTickers.map((ticker) =>
  useQuery({
    queryKey: ['stocks', ticker],
    queryFn: () => stockApi.getStockData(ticker),
  })
);

// Check if all loaded
const isLoading = blueTeamQueries.some(q => q.isLoading);
const allData = blueTeamQueries.map(q => q.data);
```

### 2. Dependent Queries
```typescript
// Query 2 depends on Query 1's result
const { data: user } = useQuery({
  queryKey: ['user'],
  queryFn: userApi.getCurrentUser,
});

const { data: portfolio } = useQuery({
  queryKey: ['portfolio', user?.id],
  queryFn: () => portfolioApi.getPortfolio(user!.id),
  enabled: !!user, // Only run if user exists
});
```

### 3. Paginated Queries
```typescript
const [page, setPage] = useState(0);

const { data, isLoading, isPlaceholderData } = useQuery({
  queryKey: ['stocks', 'list', page],
  queryFn: () => stockApi.getStocks({ page, limit: 20 }),
  placeholderData: (previousData) => previousData,
});

// Prefetch next page
useEffect(() => {
  if (!isPlaceholderData && data?.hasMore) {
    queryClient.prefetchQuery({
      queryKey: ['stocks', 'list', page + 1],
      queryFn: () => stockApi.getStocks({ page: page + 1, limit: 20 }),
    });
  }
}, [data, isPlaceholderData, page, queryClient]);
```

### 4. Infinite Queries
```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['stocks', 'infinite'],
  queryFn: ({ pageParam = 0 }) =>
    stockApi.getStocks({ page: pageParam, limit: 20 }),
  getNextPageParam: (lastPage, allPages) => {
    return lastPage.hasMore ? allPages.length : undefined;
  },
  initialPageParam: 0,
});

// Access data
const allStocks = data?.pages.flatMap(page => page.stocks) ?? [];
```

## Mutations

### 1. Basic Mutation
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (newStock: StockFormData) => stockApi.createStock(newStock),
  onSuccess: () => {
    // Invalidate and refetch relevant queries
    queryClient.invalidateQueries({ queryKey: ['stocks'] });
  },
});

// Usage
<button onClick={() => mutation.mutate(formData)}>
  Create Stock
</button>
```

### 2. Optimistic Updates
```typescript
const mutation = useMutation({
  mutationFn: (updatedStock: Stock) => stockApi.updateStock(updatedStock),
  onMutate: async (updatedStock) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['stocks', updatedStock.ticker] });

    // Snapshot previous value
    const previous = queryClient.getQueryData(['stocks', updatedStock.ticker]);

    // Optimistically update
    queryClient.setQueryData(['stocks', updatedStock.ticker], updatedStock);

    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    if (context?.previous) {
      queryClient.setQueryData(
        ['stocks', variables.ticker],
        context.previous
      );
    }
  },
  onSettled: (data, error, variables) => {
    // Refetch after success or error
    queryClient.invalidateQueries({ queryKey: ['stocks', variables.ticker] });
  },
});
```

### 3. Multiple Mutations in Sequence
```typescript
const createStockMutation = useMutation({
  mutationFn: stockApi.createStock,
});

const notifyMutation = useMutation({
  mutationFn: notificationApi.send,
});

const handleSubmit = async (data: StockFormData) => {
  try {
    const stock = await createStockMutation.mutateAsync(data);
    await notifyMutation.mutateAsync({
      message: `Stock ${stock.ticker} created`,
    });
    toast.success('Stock created and notification sent');
  } catch (error) {
    toast.error('Failed to create stock');
  }
};
```

## Caching Strategy

### 1. Stale Time vs GC Time

```typescript
useQuery({
  queryKey: ['stocks', ticker],
  queryFn: () => stockApi.getStockData(ticker),

  // How long data is considered fresh (won't refetch)
  staleTime: 1000 * 60 * 60 * 24, // 24 hours for stock data

  // How long unused data stays in cache before garbage collection
  gcTime: 1000 * 60 * 60 * 24, // 24 hours
});
```

**Project-Specific Stale Times**:
- **Stock quotes**: 24 hours (daily data, updates once per day)
- **Historical data**: 1 hour (may change more frequently)
- **User data**: 5 minutes
- **Static config**: Infinity (never stale)

### 2. Refetch Strategies
```typescript
useQuery({
  queryKey: ['stocks', ticker],
  queryFn: () => stockApi.getStockData(ticker),

  refetchOnMount: true,        // Refetch when component mounts (if stale)
  refetchOnWindowFocus: false, // Don't refetch on tab focus (our data is daily)
  refetchOnReconnect: true,    // Refetch when network reconnects
  refetchInterval: false,      // No polling (daily data doesn't need it)
});
```

### 3. Prefetching
```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Prefetch on hover
const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: ['stocks', ticker],
    queryFn: () => stockApi.getStockData(ticker),
  });
};

<div onMouseEnter={handleMouseEnter}>
  <Link to={`/stocks/${ticker}`}>{ticker}</Link>
</div>
```

## Custom Hooks

### 1. Encapsulate Queries in Custom Hooks
```typescript
// hooks/useStockData.ts
export const useStockData = (ticker: string) => {
  return useQuery({
    queryKey: ['stocks', ticker],
    queryFn: () => stockApi.getStockData(ticker),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!ticker, // Don't fetch if no ticker
  });
};

// Usage in component
const { data, isLoading } = useStockData(ticker);
```

### 2. Batch Stock Data Hook
```typescript
export const useBatchStockData = (tickers: string[]) => {
  const sortedTickers = useMemo(() => [...tickers].sort(), [tickers]);

  return useQuery({
    queryKey: ['stocks', 'batch', sortedTickers],
    queryFn: () => stockApi.getBatchStockData(sortedTickers),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: tickers.length > 0,
  });
};
```

### 3. Stock History Hook
```typescript
export const useStockHistory = (
  ticker: string,
  dateRange: { start: Date; end: Date }
) => {
  return useQuery({
    queryKey: [
      'stocks',
      ticker,
      'history',
      {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString(),
      },
    ],
    queryFn: () => stockApi.getHistoricalData(ticker, dateRange),
    staleTime: 1000 * 60 * 60, // 1 hour for historical
    enabled: !!ticker && !!dateRange.start && !!dateRange.end,
  });
};
```

## Error Handling

### 1. Global Error Handler
```typescript
// src/main.tsx or App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error) => {
        console.error('Query error:', error);
        // Optional: Send to error reporting service
      },
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
        toast.error('An error occurred. Please try again.');
      },
    },
  },
});
```

### 2. Component-Level Error Handling
```typescript
const { data, error, isError } = useStockData(ticker);

if (isError) {
  if (error.response?.status === 404) {
    return <NotFound ticker={ticker} />;
  }
  if (error.response?.status === 429) {
    return <RateLimitError />;
  }
  return <ErrorMessage error={error} />;
}
```

### 3. Error Boundaries with Queries
```typescript
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

const App = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={resetErrorBoundary}>Try again</button>
        </div>
      )}
    >
      <StockList />
    </ErrorBoundary>
  );
};
```

## React 18 Integration

### 1. Suspense Mode
```typescript
// Enable suspense in query
const { data } = useQuery({
  queryKey: ['stocks', ticker],
  queryFn: () => stockApi.getStockData(ticker),
  suspense: true, // Enable suspense
});

// Wrap component in Suspense
<Suspense fallback={<StockCardSkeleton />}>
  <StockCard ticker="AAPL" />
</Suspense>
```

### 2. With useTransition
```typescript
import { useTransition } from 'react';

const [isPending, startTransition] = useTransition();
const [selectedTicker, setSelectedTicker] = useState('AAPL');

const { data } = useStockData(selectedTicker);

const handleSelect = (ticker: string) => {
  startTransition(() => {
    setSelectedTicker(ticker); // Non-urgent update
  });
};

// Show pending state
{isPending && <Spinner />}
```

## DevTools

### Setup
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**DevTools Features**:
- Inspect all queries and their states
- Manually trigger refetches
- View cache contents
- Monitor loading states
- Debug stale/fresh state

## Testing

### 1. Mock Query Client
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

test('renders stock data', async () => {
  render(<StockCard ticker="AAPL" />, { wrapper });
  // assertions...
});
```

### 2. Mock API Responses
```typescript
import { vi } from 'vitest';

vi.mock('@/services/api/stockApi', () => ({
  stockApi: {
    getStockData: vi.fn().mockResolvedValue({
      ticker: 'AAPL',
      price: 150,
      change: 2.5,
    }),
  },
}));
```

## Performance Tips

### 1. Select Partial Data
```typescript
// Only select needed fields
const { data: price } = useQuery({
  queryKey: ['stocks', ticker],
  queryFn: () => stockApi.getStockData(ticker),
  select: (data) => data.price, // Only re-render when price changes
});
```

### 2. Structural Sharing
TanStack Query automatically does structural sharing, but be aware:

```typescript
// This will cause unnecessary re-renders
const { data } = useQuery({
  queryKey: ['stocks'],
  queryFn: () => stockApi.getStocks(),
});

// Better: Use select to derive computed values
const { data: sortedStocks } = useQuery({
  queryKey: ['stocks'],
  queryFn: () => stockApi.getStocks(),
  select: (data) => [...data].sort((a, b) => b.price - a.price),
});
```

### 3. Keep Query Keys Stable
```typescript
// ❌ Bad - Creates new array every render
const { data } = useQuery({
  queryKey: ['stocks', 'batch', tickers],
  // ...
});

// ✅ Good - Memoize query key
const queryKey = useMemo(
  () => ['stocks', 'batch', [...tickers].sort()],
  [tickers]
);

const { data } = useQuery({
  queryKey,
  // ...
});
```

## Common Patterns for Team Race

### 1. Chart Race Data Loading
```typescript
export const useChartRaceData = () => {
  const blueTeamTickers = ['IONQ', 'RGTI', 'LMT', /* ... */];
  const whiteTeamTickers = ['XOM', 'CVX', 'COP', /* ... */];
  const allTickers = [...blueTeamTickers, ...whiteTeamTickers];

  return useQuery({
    queryKey: ['stocks', 'chart-race', allTickers.sort()],
    queryFn: () => stockApi.getBatchHistoricalData(allTickers),
    staleTime: 1000 * 60 * 60 * 24,
    select: (data) => {
      // Transform for chart race format
      return transformToChartRaceFormat(data);
    },
  });
};
```

### 2. Stock Details Page
```typescript
export const useStockDetails = (ticker: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['stocks', ticker, 'details'],
    queryFn: () => stockApi.getStockDetails(ticker),
    staleTime: 1000 * 60 * 60 * 24,
    initialData: () => {
      // Try to use data from list query if available
      const listData = queryClient.getQueryData<Stock[]>(['stocks', 'list']);
      return listData?.find(s => s.ticker === ticker);
    },
  });
};
```

### 3. Comparison Page
```typescript
export const useStockComparison = (tickers: string[]) => {
  const sortedTickers = useMemo(() => [...tickers].sort(), [tickers]);

  return useQuery({
    queryKey: ['stocks', 'comparison', sortedTickers],
    queryFn: () => stockApi.getComparisonData(sortedTickers),
    staleTime: 1000 * 60 * 60,
    enabled: tickers.length >= 2, // Need at least 2 stocks
  });
};
```

---

## Checklist

Before using TanStack Query:
- [ ] Is this server data? (If yes, use TanStack Query)
- [ ] Is this client/UI state? (If yes, use Zustand or useState)
- [ ] Have I set appropriate staleTime for this data?
- [ ] Is my query key stable and unique?
- [ ] Have I handled loading and error states?
- [ ] Should I prefetch this data?
- [ ] Have I tested the query with React Query DevTools?

---

**Last Updated**: 2025-01-02
**Compatible With**: @tanstack/react-query v5.x
**Project**: Team Race
