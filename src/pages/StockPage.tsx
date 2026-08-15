import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchStockDetail, fetchRSHistory, fetchOhlc } from '../api/stocks'
import { fmtPrice, fmtPct, pctColor, rsColor } from '../utils/format'
import RankBadge from '../components/RankBadge'
import RSChart from '../components/RSChart'
import CandleChart from '../components/CandleChart'

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

  const { data: ohlc } = useQuery({
    queryKey: ['stock-ohlc', ticker],
    queryFn: () => fetchOhlc(ticker!),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-10 text-[#5C6480] animate-pulse font-mono">載入中...</div>
  }

  if (!stock) {
    return <div className="max-w-7xl mx-auto px-4 py-10 text-[#EF5465]">找不到股票。</div>
  }

  const chartData = history?.data.map((d: { date: string; rs_ratio: number }) => ({
    date: d.date,
    value: (d.rs_ratio - 1) * 100,
  })) ?? []

  const cards = [
    { label: 'RS Score', value: stock.rs_score != null ? String(stock.rs_score) : '—', extra: '' },
    { label: '今日 vs 基準', value: fmtPct(stock.change_pct), extra: pctColor(stock.change_pct) },
    { label: 'RS vs 基準', value: fmtPct(stock.rs_vs_benchmark), extra: pctColor(stock.rs_vs_benchmark) },
    { label: '股價', value: fmtPrice(stock.price), extra: 'text-white' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/sectors" className="hover:text-blue-400">板塊</Link>
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
          <p className="text-[#5C6480]">{stock.name}</p>
          <div className="flex flex-wrap items-center gap-2">
            <RankBadge rank={stock.sector_rank} total={stock.total_in_sector} label={`${stock.sector_name}排名`} />
            <span className={`text-xs px-1.5 py-0.5 rounded font-mono border ${stock.benchmark === 'QQQ' ? 'bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/20' : 'bg-[#4E8AFF]/10 text-[#4E8AFF] border-[#4E8AFF]/20'}`}>
              vs {stock.benchmark}
            </span>
            {stock.industry && (
              <span className="text-[#5C6480] text-xs">{stock.industry}</span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-[#C8D1E8] font-mono">{fmtPrice(stock.price)}</div>
          <div className={`text-sm font-mono ${pctColor(stock.change_pct)}`}>{fmtPct(stock.change_pct)} 今日</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {cards.map(c => (
          <div key={c.label} className="bg-[#131720] border border-[#252B3D] px-4 py-3">
            <div className="panel-label mb-1">{c.label}</div>
            <div className={`text-lg font-bold font-mono ${c.extra || 'text-[#C8D1E8]'}`}>{c.value}</div>
          </div>
        ))}
      </div>

      {ohlc && ohlc.bars.length > 0 && (
        <div className="bg-[#131720] border border-[#252B3D] p-4">
          <h2 className="panel-label mb-3">價格 — 日線K棒</h2>
          <CandleChart bars={ohlc.bars} height={360} />
        </div>
      )}

      {chartData.length > 0 && (
        <div className="bg-[#131720] border border-[#252B3D] p-4">
          <h2 className="panel-label mb-3">252日 RS比率 vs {history?.benchmark ?? stock.benchmark}（相對起點百分比）</h2>
          <RSChart data={chartData} label="RS Ratio" referenceValue={0} height={260} />
        </div>
      )}
    </div>
  )
}
