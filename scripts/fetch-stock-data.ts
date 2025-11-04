/**
 * Stock Data Fetching Script
 *
 * Fetches historical stock data from Yahoo Finance for all tickers
 * Runs daily via GitHub Actions to update static JSON files
 */

import YahooFinance from 'yahoo-finance2';
import fs from 'fs/promises';
import path from 'path';
import { ALL_TICKERS, type StockTicker } from '../shared/config/stock-tickers.js';

// Create Yahoo Finance instance
const yahooFinance = new YahooFinance();

// ============================================================================
// TYPES
// ============================================================================

interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose: number;
}

interface FinancialMetrics {
  debtToEquity: number | null;
  currentRatio: number | null;
  marketCap: number | null;
  lastUpdated: string;
}

interface StockData {
  ticker: string;
  name: string;
  sector: string;
  team: 'blue' | 'white';
  category: string;
  history: HistoricalDataPoint[];
  financials: FinancialMetrics;
  error?: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const DATA_DIR = path.join(process.cwd(), 'frontend', 'public', 'data');
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

// Calculate date 5 years ago from today
const today = new Date();
const fiveYearsAgo = new Date();
fiveYearsAgo.setFullYear(today.getFullYear() - 5);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Format date to YYYY-MM-DD
 */
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Fetch stock data with retry logic
 */
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  tickerSymbol: string,
  retries = RETRY_ATTEMPTS
): Promise<T | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.error(
        `[${tickerSymbol}] Attempt ${attempt}/${retries} failed:`,
        error instanceof Error ? error.message : error
      );

      if (attempt < retries) {
        console.log(`[${tickerSymbol}] Retrying in ${RETRY_DELAY_MS}ms...`);
        await sleep(RETRY_DELAY_MS);
      } else {
        console.error(`[${tickerSymbol}] All retry attempts failed`);
        return null;
      }
    }
  }
  return null;
}

// ============================================================================
// DATA FETCHING
// ============================================================================

/**
 * Fetch historical data for a single stock
 */
async function fetchHistoricalData(
  ticker: string
): Promise<HistoricalDataPoint[] | null> {
  console.log(`[${ticker}] Fetching historical data...`);

  const result = await fetchWithRetry(async () => {
    return yahooFinance.chart(ticker, {
      period1: fiveYearsAgo,
      period2: today,
      interval: '1d',
    });
  }, ticker);

  if (!result || !result.quotes) return null;

  // Transform Yahoo Finance data to our format
  const transformed: HistoricalDataPoint[] = result.quotes.map((item: any) => ({
    date: formatDate(item.date),
    open: item.open || 0,
    high: item.high || 0,
    low: item.low || 0,
    close: item.close || 0,
    volume: item.volume || 0,
    adjClose: item.adjclose || item.close || 0,
  }));

  console.log(`[${ticker}] ✓ Fetched ${transformed.length} data points`);
  return transformed;
}

/**
 * Fetch financial metrics for a single stock
 */
async function fetchFinancialMetrics(
  ticker: string
): Promise<FinancialMetrics> {
  console.log(`[${ticker}] Fetching financial metrics...`);

  const quote = await fetchWithRetry(async () => {
    return yahooFinance.quoteSummary(ticker, {
      modules: ['financialData', 'price'],
    });
  }, ticker);

  if (!quote) {
    return {
      debtToEquity: null,
      currentRatio: null,
      marketCap: null,
      lastUpdated: formatDate(today),
    };
  }

  const metrics: FinancialMetrics = {
    debtToEquity: quote.financialData?.debtToEquity ?? null,
    currentRatio: quote.financialData?.currentRatio ?? null,
    marketCap: quote.price?.marketCap ?? null,
    lastUpdated: formatDate(today),
  };

  console.log(`[${ticker}] ✓ Fetched financial metrics`);
  return metrics;
}

/**
 * Fetch all data for a single stock
 */
async function fetchStockData(stock: StockTicker): Promise<StockData> {
  console.log(`\n=== Fetching data for ${stock.ticker} (${stock.name}) ===`);

  try {
    const [history, financials] = await Promise.all([
      fetchHistoricalData(stock.ticker),
      fetchFinancialMetrics(stock.ticker),
    ]);

    if (!history) {
      throw new Error('Failed to fetch historical data');
    }

    return {
      ticker: stock.ticker,
      name: stock.name,
      sector: stock.sector,
      team: stock.team,
      category: stock.category,
      history,
      financials,
    };
  } catch (error) {
    console.error(`[${stock.ticker}] ✗ Error:`, error);

    return {
      ticker: stock.ticker,
      name: stock.name,
      sector: stock.sector,
      team: stock.team,
      category: stock.category,
      history: [],
      financials: {
        debtToEquity: null,
        currentRatio: null,
        marketCap: null,
        lastUpdated: formatDate(today),
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('================================================');
  console.log('Stock Data Fetching Script');
  console.log('================================================');
  console.log(`Total stocks to fetch: ${ALL_TICKERS.length}`);
  console.log(`Date range: ${formatDate(fiveYearsAgo)} to ${formatDate(today)}`);
  console.log('================================================\n');

  // Create data directory if it doesn't exist
  await fs.mkdir(DATA_DIR, { recursive: true });

  // Fetch data for all stocks in parallel (but with rate limiting)
  const BATCH_SIZE = 5; // Process 5 stocks at a time to avoid rate limits
  const allData: StockData[] = [];

  for (let i = 0; i < ALL_TICKERS.length; i += BATCH_SIZE) {
    const batch = ALL_TICKERS.slice(i, i + BATCH_SIZE);
    console.log(`\nProcessing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(ALL_TICKERS.length / BATCH_SIZE)}`);

    const batchResults = await Promise.all(
      batch.map(stock => fetchStockData(stock))
    );

    allData.push(...batchResults);

    // Small delay between batches
    if (i + BATCH_SIZE < ALL_TICKERS.length) {
      console.log('\nWaiting before next batch...');
      await sleep(1000);
    }
  }

  // Filter out stocks with errors
  const successfulData = allData.filter(stock => !stock.error);
  const failedData = allData.filter(stock => stock.error);

  console.log('\n================================================');
  console.log('Summary');
  console.log('================================================');
  console.log(`Successful: ${successfulData.length}/${ALL_TICKERS.length}`);
  console.log(`Failed: ${failedData.length}/${ALL_TICKERS.length}`);

  if (failedData.length > 0) {
    console.log('\nFailed tickers:');
    failedData.forEach(stock => {
      console.log(`  - ${stock.ticker}: ${stock.error}`);
    });
  }

  // Save all data to dated file
  const todayStr = formatDate(today);
  const datedFilePath = path.join(DATA_DIR, `stocks-${todayStr}.json`);
  await fs.writeFile(
    datedFilePath,
    JSON.stringify(allData, null, 2),
    'utf-8'
  );
  console.log(`\n✓ Saved to: ${datedFilePath}`);

  // Save to latest file (always overwrite)
  const latestFilePath = path.join(DATA_DIR, 'stocks-latest.json');
  await fs.writeFile(
    latestFilePath,
    JSON.stringify(allData, null, 2),
    'utf-8'
  );
  console.log(`✓ Saved to: ${latestFilePath}`);

  // Save metadata
  const metadata = {
    lastUpdated: new Date().toISOString(),
    dateRange: {
      start: formatDate(fiveYearsAgo),
      end: formatDate(today),
    },
    totalStocks: ALL_TICKERS.length,
    successfulStocks: successfulData.length,
    failedStocks: failedData.length,
    blueTeamCount: successfulData.filter(s => s.team === 'blue').length,
    whiteTeamCount: successfulData.filter(s => s.team === 'white').length,
  };

  const metadataPath = path.join(DATA_DIR, 'metadata.json');
  await fs.writeFile(
    metadataPath,
    JSON.stringify(metadata, null, 2),
    'utf-8'
  );
  console.log(`✓ Saved metadata to: ${metadataPath}`);

  console.log('\n================================================');
  console.log('Data fetching complete!');
  console.log('================================================\n');

  // Exit with error code if any fetches failed
  if (failedData.length > 0) {
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('\n✗ Fatal error:', error);
  process.exit(1);
});
