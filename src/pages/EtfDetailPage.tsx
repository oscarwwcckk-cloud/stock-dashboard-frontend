import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchEtfDetail, fetchEtfHistory } from '../api/etfs'
import { fmtPct, fmtPrice, pctColor, rsColor } from '../utils/format'
import RankBadge from '../components/RankBadge'
import StockTable from '../components/StockTable'
import RSChart from '../components/RSChart'

export default function EtfDetailPage() {
  const { ticker } = useParams<{ ticker: string }>()

  const { data: detail, isLoading } = useQuery({
    queryKey: ['etf', ticker],
    queryFn: () => fetchEtfDetail(ticker!),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
  })

  const { data: history } = useQuery({
    queryKey: ['etf-history', ticker],
    queryFn: () => fetchEtfHistory(ticker!),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-10 text-slate-500 animate-pulse">Loading...</div>
  }
  if (!detail) {
    return <div className="max-w-7xl mx-auto px-4 py-10 text-red-400">ETF not found.</div>
  }

  const chartData = history?.data.map(d => ({ date: d.date, value: d.rs_rating })) ?? []

  const pills: { label: string; value: number | null }[] = [
    { label: '1D', value: detail.change_pct },
    { label: '5D', value: detail.change_5d },
    { label: '1M', value: detail.change_20d },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/etfs" className="hover:text-blue-400">ETF Rankings</Link>
        <span>/</span>
        <span className="text-slate-300">{detail.etf_ticker}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            <span className="font-mono">{detail.etf_ticker}</span>
            <span className="text-slate-400 text-lg ml-3">{detail.name}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <RankBadge rank={detail.rs_rank} total={19} label="ETFs" />
            <span className={`text-sm px-3 py-1 rounded font-mono font-bold ${rsColor(detail.rs_rating)}`}>
              RS {detail.rs_rating ?? '—'}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${detail.group === 'thematic' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
              {detail.group}
            </span>
            <span className="text-slate-500 text-xs font-mono">{fmtPrice(detail.price)}</span>
            <span className="text-slate-500 text-xs">{detail.constituent_count} stocks</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {pills.map(p => (
            <div key={p.label} className="px-3 py-2 rounded-lg text-center min-w-16 bg-slate-800">
              <div className="text-xs text-slate-400">{p.label}</div>
              <div className={`font-mono font-bold text-sm ${pctColor(p.value)}`}>{fmtPct(p.value)}</div>
            </div>
          ))}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
          <h2 className="text-slate-400 text-xs uppercase tracking-wider mb-3 font-semibold">
            90-Day RS Rating
          </h2>
          <RSChart data={chartData} label="RS Rating" color="#a78bfa" />
        </div>
      )}

      {detail.stocks.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
            成分股 — 依 RS Rating 排名（{detail.stocks.length}）
          </h2>
          <StockTable stocks={detail.stocks} />
        </div>
      )}
    </div>
  )
}
