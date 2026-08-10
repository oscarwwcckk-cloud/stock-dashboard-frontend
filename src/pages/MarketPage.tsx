import { useQuery } from '@tanstack/react-query'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { fetchMarketAnalysis, fetchMarketHistory } from '../api/market'
import type { MarketAnalysisEntry, MarketHistoryPoint } from '../types'
import { fmtPrice, fmtPct, pctColor } from '../utils/format'

// ── Trend state badge ──────────────────────────────────────────────────────

function trendColor(state: string | null): string {
  if (!state) return 'bg-slate-700 text-slate-300'
  if (state === 'Confirmed Uptrend') return 'bg-emerald-900 text-emerald-300 border border-emerald-700'
  if (state === 'Uptrend Under Pressure') return 'bg-yellow-900 text-yellow-300 border border-yellow-700'
  if (state === 'Recovery Attempt') return 'bg-sky-900 text-sky-300 border border-sky-700'
  if (state === 'Market in Correction') return 'bg-orange-900 text-orange-300 border border-orange-700'
  if (state === 'Bear Market') return 'bg-red-950 text-red-300 border border-red-800'
  return 'bg-slate-700 text-slate-300'
}

function distDayColor(n: number | null): string {
  if (n == null) return 'text-slate-400'
  if (n >= 7) return 'text-red-400 font-bold'
  if (n >= 5) return 'text-orange-400 font-semibold'
  if (n >= 3) return 'text-yellow-400'
  return 'text-emerald-400'
}

function rsiColor(v: number | null): string {
  if (v == null) return 'text-slate-400'
  if (v >= 70) return 'text-red-400'
  if (v >= 60) return 'text-yellow-400'
  if (v >= 40) return 'text-emerald-400'
  if (v >= 30) return 'text-sky-400'
  return 'text-red-500'
}

function maLabel(above: number | null) {
  if (above === 1) return <span className="text-emerald-400 text-xs">▲ above</span>
  if (above === 0) return <span className="text-red-400 text-xs">▼ below</span>
  return <span className="text-slate-500 text-xs">—</span>
}

// ── Spark chart for one index ──────────────────────────────────────────────

function IndexHistoryChart({ indexKey }: { indexKey: string }) {
  const { data } = useQuery({
    queryKey: ['market-history', indexKey],
    queryFn: () => fetchMarketHistory(indexKey, 60),
    staleTime: 10 * 60 * 1000,
  })

  if (!data || data.data.length === 0) {
    return <div className="h-40 flex items-center justify-center text-slate-600 text-xs">No chart data</div>
  }

  const pts: MarketHistoryPoint[] = data.data
  const prices = pts.map(p => p.price).filter(Boolean) as number[]
  const minP = Math.min(...prices) * 0.995
  const maxP = Math.max(...prices) * 1.005

  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={pts} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="date"
          tick={false}
          axisLine={false}
          tickLine={false}
        />
        <YAxis domain={[minP, maxP]} hide />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: '1px solid #334155', fontSize: 11 }}
          labelStyle={{ color: '#94a3b8' }}
          formatter={(value, name) => {
            const v = Number(value)
            const label = name === 'ma20' ? 'MA20' : name === 'ma50' ? 'MA50' : name === 'ma200' ? 'MA200' : 'Price'
            const formatted = name === 'price'
              ? `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : v.toFixed(2)
            return [formatted, label]
          }}
        />
        <Line dataKey="ma200" stroke="#ef4444" strokeWidth={1} dot={false} strokeDasharray="4 2" name="ma200" />
        <Line dataKey="ma50" stroke="#f59e0b" strokeWidth={1} dot={false} strokeDasharray="4 2" name="ma50" />
        <Line dataKey="ma20" stroke="#38bdf8" strokeWidth={1} dot={false} strokeDasharray="4 2" name="ma20" />
        <Line dataKey="price" stroke="#a78bfa" strokeWidth={2} dot={false} name="price" />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── Single index card ──────────────────────────────────────────────────────

function IndexCard({ idx }: { idx: MarketAnalysisEntry }) {
  const perf = [
    { label: '1D', value: idx.change_pct },
    { label: '5D', value: idx.change_5d },
    { label: '20D', value: idx.change_20d },
    { label: '63D', value: idx.change_63d },
  ]

  const maRows = [
    { label: 'MA 20', value: idx.ma20, pct: idx.pct_from_ma20, above: idx.above_ma20 },
    { label: 'MA 50', value: idx.ma50, pct: idx.pct_from_ma50, above: idx.above_ma50 },
    { label: 'MA 200', value: idx.ma200, pct: idx.pct_from_ma200, above: idx.above_ma200 },
  ]

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-white font-bold text-xl">{idx.index_key}</span>
            <span className="text-slate-500 text-xs font-mono">{idx.ticker}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-white text-2xl font-semibold">{fmtPrice(idx.price)}</span>
            <span className={`text-sm font-semibold ${pctColor(idx.change_pct)}`}>
              {fmtPct(idx.change_pct)}
            </span>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-md font-semibold whitespace-nowrap ${trendColor(idx.trend_state)}`}>
          {idx.trend_state ?? '—'}
        </span>
      </div>

      {/* Market signal */}
      {idx.market_signal && (
        <p className="text-slate-400 text-xs leading-relaxed border-l-2 border-slate-600 pl-3">
          {idx.market_signal}
        </p>
      )}

      {/* Price chart */}
      <IndexHistoryChart indexKey={idx.index_key} />

      {/* Legend */}
      <div className="flex gap-4 text-xs text-slate-500">
        <span><span className="text-purple-400">—</span> Price</span>
        <span><span className="text-sky-400">- -</span> MA20</span>
        <span><span className="text-yellow-400">- -</span> MA50</span>
        <span><span className="text-red-400">- -</span> MA200</span>
      </div>

      {/* Performance row */}
      <div className="grid grid-cols-4 gap-2">
        {perf.map(({ label, value }) => (
          <div key={label} className="bg-slate-800 rounded-lg px-2 py-2 text-center">
            <div className="text-slate-500 text-xs">{label}</div>
            <div className={`text-sm font-semibold mt-0.5 ${pctColor(value)}`}>{fmtPct(value)}</div>
          </div>
        ))}
      </div>

      {/* MA levels */}
      <div className="space-y-1.5">
        <div className="text-slate-500 text-xs uppercase tracking-wider">Moving Averages</div>
        {maRows.map(({ label, value, pct, above }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-slate-400 w-14">{label}</span>
            <span className="text-slate-300 font-mono text-xs">
              {value != null ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
            </span>
            <span className={`text-xs ${pct != null && pct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {pct != null ? fmtPct(pct) : '—'}
            </span>
            {maLabel(above)}
          </div>
        ))}
      </div>

      {/* RSI + Dist Days + 52w */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <div className="text-slate-500 text-xs">RSI 14</div>
          <div className={`text-lg font-bold mt-1 ${rsiColor(idx.rsi14)}`}>
            {idx.rsi14 != null ? idx.rsi14.toFixed(1) : '—'}
          </div>
          <div className="text-slate-600 text-xs mt-0.5">
            {idx.rsi14 != null && idx.rsi14 >= 70 ? 'Overbought' : idx.rsi14 != null && idx.rsi14 <= 30 ? 'Oversold' : 'Neutral'}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <div className="text-slate-500 text-xs">Dist Days</div>
          <div className={`text-lg font-bold mt-1 ${distDayColor(idx.dist_days)}`}>
            {idx.dist_days ?? '—'}<span className="text-xs text-slate-600">/6</span>
          </div>
          <div className="text-slate-600 text-xs mt-0.5">
            {(idx.dist_days ?? 0) >= 6 ? 'Warning' : 'OK'}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <div className="text-slate-500 text-xs">From 52w Hi</div>
          <div className={`text-lg font-bold mt-1 ${pctColor(idx.pct_from_52w_high)}`}>
            {idx.pct_from_52w_high != null ? fmtPct(idx.pct_from_52w_high) : '—'}
          </div>
          <div className="text-slate-600 text-xs mt-0.5">
            Hi: {idx.high_52w != null ? idx.high_52w.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—'}
          </div>
        </div>
      </div>

      {/* MACD */}
      {idx.macd_line != null && (
        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-3">
          <span>MACD</span>
          <span className={idx.macd_line > 0 ? 'text-emerald-400' : 'text-red-400'}>
            Line: {idx.macd_line.toFixed(2)}
          </span>
          <span className={idx.macd_signal != null && idx.macd_signal > 0 ? 'text-emerald-400' : 'text-red-400'}>
            Signal: {idx.macd_signal?.toFixed(2) ?? '—'}
          </span>
          <span className={idx.macd_hist != null && idx.macd_hist > 0 ? 'text-emerald-400' : 'text-red-400'}>
            Hist: {idx.macd_hist?.toFixed(2) ?? '—'}
          </span>
        </div>
      )}

      {/* Volume */}
      {idx.vol_ratio != null && (
        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-3">
          <span>Volume vs 50-day Avg</span>
          <span className={idx.vol_ratio > 1.5 ? 'text-yellow-400' : idx.vol_ratio > 1 ? 'text-slate-300' : 'text-slate-500'}>
            {(idx.vol_ratio * 100).toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  )
}

// ── Overall market status banner ───────────────────────────────────────────

function MarketStatusBanner({ indices }: { indices: MarketAnalysisEntry[] }) {
  const spx = indices.find(i => i.index_key === 'SPX')
  if (!spx) return null

  return (
    <div className={`rounded-xl px-5 py-4 ${trendColor(spx.trend_state)}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest opacity-70 mb-1">Market Pulse (SPX)</div>
          <div className="text-lg font-bold">{spx.trend_state ?? 'Unknown'}</div>
        </div>
        <div className="text-right text-sm opacity-80">
          <div>{spx.dist_days ?? 0} distribution days</div>
          <div>RSI {spx.rsi14 ?? '—'}</div>
        </div>
      </div>
      {spx.market_signal && (
        <p className="text-xs mt-2 opacity-75">{spx.market_signal}</p>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

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
          <h1 className="text-2xl font-bold text-white">Market Analysis</h1>
          {data?.date && (
            <p className="text-slate-500 text-sm mt-1">
              NDX · SPX · DJI — {data.date}
            </p>
          )}
        </div>
        <div className="text-slate-600 text-xs">
          MA20 · MA50 · MA200 · RSI · MACD · Distribution Days
        </div>
      </div>

      {isLoading && (
        <div className="text-slate-500 animate-pulse text-sm">Loading market data...</div>
      )}

      {error && (
        <div className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-3">
          Failed to load market analysis. Make sure the backend is running and data has been refreshed.
        </div>
      )}

      {data && (
        <>
          <MarketStatusBanner indices={data.indices} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {data.indices.map(idx => (
              <IndexCard key={idx.index_key} idx={idx} />
            ))}
          </div>

          <div className="text-slate-600 text-xs text-center pt-2">
            Distribution days: price down ≥0.2% on above-average volume (last 25 sessions).
            Trend classified per J.Law TTT 2.0 — price vs MA50/MA200 relationship.
          </div>
        </>
      )}
    </div>
  )
}
