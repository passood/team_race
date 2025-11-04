/**
 * Stock Tickers Configuration
 *
 * Central source of truth for all stock tickers in the Team Race project.
 * Blue Team: Future-focused sectors
 * White Team: Traditional sectors
 */

export interface StockTicker {
  ticker: string;
  name: string;
  sector: string;
  team: 'blue' | 'white';
  category: string;
}

// ============================================================================
// BLUE TEAM - Future-Focused Sectors
// ============================================================================

export const BLUE_TEAM_QUANTUM: StockTicker[] = [
  { ticker: 'IONQ', name: 'IonQ Inc', sector: 'Quantum Computing', team: 'blue', category: 'quantum' },
  { ticker: 'RGTI', name: 'Rigetti Computing', sector: 'Quantum Computing', team: 'blue', category: 'quantum' },
];

export const BLUE_TEAM_AEROSPACE: StockTicker[] = [
  { ticker: 'LMT', name: 'Lockheed Martin', sector: 'Aerospace & Defense', team: 'blue', category: 'aerospace' },
  { ticker: 'NOC', name: 'Northrop Grumman', sector: 'Aerospace & Defense', team: 'blue', category: 'aerospace' },
  { ticker: 'RTX', name: 'RTX Corporation', sector: 'Aerospace & Defense', team: 'blue', category: 'aerospace' },
  { ticker: 'LHX', name: 'L3Harris Technologies', sector: 'Aerospace & Defense', team: 'blue', category: 'aerospace' },
];

export const BLUE_TEAM_LONGEVITY: StockTicker[] = [
  { ticker: 'NTLA', name: 'Intellia Therapeutics', sector: 'Longevity Biotech', team: 'blue', category: 'longevity' },
  { ticker: 'CRSP', name: 'CRISPR Therapeutics', sector: 'Longevity Biotech', team: 'blue', category: 'longevity' },
];

export const BLUE_TEAM_AI_CLOUD: StockTicker[] = [
  { ticker: 'GOOGL', name: 'Alphabet Inc', sector: 'AI & Cloud', team: 'blue', category: 'ai' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'AI & Cloud', team: 'blue', category: 'ai' },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'AI & Cloud', team: 'blue', category: 'ai' },
  { ticker: 'META', name: 'Meta Platforms', sector: 'AI & Cloud', team: 'blue', category: 'ai' },
  { ticker: 'AMZN', name: 'Amazon.com', sector: 'AI & Cloud', team: 'blue', category: 'ai' },
];

export const BLUE_TEAM_SEMICONDUCTORS: StockTicker[] = [
  { ticker: 'TSM', name: 'Taiwan Semiconductor', sector: 'Semiconductors', team: 'blue', category: 'semiconductors' },
  { ticker: 'ASML', name: 'ASML Holding', sector: 'Semiconductors', team: 'blue', category: 'semiconductors' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Semiconductors', team: 'blue', category: 'semiconductors' },
];

export const BLUE_TEAM_ROBOTICS: StockTicker[] = [
  { ticker: 'TSLA', name: 'Tesla Inc', sector: 'Robotics & EV', team: 'blue', category: 'robotics' },
];

// Aggregate all Blue Team tickers
export const BLUE_TEAM_ALL: StockTicker[] = [
  ...BLUE_TEAM_QUANTUM,
  ...BLUE_TEAM_AEROSPACE,
  ...BLUE_TEAM_LONGEVITY,
  ...BLUE_TEAM_AI_CLOUD,
  ...BLUE_TEAM_SEMICONDUCTORS,
  ...BLUE_TEAM_ROBOTICS,
];

// ============================================================================
// WHITE TEAM - Traditional Sectors
// ============================================================================

export const WHITE_TEAM_TRADITIONAL_ENERGY: StockTicker[] = [
  { ticker: 'XOM', name: 'Exxon Mobil', sector: 'Traditional Energy', team: 'white', category: 'traditional-energy' },
  { ticker: 'CVX', name: 'Chevron Corporation', sector: 'Traditional Energy', team: 'white', category: 'traditional-energy' },
  { ticker: 'COP', name: 'ConocoPhillips', sector: 'Traditional Energy', team: 'white', category: 'traditional-energy' },
];

export const WHITE_TEAM_FUTURE_ENERGY: StockTicker[] = [
  { ticker: 'NEE', name: 'NextEra Energy', sector: 'Future Energy', team: 'white', category: 'future-energy' },
  { ticker: 'ENPH', name: 'Enphase Energy', sector: 'Future Energy', team: 'white', category: 'future-energy' },
  { ticker: 'FSLR', name: 'First Solar', sector: 'Future Energy', team: 'white', category: 'future-energy' },
];

export const WHITE_TEAM_INDUSTRIALS: StockTicker[] = [
  { ticker: 'CAT', name: 'Caterpillar Inc', sector: 'Industrials', team: 'white', category: 'industrials' },
  { ticker: 'DE', name: 'Deere & Company', sector: 'Industrials', team: 'white', category: 'industrials' },
  { ticker: 'GE', name: 'General Electric', sector: 'Industrials', team: 'white', category: 'industrials' },
];

export const WHITE_TEAM_BANKS: StockTicker[] = [
  { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Banking', team: 'white', category: 'banks' },
  { ticker: 'BAC', name: 'Bank of America', sector: 'Banking', team: 'white', category: 'banks' },
  { ticker: 'WFC', name: 'Wells Fargo', sector: 'Banking', team: 'white', category: 'banks' },
];

export const WHITE_TEAM_CONSUMER_GOODS: StockTicker[] = [
  { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer Goods', team: 'white', category: 'consumer-goods' },
  { ticker: 'KO', name: 'Coca-Cola Company', sector: 'Consumer Goods', team: 'white', category: 'consumer-goods' },
  { ticker: 'PEP', name: 'PepsiCo Inc', sector: 'Consumer Goods', team: 'white', category: 'consumer-goods' },
];

// Aggregate all White Team tickers
export const WHITE_TEAM_ALL: StockTicker[] = [
  ...WHITE_TEAM_TRADITIONAL_ENERGY,
  ...WHITE_TEAM_FUTURE_ENERGY,
  ...WHITE_TEAM_INDUSTRIALS,
  ...WHITE_TEAM_BANKS,
  ...WHITE_TEAM_CONSUMER_GOODS,
];

// ============================================================================
// ALL TICKERS
// ============================================================================

export const ALL_TICKERS: StockTicker[] = [
  ...BLUE_TEAM_ALL,
  ...WHITE_TEAM_ALL,
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all ticker symbols as an array
 */
export const getAllTickerSymbols = (): string[] => {
  return ALL_TICKERS.map(stock => stock.ticker);
};

/**
 * Get ticker symbols for a specific team
 */
export const getTeamTickerSymbols = (team: 'blue' | 'white'): string[] => {
  const tickers = team === 'blue' ? BLUE_TEAM_ALL : WHITE_TEAM_ALL;
  return tickers.map(stock => stock.ticker);
};

/**
 * Get ticker symbols for a specific category
 */
export const getCategoryTickerSymbols = (category: string): string[] => {
  return ALL_TICKERS
    .filter(stock => stock.category === category)
    .map(stock => stock.ticker);
};

/**
 * Get stock info by ticker symbol
 */
export const getStockByTicker = (ticker: string): StockTicker | undefined => {
  return ALL_TICKERS.find(stock => stock.ticker === ticker);
};

/**
 * Check if ticker belongs to Blue Team
 */
export const isBlueTeam = (ticker: string): boolean => {
  return BLUE_TEAM_ALL.some(stock => stock.ticker === ticker);
};

/**
 * Check if ticker belongs to White Team
 */
export const isWhiteTeam = (ticker: string): boolean => {
  return WHITE_TEAM_ALL.some(stock => stock.ticker === ticker);
};

/**
 * Get team name by ticker
 */
export const getTeamByTicker = (ticker: string): 'blue' | 'white' | null => {
  const stock = getStockByTicker(ticker);
  return stock ? stock.team : null;
};

/**
 * Get all unique sectors
 */
export const getAllSectors = (): string[] => {
  return Array.from(new Set(ALL_TICKERS.map(stock => stock.sector)));
};

/**
 * Get all unique categories
 */
export const getAllCategories = (): string[] => {
  return Array.from(new Set(ALL_TICKERS.map(stock => stock.category)));
};

/**
 * Get stocks by sector
 */
export const getStocksBySector = (sector: string): StockTicker[] => {
  return ALL_TICKERS.filter(stock => stock.sector === sector);
};

/**
 * Validate if ticker exists in our system
 */
export const isValidTicker = (ticker: string): boolean => {
  return ALL_TICKERS.some(stock => stock.ticker === ticker);
};

// ============================================================================
// CONSTANTS
// ============================================================================

export const TEAM_NAMES = {
  blue: 'Blue Team',
  white: 'White Team',
} as const;

export const TEAM_DESCRIPTIONS = {
  blue: 'Future-focused sectors: Quantum, AI, Aerospace, Longevity',
  white: 'Traditional sectors: Energy, Industrials, Banks, Consumer Goods',
} as const;

export const TOTAL_STOCKS_COUNT = ALL_TICKERS.length;
export const BLUE_TEAM_COUNT = BLUE_TEAM_ALL.length;
export const WHITE_TEAM_COUNT = WHITE_TEAM_ALL.length;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Team = 'blue' | 'white';
export type Category = StockTicker['category'];
export type Sector = StockTicker['sector'];

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/*
// Import in your component
import {
  BLUE_TEAM_ALL,
  WHITE_TEAM_ALL,
  getAllTickerSymbols,
  getTeamByTicker,
  isBlueTeam,
} from '@/shared/config/stock-tickers';

// Get all tickers for API calls
const allTickers = getAllTickerSymbols();
console.log(allTickers); // ['IONQ', 'RGTI', 'LMT', ...]

// Check team
const team = getTeamByTicker('IONQ'); // 'blue'
const isBlue = isBlueTeam('IONQ'); // true

// Get Blue Team tickers for chart
const blueTickers = BLUE_TEAM_ALL.map(s => s.ticker);

// Get stock info
const stock = getStockByTicker('MSFT');
console.log(stock); // { ticker: 'MSFT', name: 'Microsoft Corporation', ... }
*/
