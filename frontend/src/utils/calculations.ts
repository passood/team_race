import type { StockData, HistoricalDataPoint } from '@/types/stock';
import { parseISO, isWithinInterval } from 'date-fns';

/**
 * Calculate average market cap for a team at a specific date
 *
 * @param stocks - Array of stock data
 * @param team - Team to calculate for ('blue' or 'white')
 * @param date - Date to calculate at (defaults to latest available)
 *
 * @example
 * const avgMarketCap = calculateTeamAverage(stocks, 'blue', '2024-01-15');
 */
export const calculateTeamAverage = (
  stocks: StockData[],
  team: 'blue' | 'white',
  date?: string
): number => {
  const teamStocks = stocks.filter((s) => s.team === team);

  if (teamStocks.length === 0) return 0;

  const total = teamStocks.reduce((sum, stock) => {
    if (!date) {
      // Use latest market cap from financials
      return sum + (stock.financials?.marketCap || 0);
    }

    // Find historical data point for the specific date
    const dataPoint = stock.history.find((h) => h.date === date);
    // Market cap = close price × shares (approximation using close price)
    return sum + (dataPoint?.close || 0);
  }, 0);

  return total / teamStocks.length;
};

/**
 * Filter stocks by date range
 *
 * @param stocks - Array of stock data
 * @param startDate - Start date (ISO string)
 * @param endDate - End date (ISO string)
 *
 * @example
 * const filtered = filterByDateRange(stocks, '2023-01-01', '2024-01-01');
 */
export const filterByDateRange = (
  stocks: StockData[],
  startDate: string,
  endDate: string
): StockData[] => {
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    return stocks.map((stock) => ({
      ...stock,
      history: stock.history.filter((point) => {
        const date = parseISO(point.date);
        return isWithinInterval(date, { start, end });
      }),
    }));
  } catch {
    return stocks;
  }
};

/**
 * Get count of stocks per sector
 *
 * @param stocks - Array of stock data
 *
 * @example
 * const counts = getSectorCounts(stocks);
 * // { "AI & Cloud": 5, "Banking": 3, ... }
 */
export const getSectorCounts = (
  stocks: StockData[]
): Record<string, number> => {
  return stocks.reduce((acc, stock) => {
    acc[stock.sector] = (acc[stock.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Calculate total return percentage for a stock over a date range
 *
 * @param stock - Stock data
 * @param startDate - Start date (ISO string)
 * @param endDate - End date (ISO string)
 *
 * @returns Percentage return (e.g., 0.15 for 15%)
 *
 * @example
 * const return = calculateReturn(stock, '2023-01-01', '2024-01-01');
 * // 0.234 (23.4% return)
 */
export const calculateReturn = (
  stock: StockData,
  startDate: string,
  endDate: string
): number => {
  const startPoint = stock.history.find((h) => h.date === startDate);
  const endPoint = stock.history.find((h) => h.date === endDate);

  if (!startPoint || !endPoint) return 0;

  const startPrice = startPoint.close;
  const endPrice = endPoint.close;

  if (startPrice === 0) return 0;

  return (endPrice - startPrice) / startPrice;
};

/**
 * Calculate cumulative returns for a stock over its history
 *
 * @param history - Array of historical data points
 *
 * @returns Array of cumulative returns (indexed to 1.0 at start)
 *
 * @example
 * const cumulative = calculateCumulativeReturns(stock.history);
 * // [1.0, 1.05, 1.12, 1.08, ...] (5%, 12%, 8% cumulative returns)
 */
export const calculateCumulativeReturns = (
  history: HistoricalDataPoint[]
): number[] => {
  if (history.length === 0) return [];

  const sorted = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const basePrice = sorted[0].close;
  if (basePrice === 0) return Array(history.length).fill(1);

  return sorted.map((point) => point.close / basePrice);
};

/**
 * Calculate volatility (standard deviation of returns)
 *
 * @param history - Array of historical data points
 *
 * @returns Annualized volatility as a decimal (e.g., 0.25 for 25%)
 *
 * @example
 * const vol = calculateVolatility(stock.history);
 * // 0.32 (32% annualized volatility)
 */
export const calculateVolatility = (
  history: HistoricalDataPoint[]
): number => {
  if (history.length < 2) return 0;

  const sorted = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate daily returns
  const returns: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const prevPrice = sorted[i - 1].close;
    const currPrice = sorted[i].close;
    if (prevPrice > 0) {
      returns.push((currPrice - prevPrice) / prevPrice);
    }
  }

  if (returns.length === 0) return 0;

  // Calculate mean return
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;

  // Calculate variance
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
    returns.length;

  // Standard deviation (daily)
  const dailyVol = Math.sqrt(variance);

  // Annualize (assuming ~252 trading days per year)
  return dailyVol * Math.sqrt(252);
};

/**
 * Get the latest data point for each stock
 *
 * @param stocks - Array of stock data
 *
 * @returns Map of ticker to latest historical data point
 *
 * @example
 * const latest = getLatestDataPoints(stocks);
 * const msftLatest = latest.get('MSFT');
 */
export const getLatestDataPoints = (
  stocks: StockData[]
): Map<string, HistoricalDataPoint> => {
  const map = new Map<string, HistoricalDataPoint>();

  stocks.forEach((stock) => {
    if (stock.history.length === 0) return;

    const sorted = [...stock.history].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    map.set(stock.ticker, sorted[0]);
  });

  return map;
};

/**
 * Calculate team performance comparison
 *
 * @param stocks - Array of stock data
 * @param startDate - Start date for comparison
 * @param endDate - End date for comparison
 *
 * @returns Object with team performance metrics
 */
export const calculateTeamComparison = (
  stocks: StockData[],
  startDate: string,
  endDate: string
): {
  blue: { avgReturn: number; count: number };
  white: { avgReturn: number; count: number };
} => {
  const blueStocks = stocks.filter((s) => s.team === 'blue');
  const whiteStocks = stocks.filter((s) => s.team === 'white');

  const calculateTeamReturn = (teamStocks: StockData[]): number => {
    if (teamStocks.length === 0) return 0;

    const returns = teamStocks.map((stock) =>
      calculateReturn(stock, startDate, endDate)
    );

    return returns.reduce((sum, r) => sum + r, 0) / returns.length;
  };

  return {
    blue: {
      avgReturn: calculateTeamReturn(blueStocks),
      count: blueStocks.length,
    },
    white: {
      avgReturn: calculateTeamReturn(whiteStocks),
      count: whiteStocks.length,
    },
  };
};
