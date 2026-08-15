import { useQuery } from '@tanstack/react-query'
import { fetchMarketAnalysis, fetchMarketOhlc } from '../api/market'
import type { MarketAnalysisEntry } from '../types'
import { fmtPrice, fmtPct, pctColor } from '../utils/format'
import CandleChart from '../components/CandleChart'

function trendColor(state: string | null): string {
  if (!state) return 'bg-[#1C2030] text-[#5C6480] border border-[#252B3D]'
  if (state === 'Confirmed Uptrend')       return 'bg-[#26C6A6]/10 text-[#26C6A6] border border-[#26C6A6]/30'
  if (state === 'Uptrend Under Pressure')  return 'bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/30'
  if (state === 'Recovery Attempt')        return 'bg-[#4E8AFF]/10 text-[#4E8AFF] border border-[#4E8AFF]/30'
  if (state === 'Market in Correction')    return 'bg-[#EF5465]/10 text-[#EF5465] border border-[#EF5465]/30'
  if (state === 'Bear Market')             return 'bg-[#EF5465]/15 text-[#EF5465] border border-[#EF5465]/40'
  return 'bg-[#1C2030] text-[#5C6480] border border-[#252B3D]'
}

function distDayColor(n: number | null): string {
  if (n == null) return 'text-[#5C6480]'
  if (n >= 7) return 'text-[#EF5465] font-bold'
  if (n >= 5) return 'text-[#F5A623] font-semibold'
  if (n >= 3) return 'text-[#F5A623]'
  return 'text-[#26C6A6]'
}

function rsiColor(v: number | null): string {
  if (v == null) return 'text-[#5C6480]'
  if (v >= 70) return 'text-[#EF5465]'
  if (v >= 60) return 'text-[#F5A623]'
  if (v >= 40) return 'text-[#26C6A6]'
  if (v >= 30) return 'text-[#4E8AFF]'
  return 'text-[#EF5465]'
}

function maLabel(above: number | null) {
  if (above === 1) return <span className="text-[#26C6A6] text-xs font-mono">▲ 上方</span>
  if (above === 0) return <span className="text-[#EF5465] text-xs font-mono">▼ 下方</span>
  return <span className="text-[#5C6480] text-xs">—</span>
}

function IndexHistoryChart({ indexKey }: { indexKey: string }) {
  const { data } = useQuery({
    queryKey: ['market-ohlc', indexKey],
    queryFn: () => fetchMarketOhlc(indexKey, 120),
    staleTime: 10 * 60 * 1000,
  })

  if (!data || data.bars.length === 0) {
    return <div className="h-40 flex items-center justify-center text-[#5C6480] text-xs">暫無圖表數據</div>
  }

  return <CandleChart bars={data.bars} height={220} showVolume />
}

function IndexCard({ idx }: { idx: MarketAnalysisEntry }) {
  const perf = [
    { label: '1D',  value: idx.change_pct  },
    { label: '5D',  value: idx.change_5d   },
    { label: '20D', value: idx.change_20d  },
    { label: '63D', value: idx.change_63d  },
  ]

  const maRows = [
    { label: 'MA 20',  value: idx.ma20,  pct: idx.pct_from_ma20,  above: idx.above_ma20  },
    { label: 'MA 50',  value: idx.ma50,  pct: idx.pct_from_ma50,  above: idx.above_ma50  },
    { label: 'MA 200', value: idx.ma200, pct: idx.pct_from_ma200, above: idx.above_ma200 },
  ]

  return (
    <div className="bg-[#131720] border border-[#252B3D] space-y-4 p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-[#C8D1E8] font-bold text-xl font-mono">{idx.index_key}</span>
            <span className="text-[#5C6480] text-xs font-mono">{idx.ticker}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[#C8D1E8] text-2xl font-semibold font-mono">{fmtPrice(idx.price)}</span>
            <span className={`text-sm font-semibold font-mono ${pctColor(idx.change_pct)}`}>
              {fmtPct(idx.change_pct)}
            </span>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded font-semibold whitespace-nowrap ${trendColor(idx.trend_state)}`}>
          {idx.trend_state ?? '—'}
        </span>
      </div>

      {idx.market_signal && (
        <p className="text-[#5C6480] text-xs leading-relaxed border-l-2 border-[#252B3D] pl-3">
          {idx.market_signal}
        </p>
      )}

      <IndexHistoryChart indexKey={idx.index_key} />

      <div className="flex gap-4 text-xs text-[#5C6480]">
        <span><span className="text-[#26C6A6]">■</span> 漲</span>
        <span><span className="text-[#EF5465]">■</span> 跌</span>
        <span className="text-[#252B3D]">日線K棒 · 成交量（近120日）</span>
      </div>

      {/* Performance pills */}
      <div className="grid grid-cols-4 gap-1.5">
        {perf.map(({ label, value }) => (
          <div key={label} className="bg-[#1C2030] border border-[#252B3D] rounded px-2 py-2 text-center">
            <div className="text-[#5C6480] text-[10px] font-mono">{label}</div>
            <div className={`text-sm font-semibold mt-0.5 font-mono ${pctColor(value)}`}>{fmtPct(value)}</div>
          </div>
        ))}
      </div>

      {/* MA levels */}
      <div className="space-y-1.5">
        <div className="panel-label">移動平均線</div>
        {maRows.map(({ label, value, pct, above }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-[#5C6480] font-mono text-xs w-14">{label}</span>
            <span className="text-[#C8D1E8] font-mono text-xs">
              {value != null ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
            </span>
            <span className={`text-xs font-mono ${pct != null && pct >= 0 ? 'text-[#26C6A6]' : 'text-[#EF5465]'}`}>
              {pct != null ? fmtPct(pct) : '—'}
            </span>
            {maLabel(above)}
          </div>
        ))}
      </div>

      {/* RSI / Dist Days / 52w */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#1C2030] border border-[#252B3D] rounded p-3 text-center">
          <div className="text-[#5C6480] text-[10px] font-mono uppercase tracking-wider">RSI 14</div>
          <div className={`text-lg font-bold mt-1 font-mono ${rsiColor(idx.rsi14)}`}>
            {idx.rsi14 != null ? idx.rsi14.toFixed(1) : '—'}
          </div>
          <div className="text-[#5C6480] text-[10px] mt-0.5">
            {idx.rsi14 != null && idx.rsi14 >= 70 ? '超買' : idx.rsi14 != null && idx.rsi14 <= 30 ? '超賣' : '中性'}
          </div>
        </div>

        <div className="bg-[#1C2030] border border-[#252B3D] rounded p-3 text-center">
          <div className="text-[#5C6480] text-[10px] font-mono uppercase tracking-wider">派發日</div>
          <div className={`text-lg font-bold mt-1 font-mono ${distDayColor(idx.dist_days)}`}>
            {idx.dist_days ?? '—'}<span className="text-xs text-[#5C6480]">/6</span>
          </div>
          <div className="text-[#5C6480] text-[10px] mt-0.5">
            {(idx.dist_days ?? 0) >= 6 ? '警告' : '正常'}
          </div>
        </div>

        <div className="bg-[#1C2030] border border-[#252B3D] rounded p-3 text-center">
          <div className="text-[#5C6480] text-[10px] font-mono uppercase tracking-wider">距52週高</div>
          <div className={`text-lg font-bold mt-1 font-mono ${pctColor(idx.pct_from_52w_high)}`}>
            {idx.pct_from_52w_high != null ? fmtPct(idx.pct_from_52w_high) : '—'}
          </div>
          <div className="text-[#5C6480] text-[10px] mt-0.5">
            高: {idx.high_52w != null ? idx.high_52w.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—'}
          </div>
        </div>
      </div>

      {/* MACD */}
      {idx.macd_line != null && (
        <div className="flex items-center justify-between text-xs text-[#5C6480] border-t border-[#252B3D] pt-3 font-mono">
          <span>MACD</span>
          <span className={idx.macd_line > 0 ? 'text-[#26C6A6]' : 'text-[#EF5465]'}>
            線: {idx.macd_line.toFixed(2)}
          </span>
          <span className={idx.macd_signal != null && idx.macd_signal > 0 ? 'text-[#26C6A6]' : 'text-[#EF5465]'}>
            信號: {idx.macd_signal?.toFixed(2) ?? '—'}
          </span>
          <span className={idx.macd_hist != null && idx.macd_hist > 0 ? 'text-[#26C6A6]' : 'text-[#EF5465]'}>
            柱: {idx.macd_hist?.toFixed(2) ?? '—'}
          </span>
        </div>
      )}

      {/* Volume */}
      {idx.vol_ratio != null && (
        <div className="flex items-center justify-between text-xs border-t border-[#252B3D] pt-3 font-mono">
          <span className="text-[#5C6480]">成交量 vs 50日均量</span>
          <span className={idx.vol_ratio > 1.5 ? 'text-[#F5A623]' : idx.vol_ratio > 1 ? 'text-[#C8D1E8]' : 'text-[#5C6480]'}>
            {(idx.vol_ratio * 100).toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  )
}

function MarketStatusBanner({ indices }: { indices: MarketAnalysisEntry[] }) {
  const spx = indices.find(i => i.index_key === 'SPX')
  if (!spx) return null

  return (
    <div className={`px-5 py-4 border ${trendColor(spx.trend_state)}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest opacity-70 mb-1 font-mono">市場脈搏 (SPX)</div>
          <div className="text-lg font-bold">{spx.trend_state ?? '未知'}</div>
        </div>
        <div className="text-right text-sm opacity-80 font-mono">
          <div>{spx.dist_days ?? 0} 派發日</div>
          <div>RSI {spx.rsi14 ?? '—'}</div>
        </div>
      </div>
      {spx.market_signal && (
        <p className="text-xs mt-2 opacity-75">{spx.market_signal}</p>
      )}
    </div>
  )
}

export default function MarketPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['market-analysis'],
    queryFn: fetchMarketAnalysis,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#C8D1E8]">大盤分析</h1>
          {data?.date && (
            <p className="text-[#5C6480] text-sm mt-1">NDX · SPX · DJI — {data.date}</p>
          )}
        </div>
        <div className="panel-label">
          MA20 · MA50 · MA200 · RSI · MACD · 派發日
        </div>
      </div>

      {isLoading && (
        <div className="text-[#5C6480] animate-pulse text-sm font-mono">載入大盤數據中...</div>
      )}

      {error && (
        <div className="text-[#EF5465] text-sm bg-[#EF5465]/5 border border-[#EF5465]/20 px-4 py-3">
          載入大盤分析失敗。請確認後端正在運行且已完成數據刷新。
        </div>
      )}

      {data && (
        <>
          <MarketStatusBanner indices={data.indices} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {data.indices.map(idx => (
              <IndexCard key={idx.index_key} idx={idx} />
            ))}
          </div>

          <div className="text-[#5C6480] text-xs text-center pt-2 font-mono">
            派發日定義：價格下跌 ≥0.2% 且成交量高於均量（最近25個交易日）。
            趨勢狀態依 J.Law TTT 2.0 分類 — 根據價格與 MA50/MA200 之關係。
          </div>
        </>
      )}
    </div>
  )
}
