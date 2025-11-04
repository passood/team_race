import { useMemo } from 'react';
import type { StockData } from '@/types/stock';
import { useStockData } from './useStockData';
import { useFilterStore } from '@/stores/useFilterStore';
import { useDateRange } from './useDateRange';

export interface UseFilteredStocksReturn {
  stocks: StockData[] | undefined;
  filteredStocks: StockData[];
  isLoading: boolean;
  error: Error | null;
  filterStats: {
    total: number;
    filtered: number;
    byTeam: {
      blue: number;
      white: number;
    };
    bySector: Record<string, number>;
  };
}

/**
 * Hook for filtering stocks based on team, sector, and date range
 *
 * Applies filters from FilterStore:
 * - Team filter (all/blue/white)
 * - Sector filter (multi-select)
 * - Date range filter (applied to historical data points)
 *
 * Usage:
 * ```tsx
 * const { filteredStocks, filterStats } = useFilteredStocks();
 *
 * return (
 *   <div>
 *     <p>Showing {filterStats.filtered} of {filterStats.total} stocks</p>
 *     {filteredStocks.map(stock => <StockCard key={stock.ticker} stock={stock} />)}
 *   </div>
 * );
 * ```
 */
export const useFilteredStocks = (): UseFilteredStocksReturn => {
  const { data: stocks, isLoading, error } = useStockData();
  const { team, sectors } = useFilterStore();
  const { isDateInRange } = useDateRange();

  // Apply filters
  const filteredStocks = useMemo(() => {
    if (!stocks) return [];

    let filtered = stocks;

    // Apply team filter
    if (team !== 'all') {
      filtered = filtered.filter((stock) => stock.team === team);
    }

    // Apply sector filter
    if (sectors.length > 0) {
      filtered = filtered.filter((stock) => sectors.includes(stock.sector));
    }

    // Filter historical data points by date range
    // (Keep the stock but filter its history array)
    filtered = filtered.map((stock) => ({
      ...stock,
      history: stock.history.filter((point) => isDateInRange(point.date)),
    }));

    // Remove stocks with no history after date filtering
    filtered = filtered.filter((stock) => stock.history.length > 0);

    return filtered;
  }, [stocks, team, sectors, isDateInRange]);

  // Calculate filter statistics
  const filterStats = useMemo(() => {
    if (!stocks) {
      return {
        total: 0,
        filtered: 0,
        byTeam: { blue: 0, white: 0 },
        bySector: {},
      };
    }

    const total = stocks.length;
    const filtered = filteredStocks.length;

    // Count by team
    const byTeam = filteredStocks.reduce(
      (acc, stock) => {
        if (stock.team === 'blue') acc.blue++;
        else if (stock.team === 'white') acc.white++;
        return acc;
      },
      { blue: 0, white: 0 }
    );

    // Count by sector
    const bySector = filteredStocks.reduce((acc, stock) => {
      acc[stock.sector] = (acc[stock.sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      filtered,
      byTeam,
      bySector,
    };
  }, [stocks, filteredStocks]);

  return {
    stocks,
    filteredStocks,
    isLoading,
    error,
    filterStats,
  };
};
