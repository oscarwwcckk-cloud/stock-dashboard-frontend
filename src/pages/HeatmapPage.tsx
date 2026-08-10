import { useQuery } from '@tanstack/react-query'
import { fetchEtfs } from '../api/etfs'
import type { EtfListResponse } from '../types'
import Heatmap, { type HeatTile } from '../components/Heatmap'

export default function HeatmapPage() {
  const { data, isLoading, error } = useQuery<EtfListResponse>({
    queryKey: ['etfs'],
    queryFn: fetchEtfs,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })

  const toTiles = (group: string): HeatTile[] =>
    (data?.etfs ?? [])
      .filter(e => e.group === group)
      .map(e => ({ ticker: e.etf_ticker, label: e.name, change_pct: e.change_pct, to: `/etf/${e.etf_ticker}` }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">板塊熱力圖</h1>
        {data?.date && <p className="text-slate-500 text-sm mt-1">Last updated: {data.date}</p>}
        <p className="text-slate-500 text-xs mt-1">磚塊底色為當日漲跌幅（綠漲紅跌，越飽和越大）。點磚看該 ETF 成分股。</p>
      </div>

      {isLoading && <div className="text-slate-500 animate-pulse text-sm">Loading...</div>}
      {error && <div className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-3">Failed to load.</div>}

      {data && (
        <>
          <section className="space-y-2">
            <h2 className="text-slate-400 text-xs uppercase tracking-wider font-semibold">SPDR Select Sector</h2>
            <Heatmap tiles={toTiles('spdr')} />
          </section>
          <section className="space-y-2">
            <h2 className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Thematic</h2>
            <Heatmap tiles={toTiles('thematic')} />
          </section>
        </>
      )}
    </div>
  )
}
