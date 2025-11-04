/**
 * Chart Race Data Transformation Utilities
 *
 * This file contains functions to transform raw stock data into frames
 * suitable for the D3.js chart race animation.
 */

import type { StockData } from '../types/stock'
import type { ChartRaceFrame, ChartRaceStock } from '../components/ChartRace/types'

/**
 * Filter configuration for preparing chart race frames
 */
export interface ChartRaceFilters {
  /** Team filter: 'all', 'blue', or 'white' */
  team: 'all' | 'blue' | 'white'

  /** Selected sectors to include (empty array = all sectors) */
  selectedSectors: string[]
}

/**
 * Date range for filtering historical data
 */
export interface DateRange {
  start: string // YYYY-MM-DD format
  end: string // YYYY-MM-DD format
}

/**
 * Prepare chart race frames from raw stock data
 *
 * This function transforms an array of StockData into an array of ChartRaceFrame objects,
 * applying filters and calculating rankings for each trading day.
 *
 * @param stocks - Array of stock data with historical prices
 * @param dateRange - Date range to filter (start and end dates in YYYY-MM-DD format)
 * @param filters - Team and sector filters
 * @returns Array of frames, one per trading day, sorted by date
 *
 * @example
 * ```typescript
 * const frames = prepareChartRaceFrames(
 *   stockData,
 *   { start: '2020-01-01', end: '2025-01-01' },
 *   { team: 'blue', selectedSectors: ['AI & Cloud'] }
 * );
 * ```
 */
export function prepareChartRaceFrames(
  stocks: StockData[],
  dateRange: DateRange,
  filters: ChartRaceFilters
): ChartRaceFrame[] {
  // Step 1: Filter stocks by team and sector
  const filteredStocks = filterStocks(stocks, filters)

  if (filteredStocks.length === 0) {
    return []
  }

  // Step 2: Extract all unique trading dates within the date range
  const uniqueDates = extractUniqueDates(filteredStocks, dateRange)

  if (uniqueDates.length === 0) {
    return []
  }

  // Step 3: Build frames for each date
  const frames: ChartRaceFrame[] = []
  let previousFrameStocks: Map<string, number> = new Map() // ticker -> cumulativeReturn

  // Get the baseline date (first date in range) for cumulative return calculation
  const baselineDate = uniqueDates.length > 0 ? uniqueDates[0] : null

  for (const date of uniqueDates) {
    const frameStocks = buildFrameStocks(filteredStocks, date, previousFrameStocks, baselineDate)

    if (frameStocks.length > 0) {
      frames.push({
        date,
        stocks: frameStocks,
      })

      // Update previous frame for next iteration
      previousFrameStocks = new Map(frameStocks.map((s) => [s.ticker, s.cumulativeReturn]))
    }
  }

  return frames
}

/**
 * Filter stocks by team and sector
 */
function filterStocks(stocks: StockData[], filters: ChartRaceFilters): StockData[] {
  return stocks.filter((stock) => {
    // Filter by team
    if (filters.team !== 'all' && stock.team !== filters.team) {
      return false
    }

    // Filter by sector (if sectors are specified)
    if (filters.selectedSectors.length > 0 && !filters.selectedSectors.includes(stock.sector)) {
      return false
    }

    // Exclude stocks with errors
    if (stock.error) {
      return false
    }

    return true
  })
}

/**
 * Extract all unique trading dates from stock histories within the date range
 */
function extractUniqueDates(stocks: StockData[], dateRange: DateRange): string[] {
  const dateSet = new Set<string>()

  for (const stock of stocks) {
    for (const dataPoint of stock.history) {
      if (dataPoint.date >= dateRange.start && dataPoint.date <= dateRange.end) {
        dateSet.add(dataPoint.date)
      }
    }
  }

  // Sort dates chronologically
  return Array.from(dateSet).sort()
}

/**
 * Build ChartRaceStock array for a specific date
 */
function buildFrameStocks(
  stocks: StockData[],
  date: string,
  previousFrameStocks: Map<string, number>,
  baselineDate: string | null
): ChartRaceStock[] {
  const stocksWithData: ChartRaceStock[] = []

  for (const stock of stocks) {
    // Find historical data point for this date
    const dataPoint = stock.history.find((h) => h.date === date)

    if (!dataPoint) {
      continue // Skip if no data for this date
    }

    // Calculate cumulative return from baseline date
    let cumulativeReturn: number

    if (baselineDate) {
      // Find the baseline price (first date in the selected range)
      const baselinePoint = stock.history.find((h) => h.date === baselineDate)

      if (baselinePoint && baselinePoint.adjClose > 0) {
        // Calculate cumulative return as a multiplier
        // 1.0 = 100% (no change), 1.25 = 125% (+25%), 0.75 = 75% (-25%)
        cumulativeReturn = dataPoint.adjClose / baselinePoint.adjClose
      } else {
        // No baseline data available, use 1.0 (100%) as default
        cumulativeReturn = 1.0
      }
    } else {
      // No baseline date, default to 1.0
      cumulativeReturn = 1.0
    }

    // Calculate percent change from previous frame
    const previousReturn = previousFrameStocks.get(stock.ticker)
    const percentChange =
      previousReturn !== undefined && previousReturn > 0
        ? ((cumulativeReturn - previousReturn) / previousReturn) * 100
        : 0

    stocksWithData.push({
      ticker: stock.ticker,
      name: stock.name,
      cumulativeReturn,
      rank: 0, // Will be assigned after sorting
      team: stock.team,
      sector: stock.sector,
      percentChange,
    })
  }

  // Sort by cumulative return (descending) and assign ranks
  stocksWithData.sort((a, b) => b.cumulativeReturn - a.cumulativeReturn)

  // Assign ranks
  stocksWithData.forEach((stock, index) => {
    stock.rank = index + 1
  })

  // Return top 20 stocks only
  return stocksWithData.slice(0, 20)
}

/**
 * Get the first available frame (earliest date)
 *
 * @param frames - Array of chart race frames
 * @returns First frame or null if no frames
 */
export function getFirstFrame(frames: ChartRaceFrame[]): ChartRaceFrame | null {
  return frames.length > 0 ? frames[0] : null
}

/**
 * Get the last available frame (latest date)
 *
 * @param frames - Array of chart race frames
 * @returns Last frame or null if no frames
 */
export function getLastFrame(frames: ChartRaceFrame[]): ChartRaceFrame | null {
  return frames.length > 0 ? frames[frames.length - 1] : null
}

/**
 * Get frame by index
 *
 * @param frames - Array of chart race frames
 * @param index - Frame index (0-based)
 * @returns Frame at index or null if out of bounds
 */
export function getFrameByIndex(frames: ChartRaceFrame[], index: number): ChartRaceFrame | null {
  if (index >= 0 && index < frames.length) {
    return frames[index]
  }
  return null
}

/**
 * Get frame by date (exact match)
 *
 * @param frames - Array of chart race frames
 * @param date - Date in YYYY-MM-DD format
 * @returns Frame for the specified date or null if not found
 */
export function getFrameByDate(frames: ChartRaceFrame[], date: string): ChartRaceFrame | null {
  return frames.find((frame) => frame.date === date) ?? null
}

/**
 * Get total number of frames
 *
 * @param frames - Array of chart race frames
 * @returns Total frame count
 */
export function getTotalFrames(frames: ChartRaceFrame[]): number {
  return frames.length
}

/**
 * Validate date range
 *
 * @param dateRange - Date range to validate
 * @returns True if valid, false otherwise
 */
export function isValidDateRange(dateRange: DateRange): boolean {
  if (!dateRange.start || !dateRange.end) {
    return false
  }

  // Check date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateRange.start) || !dateRegex.test(dateRange.end)) {
    return false
  }

  // Check that start is before or equal to end
  return dateRange.start <= dateRange.end
}
