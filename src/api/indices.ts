import { STATIC, fetchStatic, fetchApi } from './dataClient'
import type { IndexSnapshotResponse, HealthResponse } from '../types'

export const fetchIndexSnapshot = (): Promise<IndexSnapshotResponse> =>
  STATIC
    ? fetchStatic('indices.json')
    : fetchApi('/api/indices/snapshot')

export const fetchHealth = async (): Promise<HealthResponse> => {
  if (STATIC) {
    const meta = await fetchStatic<{ last_refresh: string | null }>('meta.json')
    return { status: 'ok', last_refresh: meta.last_refresh, sector_count: 0, stock_count: 0 }
  }
  return fetchApi('/api/health')
}
