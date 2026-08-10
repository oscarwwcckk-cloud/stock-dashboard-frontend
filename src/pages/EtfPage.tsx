import { useQuery } from '@tanstack/react-query'
import { fetchEtfs } from '../api/etfs'
import type { EtfListResponse } from '../types'
import EtfRankTable from '../components/EtfRankTable'

export default function EtfPage() {
  const { data, isLoading, error } = useQuery<EtfListResponse>({
    queryKey: ['etfs'],
    queryFn: fetchEtfs,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })

  const spdr = data?.etfs.filter(e => e.group === 'spdr') ?? []
  const thematic = data?.etfs.filter(e => e.group === 'thematic') ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">ETF 板塊排名</h1>
        {data?.date && <p className="text-slate-500 text-sm mt-1">Last updated: {data.date}</p>}
        <p className="text-slate-500 text-xs mt-1">追蹤真實板塊 ETF 的 RS Rating（1–99，與個股同基準可比）。點 ETF 看內部成分股依 RS 排名。</p>
      </div>

      {isLoading && <div className="text-slate-500 animate-pulse text-sm">Loading ETFs...</div>}
      {error && (
        <div className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-3">
          Failed to load ETF data.
        </div>
      )}

      {data && (
        <>
          <section className="space-y-2">
            <h2 className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
              SPDR Select Sector — {spdr.length} 檔 GICS 板塊
            </h2>
            <EtfRankTable etfs={spdr} />
          </section>

          <section className="space-y-2">
            <h2 className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
              Thematic — {thematic.length} 檔主題 ETF
            </h2>
            <EtfRankTable etfs={thematic} />
          </section>
        </>
      )}
    </div>
  )
}
