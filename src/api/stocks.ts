import { STATIC, fetchStatic, fetchApi } from './dataClient'
import type {
  StockSearchItem, StockDetailResponse, RSHistoryResponse, StocksIndexResponse,
  OhlcResponse,
} from '../types'

// 靜態模式：一次載入 stocks_index.json，之後前端過濾（記憶化）
let _indexCache: Promise<StocksIndexResponse> | null = null
export const fetchStocksIndex = (): Promise<StocksIndexResponse> => {
  if (!STATIC) return fetchApi('/api/stocks')  // dev 模式不會用到，占位
  if (!_indexCache) _indexCache = fetchStatic<StocksIndexResponse>('stocks_index.json')
  return _indexCache
}

export const searchStocks = async (q: string): Promise<StockSearchItem[]> => {
  if (STATIC) {
    const { stocks } = await fetchStocksIndex()
    const qu = q.toUpperCase()
    return stocks
      .filter(s => s.ticker.includes(qu) || s.name.toUpperCase().includes(qu))
      .slice(0, 15)
      .map(s => ({
        ticker: s.ticker, name: s.name,
        sector_key: s.sector_key, sector_name: s.sector_name,
      }))
  }
  const { results } = await fetchApi<{ results: StockSearchItem[] }>('/api/stocks/search', { q })
  return results
}

export const fetchStockDetail = (ticker: string): Promise<StockDetailResponse> =>
  STATIC
    ? fetchStatic(`stock_${ticker.toUpperCase()}.json`)
    : fetchApi(`/api/stocks/${ticker}`)

export const fetchRSHistory = (ticker: string): Promise<RSHistoryResponse> =>
  STATIC
    ? fetchStatic(`stock_${ticker.toUpperCase()}_rs_history.json`)
    : fetchApi(`/api/stocks/${ticker}/rs-history`)

// 個股與 ETF 共用同一 OHLC 路徑（PriceHistory 兩者皆有）
export const fetchOhlc = (ticker: string): Promise<OhlcResponse> =>
  STATIC
    ? fetchStatic(`stock_${ticker.toUpperCase()}_ohlc.json`)
    : fetchApi(`/api/stocks/${ticker}/ohlc`)
