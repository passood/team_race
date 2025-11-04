/**
 * Stock Data Types
 *
 * Type definitions for stock data used throughout the application
 */

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose: number;
}

export interface FinancialMetrics {
  debtToEquity: number | null;
  currentRatio: number | null;
  marketCap: number | null;
  lastUpdated: string;
}

export interface StockData {
  ticker: string;
  name: string;
  sector: string;
  team: 'blue' | 'white';
  category: string;
  history: HistoricalDataPoint[];
  financials: FinancialMetrics;
  error?: string;
}

export interface StockMetadata {
  lastUpdated: string;
  dateRange: {
    start: string;
    end: string;
  };
  totalStocks: number;
  successfulStocks: number;
  failedStocks: number;
  blueTeamCount: number;
  whiteTeamCount: number;
}

export type Team = 'blue' | 'white';
export type TimeRange = '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'custom';
