/**
 * Stock Tickers Configuration
 *
 * Central source of truth for all stock tickers in the Team Race project.
 * Blue Team: Future-focused sectors (미래섹터)
 * White Team: Traditional/incumbent sectors (전통 섹터)
 */

export interface StockTicker {
  ticker: string;
  name: string;
  sector: string;
  team: 'blue' | 'white';
  category: string;
}

// ============================================================================
// BLUE TEAM - Future-Focused Sectors (18 stocks)
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
  { ticker: 'NTLA', name: 'Intellia Therapeutics', sector: 'Longevity Science', team: 'blue', category: 'longevity' },
  { ticker: 'CRSP', name: 'CRISPR Therapeutics', sector: 'Longevity Science', team: 'blue', category: 'longevity' },
];

export const BLUE_TEAM_SYNTHETIC_BIOLOGY: StockTicker[] = [
  { ticker: 'DNA', name: 'Ginkgo Bioworks', sector: 'Synthetic Biology', team: 'blue', category: 'synthetic-biology' },
  { ticker: 'TWST', name: 'Twist Bioscience', sector: 'Synthetic Biology', team: 'blue', category: 'synthetic-biology' },
];

export const BLUE_TEAM_SATELLITE_COMMUNICATIONS: StockTicker[] = [
  { ticker: 'IRDM', name: 'Iridium Communications', sector: 'Satellite Communications', team: 'blue', category: 'satellite-communications' },
  { ticker: 'RKLB', name: 'Rocket Lab USA', sector: 'Space & Satellite', team: 'blue', category: 'satellite-communications' },
];

export const BLUE_TEAM_BCI: StockTicker[] = [
  { ticker: 'IART', name: 'Integra Lifesciences', sector: 'Brain-Computer Interface', team: 'blue', category: 'bci' },
  { ticker: 'HYPR', name: 'Hyperfine Inc', sector: 'Brain-Computer Interface', team: 'blue', category: 'bci' },
];

export const BLUE_TEAM_BATTERY_ESS: StockTicker[] = [
  { ticker: 'TSLA', name: 'Tesla Inc', sector: 'Battery & ESS Platform', team: 'blue', category: 'battery-ess' },
  { ticker: 'FLNC', name: 'Fluence Energy', sector: 'Battery & ESS Platform', team: 'blue', category: 'battery-ess' },
  { ticker: 'QS', name: 'QuantumScape', sector: 'Battery & ESS Platform', team: 'blue', category: 'battery-ess' },
];

export const BLUE_TEAM_RENEWABLE_ENERGY: StockTicker[] = [
  { ticker: 'NEE', name: 'NextEra Energy', sector: 'Renewable Energy', team: 'blue', category: 'renewable-energy' },
  { ticker: 'ENPH', name: 'Enphase Energy', sector: 'Renewable Energy', team: 'blue', category: 'renewable-energy' },
  { ticker: 'FSLR', name: 'First Solar', sector: 'Renewable Energy', team: 'blue', category: 'renewable-energy' },
];

// Aggregate all Blue Team tickers
export const BLUE_TEAM_ALL: StockTicker[] = [
  ...BLUE_TEAM_QUANTUM,
  ...BLUE_TEAM_AEROSPACE,
  ...BLUE_TEAM_LONGEVITY,
  ...BLUE_TEAM_SYNTHETIC_BIOLOGY,
  ...BLUE_TEAM_SATELLITE_COMMUNICATIONS,
  ...BLUE_TEAM_BCI,
  ...BLUE_TEAM_BATTERY_ESS,
  ...BLUE_TEAM_RENEWABLE_ENERGY,
];

// ============================================================================
// WHITE TEAM - Traditional & Incumbent Sectors (15 stocks)
// ============================================================================

export const WHITE_TEAM_TRADITIONAL_ENERGY: StockTicker[] = [
  { ticker: 'XOM', name: 'Exxon Mobil', sector: 'Traditional Energy', team: 'white', category: 'traditional-energy' },
  { ticker: 'CVX', name: 'Chevron Corporation', sector: 'Traditional Energy', team: 'white', category: 'traditional-energy' },
  { ticker: 'COP', name: 'ConocoPhillips', sector: 'Traditional Energy', team: 'white', category: 'traditional-energy' },
];

export const WHITE_TEAM_PAYMENT_SYSTEMS: StockTicker[] = [
  { ticker: 'V', name: 'Visa Inc', sector: 'Payment Systems', team: 'white', category: 'payment-systems' },
  { ticker: 'MA', name: 'Mastercard Inc', sector: 'Payment Systems', team: 'white', category: 'payment-systems' },
  { ticker: 'AXP', name: 'American Express', sector: 'Payment Systems', team: 'white', category: 'payment-systems' },
  { ticker: 'PYPL', name: 'PayPal Holdings', sector: 'Payment Systems', team: 'white', category: 'payment-systems' },
];

export const WHITE_TEAM_DATA_INFRASTRUCTURE: StockTicker[] = [
  { ticker: 'GOOGL', name: 'Alphabet Inc', sector: 'Data Infrastructure', team: 'white', category: 'data-infrastructure' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Data Infrastructure', team: 'white', category: 'data-infrastructure' },
  { ticker: 'META', name: 'Meta Platforms', sector: 'Data Infrastructure', team: 'white', category: 'data-infrastructure' },
  { ticker: 'AMZN', name: 'Amazon.com', sector: 'Data Infrastructure', team: 'white', category: 'data-infrastructure' },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Data Infrastructure', team: 'white', category: 'data-infrastructure' },
];

export const WHITE_TEAM_FINANCIAL_INSTITUTIONS: StockTicker[] = [
  { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Financial Institutions', team: 'white', category: 'financial-institutions' },
  { ticker: 'BLK', name: 'BlackRock Inc', sector: 'Asset Management', team: 'white', category: 'financial-institutions' },
  { ticker: 'GS', name: 'Goldman Sachs', sector: 'Financial Institutions', team: 'white', category: 'financial-institutions' },
];

export const WHITE_TEAM_ESSENTIAL_CONSUMER_GOODS: StockTicker[] = [
  { ticker: 'WMT', name: 'Walmart Inc', sector: 'Essential Consumer Goods', team: 'white', category: 'essential-consumer' },
  { ticker: 'PG', name: 'Procter & Gamble', sector: 'Essential Consumer Goods', team: 'white', category: 'essential-consumer' },
  { ticker: 'KO', name: 'Coca-Cola Company', sector: 'Essential Consumer Goods', team: 'white', category: 'essential-consumer' },
  { ticker: 'PEP', name: 'PepsiCo Inc', sector: 'Essential Consumer Goods', team: 'white', category: 'essential-consumer' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Essential Consumer Goods', team: 'white', category: 'essential-consumer' },
];

export const WHITE_TEAM_LUXURY_GOODS: StockTicker[] = [
  { ticker: 'EL', name: 'Estée Lauder', sector: 'Luxury Consumer Goods', team: 'white', category: 'luxury-goods' },
  { ticker: 'CPRI', name: 'Capri Holdings', sector: 'Luxury Consumer Goods', team: 'white', category: 'luxury-goods' },
];

export const WHITE_TEAM_WATER_FOOD: StockTicker[] = [
  { ticker: 'AWK', name: 'American Water Works', sector: 'Water & Food Security', team: 'white', category: 'water-food' },
  { ticker: 'ADM', name: 'Archer-Daniels-Midland', sector: 'Water & Food Security', team: 'white', category: 'water-food' },
  { ticker: 'CTVA', name: 'Corteva Inc', sector: 'Water & Food Security', team: 'white', category: 'water-food' },
];

// Aggregate all White Team tickers
export const WHITE_TEAM_ALL: StockTicker[] = [
  ...WHITE_TEAM_TRADITIONAL_ENERGY,
  ...WHITE_TEAM_PAYMENT_SYSTEMS,
  ...WHITE_TEAM_DATA_INFRASTRUCTURE,
  ...WHITE_TEAM_FINANCIAL_INSTITUTIONS,
  ...WHITE_TEAM_ESSENTIAL_CONSUMER_GOODS,
  ...WHITE_TEAM_LUXURY_GOODS,
  ...WHITE_TEAM_WATER_FOOD,
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
  blue: 'Blue Team (청팀)',
  white: 'White Team (백팀)',
} as const;

export const TEAM_DESCRIPTIONS = {
  blue: 'Future-focused sectors: Quantum, Aerospace, Longevity, Synthetic Biology, Satellite, BCI, Battery, Renewable',
  white: 'Traditional/incumbent sectors: Energy, Payment Systems, Data Infrastructure, Financial, Consumer, Luxury, Water & Food',
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
