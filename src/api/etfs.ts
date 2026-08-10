import { STATIC, fetchStatic, fetchApi } from './dataClient'
import type { EtfListResponse, EtfDetailResponse, EtfHistoryResponse } from '../types'

export const fetchEtfs = (): Promise<EtfListResponse> =>
  STATIC
    ? fetchStatic('etfs.json')
    : fetchApi('/api/etfs', { sort_by: 'rs_rating' })

export const fetchEtfDetail = (ticker: string): Promise<EtfDetailResponse> =>
  STATIC
    ? fetchStatic(`etf_${ticker.toUpperCase()}.json`)
    : fetchApi(`/api/etfs/${ticker}`)

export const fetchEtfHistory = (ticker: string): Promise<EtfHistoryResponse> =>
  STATIC
    ? fetchStatic(`etf_${ticker.toUpperCase()}_history.json`)
    : fetchApi(`/api/etfs/${ticker}/history`)
