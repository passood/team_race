import { useQuery } from '@tanstack/react-query'
import { getAllStocks, getStockMetadata } from '@/services/stockApi'
import type { StockData, StockMetadata } from '@/types/stock'

/**
 * Hook to fetch all stock data
 */
export function useStockData() {
  return useQuery<StockData[], Error>({
    queryKey: ['stocks', 'all'],
    queryFn: getAllStocks,
  })
}

/**
 * Hook to fetch stock metadata
 */
export function useStockMetadata() {
  return useQuery<StockMetadata, Error>({
    queryKey: ['stocks', 'metadata'],
    queryFn: getStockMetadata,
  })
}
