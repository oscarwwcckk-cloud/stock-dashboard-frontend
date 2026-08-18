import { useQuery } from '@tanstack/react-query'
import { fetchMarketAnalysis, fetchMarketOhlc, fetchMarketBreadth } from '../api/market'
import type { MarketAnalysisEntry, BreadthMetric } from '../types'
import { fmtPrice, fmtPct, pctColor } from '../utils/format'
import CandleChart from '../components/CandleChart'

// ── Color helpers ─────────────────────────────────────────────────────────────

function trendBadge(state: string | null): string {
  if (!state)                              return 'bg-[#252B3D] text-[#787B86] border border-[#2A2E39]'
  if (state === 'Confirmed Uptrend')       return 'bg-[#089981]/10 text-[#089981] border border-[#089981]/25'
  if (state === 'Uptrend Under Pressure')  return 'bg-[#FF9800]/10 text-[#FF9800] border border-[#FF9800]/25'
  if (state === 'Recovery Attempt')        return 'bg-[#2962FF]/10 text-[#2962FF] border border-[#2962FF]/25'
  if (state === 'Market in Correction')    return 'bg-[#F23645]/10 text-[#F23645] border border-[#F23645]/25'
  if (state === 'Bear Market')             return 'bg-[#F23645]/15 text-[#F23645] border border-[#F23645]/35'
  return 'bg-[#252B3D] text-[#787B86] border border-[#2A2E39]'
}

function trendBanner(state: string | null): string {
  if (!state)                              return 'border-[#2A2E39] bg-[#1E222D]'
  if (state === 'Confirmed Uptrend')       return 'border-[#089981]/30 bg-[#089981]/5'
  if (state === 'Uptrend Under Pressure')  return 'border-[#FF9800]/30 bg-[#FF9800]/5'
  if (state === 'Recovery Attempt')        return 'border-[#2962FF]/30 bg-[#2962FF]/5'
  if (state === 'Market in Correction')    return 'border-[#F23645]/30 bg-[#F23645]/5'
  if (state === 'Bear Market')             return 'border-[#F23645]/40 bg-[#F23645]/8'
  return 'border-[#2A2E39] bg-[#1E222D]'
}

function trendTextColor(state: string | null): string {
  if (!state)                              return 'text-[#787B86]'
  if (state === 'Confirmed Uptrend')       return 'text-[#089981]'
  if (state === 'Uptrend Under Pressure')  return 'text-[#FF9800]'
  if (state === 'Recovery Attempt')        return 'text-[#2962FF]'
  if (state === 'Market in Correction')    return 'text-[#F23645]'
  if (state === 'Bear Market')             return 'text-[#F23645]'
  return 'text-[#787B86]'
}

function distDayColor(n: number | null): string {
  if (n == null) return 'text-[#787B86]'
  if (n >= 7)    return 'text-[#F23645] font-bold'
  if (n >= 5)    return 'text-[#FF9800] font-semibold'
  if (n >= 3)    return 'text-[#FF9800]'
  return 'text-[#089981]'
}

function rsiColor(v: number | null): string {
  if (v == null) return 'text-[#787B86]'
  if (v >= 70)   return 'text-[#F23645]'
  if (v >= 60)   return 'text-[#FF9800]'
  if (v >= 40)   return 'text-[#089981]'
  if (v >= 30)   return 'text-[#2962FF]'
  return 'text-[#F23645]'
}

function maArrow(above: number | null) {
  if (above === 1) return <span className="text-[#089981] text-[11px] font-mono">▲</span>
  if (above === 0) return <span className="text-[#F23645] text-[11px] font-mono">▼</span>
  return <span className="text-[#787B86] text-[11px]">—</span>
}

// ── Market Breadth Bar ────────────────────────────────────────────────────────

function BreadthBlock({
  leftLabel, left, rightLabel, right,
}: {
  leftLabel: string
  left: BreadthMetric
  rightLabel: string
  right: BreadthMetric
}) {
  const leftPct  = left.pct  ?? 0
  const rightPct = right.pct ?? 0
  const total    = leftPct + rightPct || 100

  return (
    <div className="bg-[#1E222D] border border-[#2A2E39] rounded-lg p-4 flex-1 min-w-[170px]">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] font-semibold text-[#089981] uppercase tracking-wide">{leftLabel}</span>
        <span className="text-[11px] font-semibold text-[#F23645] uppercase tracking-wide">{rightLabel}</span>
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-[#089981] text-base font-semibold font-mono tabular-nums leading-none">
            {left.pct != null ? `${left.pct.toFixed(1)}%` : '—'}
          </div>
          {left.count != null && (
            <div className="text-[#787B86] text-[11px] font-mono tabular-nums mt-0.5">
              {left.count.toLocaleString()} 支
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-[#F23645] text-base font-semibold font-mono tabular-nums leading-none">
            {right.pct != null ? `${right.pct.toFixed(1)}%` : '—'}
          </div>
          {right.count != null && (
            <div className="text-[#787B86] text-[11px] font-mono tabular-nums mt-0.5">
              {right.count.toLocaleString()} 支
            </div>
          )}
        </div>
      </div>

      {/* Segmented bar */}
      <div className="h-1 rounded-full overflow-hidden flex gap-px bg-[#252B3D]">
        <div className="bg-[#089981] h-full rounded-l-full transition-all"
             style={{ width: `${(leftPct / total) * 100}%` }} />
        <div className="bg-[#F23645] h-full rounded-r-full transition-all"
             style={{ width: `${(rightPct / total) * 100}%` }} />
      </div>
    </div>
  )
}

function MarketBreadthBar() {
  const { data, isLoading } = useQuery({
    queryKey: ['market-breadth'],
    queryFn: fetchMarketBreadth,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  })

  return (
    <div className="bg-[#1E222D] border border-[#2A2E39] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="panel-label">市場廣度</span>
          <span className="text-[#2A2E39] text-xs select-none">|</span>
          <span className="text-[#787B86] text-[11px]">NYSE + Nasdaq + AMEX</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#787B86] text-[11px]">來源 Finviz</span>
          {isLoading && (
            <span className="text-[#787B86] text-[11px] animate-pulse">載入中...</span>
          )}
          {data?.fetched_at && !isLoading && (
            <span className="text-[#787B86] text-[11px] font-mono tabular-nums">
              {new Date(data.fetched_at).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {data ? (
          <>
            <BreadthBlock leftLabel="上漲 Adv" left={data.advancing}   rightLabel="下跌 Dec" right={data.declining}  />
            <BreadthBlock leftLabel="新高 NH"  left={data.new_high}    rightLabel="新低 NL"  right={data.new_low}    />
            <BreadthBlock leftLabel="SMA50 上方" left={data.above_sma50} rightLabel="SMA50 下方" right={data.below_sma50} />
            <BreadthBlock leftLabel="SMA200 上方" left={data.above_sma200} rightLabel="SMA200 下方" right={data.below_sma200} />
          </>
        ) : !isLoading ? (
          <span className="text-[#787B86] text-[11px] font-mono">廣度數據暫不可用</span>
        ) : null}
      </div>
    </div>
  )
}

// ── Index Chart ───────────────────────────────────────────────────────────────

function IndexHistoryChart({ indexKey }: { indexKey: string }) {
  const { data } = useQuery({
    queryKey: ['market-ohlc', indexKey],
    queryFn: () => fetchMarketOhlc(indexKey, 120),
    staleTime: 10 * 60 * 1000,
  })

  if (!data || data.bars.length === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center text-[#787B86] text-[12px]">
        暫無圖表數據
      </div>
    )
  }

  return <CandleChart bars={data.bars} height={200} showVolume />
}

// ── Index Card ────────────────────────────────────────────────────────────────

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
    <div className="bg-[#1E222D] border border-[#2A2E39] rounded-lg overflow-hidden">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-[#D1D4DC] font-bold text-[15px] tracking-wide">{idx.index_key}</span>
            <span className="text-[#787B86] text-[11px] font-mono">{idx.ticker}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[#D1D4DC] text-[22px] font-semibold font-mono tabular-nums">
              {fmtPrice(idx.price)}
            </span>
            <span className={`text-[13px] font-semibold font-mono tabular-nums ${pctColor(idx.change_pct)}`}>
              {fmtPct(idx.change_pct)}
            </span>
          </div>
        </div>
        <span className={`text-[11px] px-2 py-1 rounded font-semibold whitespace-nowrap mt-0.5 ${trendBadge(idx.trend_state)}`}>
          {idx.trend_state ?? '—'}
        </span>
      </div>

      {/* Signal text */}
      {idx.market_signal && (
        <div className="px-4 pb-3">
          <p className="text-[#787B86] text-[11px] leading-relaxed border-l-2 border-[#2A2E39] pl-3">
            {idx.market_signal}
          </p>
        </div>
      )}

      {/* K-line chart */}
      <div className="px-2">
        <IndexHistoryChart indexKey={idx.index_key} />
      </div>

      {/* Chart legend */}
      <div className="flex items-center gap-3 px-4 pt-1 pb-3 text-[11px] text-[#787B86]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#089981] inline-block" />漲</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#F23645] inline-block" />跌</span>
        <span className="text-[#2A2E39]">日線 · 近120日</span>
      </div>

      {/* ── Performance pills ── */}
      <div className="px-4 pb-4 grid grid-cols-4 gap-2">
        {perf.map(({ label, value }) => (
          <div key={label} className="bg-[#252B3D] rounded-md px-2 py-2 text-center">
            <div className="text-[#787B86] text-[10px] font-mono uppercase">{label}</div>
            <div className={`text-[13px] font-semibold mt-0.5 font-mono tabular-nums ${pctColor(value)}`}>
              {fmtPct(value)}
            </div>
          </div>
        ))}
      </div>

      {/* ── MA Table ── */}
      <div className="px-4 pb-4">
        <div className="panel-label mb-2">移動平均線</div>
        <div className="bg-[#131722] rounded-md overflow-hidden border border-[#2A2E39]">
          {maRows.map(({ label, value, pct, above }, i) => (
            <div key={label}
                 className={`flex items-center justify-between px-3 py-[7px] text-[12px] gap-2
                   ${i < maRows.length - 1 ? 'border-b border-[#2A2E39]' : ''}`}>
              <span className="text-[#787B86] font-mono w-[46px] shrink-0">{label}</span>
              <span className="text-[#D1D4DC] font-mono tabular-nums flex-1 text-right">
                {value != null
                  ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : '—'}
              </span>
              <span className={`font-mono tabular-nums w-[52px] text-right shrink-0 ${
                pct != null && pct >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
              }`}>
                {pct != null ? fmtPct(pct) : '—'}
              </span>
              <span className="w-[38px] flex justify-end shrink-0">{maArrow(above)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats grid: RSI / Dist / 52w ── */}
      <div className="px-4 pb-4 grid grid-cols-3 gap-2">
        <div className="bg-[#131722] border border-[#2A2E39] rounded-md p-3 text-center">
          <div className="text-[#787B86] text-[10px] font-mono uppercase tracking-wide">RSI 14</div>
          <div className={`text-[18px] font-bold mt-1 font-mono tabular-nums ${rsiColor(idx.rsi14)}`}>
            {idx.rsi14 != null ? idx.rsi14.toFixed(1) : '—'}
          </div>
          <div className="text-[#787B86] text-[10px] mt-0.5">
            {idx.rsi14 == null ? '—' : idx.rsi14 >= 70 ? '超買' : idx.rsi14 <= 30 ? '超賣' : '中性'}
          </div>
        </div>

        <div className="bg-[#131722] border border-[#2A2E39] rounded-md p-3 text-center">
          <div className="text-[#787B86] text-[10px] font-mono uppercase tracking-wide">派發日</div>
          <div className={`text-[18px] font-bold mt-1 font-mono tabular-nums ${distDayColor(idx.dist_days)}`}>
            {idx.dist_days ?? '—'}
            <span className="text-[11px] text-[#787B86]">/6</span>
          </div>
          <div className="text-[#787B86] text-[10px] mt-0.5">
            {(idx.dist_days ?? 0) >= 6 ? '⚠ 警告' : '正常'}
          </div>
        </div>

        <div className="bg-[#131722] border border-[#2A2E39] rounded-md p-3 text-center">
          <div className="text-[#787B86] text-[10px] font-mono uppercase tracking-wide">距52週高</div>
          <div className={`text-[18px] font-bold mt-1 font-mono tabular-nums ${pctColor(idx.pct_from_52w_high)}`}>
            {idx.pct_from_52w_high != null ? fmtPct(idx.pct_from_52w_high) : '—'}
          </div>
          <div className="text-[#787B86] text-[10px] mt-0.5 tabular-nums font-mono">
            高 {idx.high_52w != null
              ? idx.high_52w.toLocaleString('en-US', { maximumFractionDigits: 0 })
              : '—'}
          </div>
        </div>
      </div>

      {/* ── MACD row ── */}
      {idx.macd_line != null && (
        <div className="mx-4 mb-4 flex items-center justify-between text-[11px] font-mono tabular-nums
                        bg-[#131722] border border-[#2A2E39] rounded-md px-3 py-2 gap-2">
          <span className="text-[#787B86]">MACD</span>
          <span className={idx.macd_line > 0 ? 'text-[#089981]' : 'text-[#F23645]'}>
            {idx.macd_line.toFixed(2)}
          </span>
          <span className="text-[#787B86]">信號</span>
          <span className={
            idx.macd_signal != null && idx.macd_signal > 0 ? 'text-[#089981]' : 'text-[#F23645]'
          }>
            {idx.macd_signal?.toFixed(2) ?? '—'}
          </span>
          <span className="text-[#787B86]">柱</span>
          <span className={
            idx.macd_hist != null && idx.macd_hist > 0 ? 'text-[#089981]' : 'text-[#F23645]'
          }>
            {idx.macd_hist?.toFixed(2) ?? '—'}
          </span>
        </div>
      )}

      {/* ── Volume row ── */}
      {idx.vol_ratio != null && (
        <div className="mx-4 mb-4 flex items-center justify-between text-[11px] font-mono tabular-nums
                        bg-[#131722] border border-[#2A2E39] rounded-md px-3 py-2">
          <span className="text-[#787B86]">成交量 vs 50日均量</span>
          <span className={
            idx.vol_ratio > 1.5 ? 'text-[#FF9800]' :
            idx.vol_ratio > 1   ? 'text-[#D1D4DC]' :
                                  'text-[#787B86]'
          }>
            {(idx.vol_ratio * 100).toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  )
}

// ── Status Banner ─────────────────────────────────────────────────────────────

function MarketStatusBanner({ indices }: { indices: MarketAnalysisEntry[] }) {
  const spx = indices.find(i => i.index_key === 'SPX')
  if (!spx) return null

  return (
    <div className={`rounded-lg border px-5 py-4 ${trendBanner(spx.trend_state)}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.1em] text-[#787B86] mb-1.5">市場脈搏 · SPX</div>
          <div className={`text-[17px] font-bold ${trendTextColor(spx.trend_state)}`}>
            {spx.trend_state ?? '未知'}
          </div>
        </div>
        <div className="text-right font-mono tabular-nums text-[12px]">
          <div className={distDayColor(spx.dist_days)}>
            {spx.dist_days ?? 0} 派發日
          </div>
          <div className={`mt-0.5 ${rsiColor(spx.rsi14)}`}>
            RSI {spx.rsi14?.toFixed(1) ?? '—'}
          </div>
        </div>
      </div>
      {spx.market_signal && (
        <p className="text-[11px] mt-2.5 text-[#787B86] leading-relaxed">{spx.market_signal}</p>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MarketPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['market-analysis'],
    queryFn: fetchMarketAnalysis,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-5 space-y-4">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-[#D1D4DC] tracking-tight">大盤分析</h1>
          {data?.date && (
            <p className="text-[#787B86] text-[12px] mt-0.5 font-mono">
              SPX · NDX · DJI &nbsp;·&nbsp; {data.date}
            </p>
          )}
        </div>
        <div className="panel-label hidden sm:block">
          MA20 · MA50 · MA200 · RSI · MACD · 派發日
        </div>
      </div>

      {isLoading && (
        <div className="text-[#787B86] animate-pulse text-[12px] font-mono py-8 text-center">
          載入大盤數據中...
        </div>
      )}

      {error && (
        <div className="text-[#F23645] text-[12px] bg-[#F23645]/5 border border-[#F23645]/20 rounded-lg px-4 py-3">
          載入大盤分析失敗。請確認後端正在運行且已完成數據刷新。
        </div>
      )}

      {data && (
        <>
          <MarketStatusBanner indices={data.indices} />
          <MarketBreadthBar />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {data.indices.map(idx => (
              <IndexCard key={idx.index_key} idx={idx} />
            ))}
          </div>

          <p className="text-[#787B86] text-[11px] text-center pt-1 font-mono leading-relaxed">
            派發日：價格跌 ≥0.2% 且成交量高於均量（近25交易日）。
            趨勢分類依 J.Law TTT 2.0 — 價格 vs MA50/MA200。
          </p>
        </>
      )}
    </div>
  )
}
