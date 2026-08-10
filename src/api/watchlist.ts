import { STATIC, fetchStatic, fetchApi } from './dataClient'
import type { WatchlistResponse } from '../types'

export const fetchWatchlist = (): Promise<WatchlistResponse> =>
  STATIC
    ? fetchStatic('watchlist.json')
    : fetchApi('/api/watchlist')
