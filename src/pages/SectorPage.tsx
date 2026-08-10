import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchSectorDetail, fetchSectorHistory } from '../api/sectors'
import { fmtPct, excessBg } from '../utils/format'
import RankBadge from '../components/RankBadge'
import StockTable from '../components/StockTable'
import RSChart from '../components/RSChart'

export default function SectorPage() {
  const { key } = useParams<{ key: string }>()

  const { data: detail, isLoading } = useQuery({
    queryKey: ['sector', key],
    queryFn: () => fetchSectorDetail(key!),
    enabled: !!key,
    staleTime: 5 * 60 * 1000,
  })

  const { data: history } = useQuery({
    queryKey: ['sector-history', key],
    queryFn: () => fetchSectorHistory(key!),
    enabled: !!key,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-10 text-slate-500 animate-pulse">Loading...</div>
  }

  if (!detail) {
    return <div className="max-w-7xl mx-auto px-4 py-10 text-red-400">Sector not found.</div>
  }

  const chartData = history?.data.map(d => ({ date: d.date, value: d.rs_score })) ?? []

  const pills: { label: string; value: number | null }[] = [
    { label: '1D', value: detail.rs_1d },
    { label: '5D', value: detail.rs_5d },
    { label: '1M', value: detail.rs_20d },
    { label: '3M', value: detail.rs_63d },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <span>/</span>
        <span className="text-slate-300">{detail.sector_name}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">{detail.sector_name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <RankBadge rank={detail.rs_rank} total={20} label="sectors" />
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${detail.benchmark === 'QQQ' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
              vs {detail.benchmark}
            </span>
            <span className="text-slate-500 text-xs">{detail.constituent_count} stocks</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {pills.map(p => (
            <div key={p.label} className={`px-3 py-2 rounded-lg text-center min-w-16 ${excessBg(p.value)}`}>
              <div className="text-xs text-slate-400">{p.label}</div>
              <div className="font-mono font-bold text-sm">{fmtPct(p.value)}</div>
            </div>
          ))}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
          <h2 className="text-slate-400 text-xs uppercase tracking-wider mb-3 font-semibold">
            90-Day Composite RS vs {detail.benchmark}
          </h2>
          <RSChart data={chartData} label="RS Score" referenceValue={0} />
        </div>
      )}

      {detail.stocks.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
            Stocks — Ranked by RS Score
          </h2>
          <StockTable stocks={detail.stocks} />
        </div>
      )}
    </div>
  )
}
