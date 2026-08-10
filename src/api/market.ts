import { STATIC, fetchStatic, fetchApi } from './dataClient'
import type { MarketAnalysisResponse, MarketHistoryResponse } from '../types'

export const fetchMarketAnalysis = (): Promise<MarketAnalysisResponse> =>
  STATIC
    ? fetchStatic('market.json')
    : fetchApi('/api/market/analysis')

export const fetchMarketHistory = (indexKey: string, days = 60): Promise<MarketHistoryResponse> =>
  STATIC
    ? fetchStatic(`market_history_${indexKey}.json`)
    : fetchApi(`/api/market/history/${indexKey}`, { days })
