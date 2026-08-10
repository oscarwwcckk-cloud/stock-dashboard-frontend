import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchWatchlist } from '../api/watchlist'
import type { WatchlistResponse, WatchlistEntry } from '../types'
import { fmtPrice, fmtPct, rsColor } from '../utils/format'

function scoreColor(v: number | null): string {
  if (v == null) return 'text-slate-400'
  if (v >= 4) return 'text-emerald-300 font-bold'
  if (v >= 3) return 'text-emerald-500'
  if (v >= 2) return 'text-yellow-500'
  return 'text-slate-400'
}

function JlawTable({ rows }: { rows: WatchlistEntry[] }) {
  if (rows.length === 0) {
    return <div className="text-slate-500 text-sm px-4 py-6">目前沒有符合條件的股票。</div>
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Ticker</th>
            <th className="px-3 py-3 text-right">Price</th>
            <th className="px-3 py-3 text-right">RS Score</th>
            <th className="px-3 py-3 text-right">Pivot</th>
            <th className="px-3 py-3 text-right">% from Pivot</th>
            <th className="px-3 py-3 text-right">J.Law</th>
            <th className="px-3 py-3 text-right">Base Amp</th>
            <th className="px-3 py-3 text-right">Base Days</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => (
            <tr key={s.ticker} className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors">
              <td className="px-4 py-2 text-slate-500 font-mono text-xs">{i + 1}</td>
              <td className="px-4 py-2">
                <Link to={`/stock/${s.ticker}`} className="font-bold text-white hover:text-blue-400 font-mono">{s.ticker}</Link>
                <div className="text-slate-500 text-xs truncate max-w-40">{s.name}</div>
              </td>
              <td className="px-3 py-2 text-right font-mono text-slate-300">{fmtPrice(s.price)}</td>
              <td className={`px-3 py-2 text-right font-mono font-bold text-xs ${rsColor(s.rs_score)}`}>{s.rs_score ?? '—'}</td>
              <td className="px-3 py-2 text-right font-mono text-slate-300">{fmtPrice(s.pivot_price)}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${s.pct_from_pivot != null && s.pct_from_pivot >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmtPct(s.pct_from_pivot)}</td>
              <td className={`px-3 py-2 text-right font-mono font-bold text-xs ${scoreColor(s.jlaw_score)}`}>{s.jlaw_score ?? '—'}/4</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-slate-400">{fmtPct(s.base_amplitude)}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-slate-400">{s.base_length ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function WatchlistPage() {
  const { data, isLoading, error } = useQuery<WatchlistResponse>({
    queryKey: ['watchlist'],
    queryFn: fetchWatchlist,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">J.Law 買入 / 觀察名單</h1>
        {data?.date && <p className="text-slate-500 text-sm mt-1">Last updated: {data.date}</p>}
      </div>

      {isLoading && <div className="text-slate-500 animate-pulse text-sm">Loading watchlist...</div>}

      {error && (
        <div className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-3">
          Failed to load watchlist. Make sure the backend is running.
        </div>
      )}

      {data && (
        <>
          <section className="space-y-2">
            <h2 className="text-emerald-400 text-xs uppercase tracking-wider font-semibold">
              買入名單 · 即將突破（軸心點上方 0–5%、緊湊整理、評分 ≥ 3、RS ≥ 70）— {data.buy_list.length}
            </h2>
            <JlawTable rows={data.buy_list} />
          </section>

          <section className="space-y-2">
            <h2 className="text-yellow-400 text-xs uppercase tracking-wider font-semibold">
              觀察名單 · 形態構建中（低於軸心點、緊湊整理、量能收縮、評分 ≥ 2、RS ≥ 60）— {data.watch_list.length}
            </h2>
            <JlawTable rows={data.watch_list} />
          </section>
        </>
      )}
    </div>
  )
}
