import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchStockDetail, fetchRSHistory } from '../api/stocks'
import { fmtPrice, fmtPct, pctColor, rsColor } from '../utils/format'
import RankBadge from '../components/RankBadge'
import RSChart from '../components/RSChart'

export default function StockPage() {
  const { ticker } = useParams<{ ticker: string }>()

  const { data: stock, isLoading } = useQuery({
    queryKey: ['stock', ticker],
    queryFn: () => fetchStockDetail(ticker!),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
  })

  const { data: history } = useQuery({
    queryKey: ['stock-rs-history', ticker],
    queryFn: () => fetchRSHistory(ticker!),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-10 text-slate-500 animate-pulse">Loading...</div>
  }

  if (!stock) {
    return <div className="max-w-7xl mx-auto px-4 py-10 text-red-400">Stock not found.</div>
  }

  const chartData = history?.data.map((d: { date: string; rs_ratio: number }) => ({
    date: d.date,
    value: (d.rs_ratio - 1) * 100,
  })) ?? []

  const cards = [
    { label: 'RS Score', value: stock.rs_score != null ? String(stock.rs_score) : '—', extra: '' },
    { label: '1D vs Bench', value: fmtPct(stock.change_pct), extra: pctColor(stock.change_pct) },
    { label: 'RS vs Bench', value: fmtPct(stock.rs_vs_benchmark), extra: pctColor(stock.rs_vs_benchmark) },
    { label: 'Price', value: fmtPrice(stock.price), extra: 'text-white' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <span>/</span>
        <Link to={`/sector/${stock.sector_key}`} className="hover:text-blue-400">{stock.sector_name}</Link>
        <span>/</span>
        <span className="text-slate-300 font-mono">{stock.ticker}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white font-mono">{stock.ticker}</h1>
            <span className={`text-2xl font-bold font-mono ${rsColor(stock.rs_score)}`}>
              {stock.rs_score ?? '—'}
            </span>
          </div>
          <p className="text-slate-400">{stock.name}</p>
          <div className="flex flex-wrap items-center gap-2">
            <RankBadge rank={stock.sector_rank} total={stock.total_in_sector} label={stock.sector_name} />
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${stock.benchmark === 'QQQ' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
              vs {stock.benchmark}
            </span>
            {stock.industry && (
              <span className="text-slate-500 text-xs">{stock.industry}</span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-white font-mono">{fmtPrice(stock.price)}</div>
          <div className={`text-sm font-mono ${pctColor(stock.change_pct)}`}>{fmtPct(stock.change_pct)} today</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map(c => (
          <div key={c.label} className="bg-slate-800 rounded-xl border border-slate-700 px-4 py-3">
            <div className="text-slate-500 text-xs mb-1">{c.label}</div>
            <div className={`text-lg font-bold font-mono ${c.extra || 'text-white'}`}>{c.value}</div>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
          <h2 className="text-slate-400 text-xs uppercase tracking-wider mb-3 font-semibold">
            252-Day RS Ratio vs {history?.benchmark ?? stock.benchmark} (% from start)
          </h2>
          <RSChart data={chartData} label="RS Ratio" referenceValue={0} height={260} />
        </div>
      )}
    </div>
  )
}
