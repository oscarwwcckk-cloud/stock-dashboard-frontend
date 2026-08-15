import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchEtfDetail, fetchEtfHistory } from '../api/etfs'
import { fetchOhlc } from '../api/stocks'
import { fmtPct, fmtPrice, pctColor, rsColor } from '../utils/format'
import RankBadge from '../components/RankBadge'
import StockTable from '../components/StockTable'
import RSChart from '../components/RSChart'
import CandleChart from '../components/CandleChart'

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

  const { data: ohlc } = useQuery({
    queryKey: ['etf-ohlc', ticker],
    queryFn: () => fetchOhlc(ticker!),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-10 text-[#5C6480] animate-pulse font-mono">載入中...</div>
  }
  if (!detail) {
    return <div className="max-w-7xl mx-auto px-4 py-10 text-[#EF5465]">找不到ETF。</div>
  }

  const chartData = history?.data.map(d => ({ date: d.date, value: d.rs_rating })) ?? []

  const pills: { label: string; value: number | null }[] = [
    { label: '1D', value: detail.change_pct },
    { label: '5D', value: detail.change_5d },
    { label: '1M', value: detail.change_20d },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-[#5C6480]">
        <Link to="/etfs" className="hover:text-[#4E8AFF] transition-colors">ETF排名</Link>
        <span>/</span>
        <span className="text-[#C8D1E8]">{detail.etf_ticker}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#C8D1E8]">
            <span className="font-mono">{detail.etf_ticker}</span>
            <span className="text-[#5C6480] text-lg ml-3">{detail.name}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <RankBadge rank={detail.rs_rank} total={19} label="檔ETF" />
            <span className={`text-sm px-3 py-1 rounded font-mono font-bold ${rsColor(detail.rs_rating)}`}>
              RS {detail.rs_rating ?? '—'}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-mono border ${detail.group === 'thematic' ? 'bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/20' : 'bg-[#4E8AFF]/10 text-[#4E8AFF] border-[#4E8AFF]/20'}`}>
              {detail.group === 'thematic' ? '主題型' : 'SPDR'}
            </span>
            <span className="text-[#5C6480] text-xs font-mono">{fmtPrice(detail.price)}</span>
            <span className="text-[#5C6480] text-xs">{detail.constituent_count} 支成分股</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {pills.map(p => (
            <div key={p.label} className="px-3 py-2 text-center min-w-16 bg-[#1C2030] border border-[#252B3D]">
              <div className="text-[10px] font-mono text-[#5C6480]">{p.label}</div>
              <div className={`font-mono font-bold text-sm ${pctColor(p.value)}`}>{fmtPct(p.value)}</div>
            </div>
          ))}
        </div>
      </div>

      {ohlc && ohlc.bars.length > 0 && (
        <div className="bg-[#131720] border border-[#252B3D] p-4">
          <h2 className="panel-label mb-3">
            價格 — 日線K棒
          </h2>
          <CandleChart bars={ohlc.bars} height={360} />
        </div>
      )}

      {chartData.length > 0 && (
        <div className="bg-[#131720] border border-[#252B3D] p-4">
          <h2 className="panel-label mb-3">
            90日 RS Rating
          </h2>
          <RSChart data={chartData} label="RS Rating" color="#a78bfa" />
        </div>
      )}

      {detail.stocks.length > 0 && (
        <div className="space-y-2">
          <h2 className="panel-label">成分股 — 依 RS Rating 排名（{detail.stocks.length}）</h2>
          <StockTable stocks={detail.stocks} />
        </div>
      )}
    </div>
  )
}
