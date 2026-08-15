import { STATIC, fetchStatic, fetchApi } from './dataClient'
import type { SectorListResponse, SectorDetailResponse, SectorHistoryResponse } from '../types'

export const fetchSectors = (sortBy = 'rs_rating'): Promise<SectorListResponse> =>
  STATIC
    ? fetchStatic('sectors.json')
    : fetchApi('/api/sectors', { sort_by: sortBy })

export const fetchSectorDetail = (key: string): Promise<SectorDetailResponse> =>
  STATIC
    ? fetchStatic(`sector_${key}.json`)
    : fetchApi(`/api/sectors/${key}`)

export const fetchSectorHistory = (key: string, days = 90): Promise<SectorHistoryResponse> =>
  STATIC
    ? fetchStatic(`sector_${key}_history.json`)
    : fetchApi(`/api/sectors/${key}/history`, { days })
