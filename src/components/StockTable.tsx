import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { StockInSector } from '../types'
import { fmtPrice, fmtPct, pctColor, rsColor } from '../utils/format'

interface Props { stocks: StockInSector[] }

export default function StockTable({ stocks }: Props) {
  const [sort, setSort] = useState<'rs_score' | 'change_pct' | 'rs_vs_benchmark'>('rs_score')

  const sorted = [...stocks].sort((a, b) => (b[sort] ?? -999) - (a[sort] ?? -999))

  const col = (key: typeof sort, label: string) => (
    <th
      className={`px-3 py-3 text-right cursor-pointer hover:text-blue-400 select-none text-xs ${sort === key ? 'text-blue-400' : 'text-slate-400'}`}
      onClick={() => setSort(key)}
    >
      {label} {sort === key ? '↓' : ''}
    </th>
  )

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Rank</th>
            <th className="px-4 py-3 text-left">Ticker</th>
            <th className="px-4 py-3 text-left text-slate-500">Industry</th>
            <th className="px-3 py-3 text-right text-slate-400">Price</th>
            {col('change_pct', '1D')}
            {col('rs_score', 'RS Score')}
            {col('rs_vs_benchmark', 'vs Bench')}
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, i) => (
            <tr key={s.ticker} className="border-t border-slate-800 hover:bg-slate-800/50">
              <td className="px-4 py-2 text-slate-500 font-mono text-xs">{i + 1}</td>
              <td className="px-4 py-2">
                <Link to={`/stock/${s.ticker}`} className="font-bold text-white hover:text-blue-400 font-mono">{s.ticker}</Link>
                <div className="text-slate-500 text-xs truncate max-w-32">{s.name}</div>
              </td>
              <td className="px-4 py-2 text-slate-500 text-xs">{s.industry || '—'}</td>
              <td className="px-3 py-2 text-right font-mono text-slate-300">{fmtPrice(s.price)}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctColor(s.change_pct)}`}>{fmtPct(s.change_pct)}</td>
              <td className={`px-3 py-2 text-right font-mono font-bold text-xs ${rsColor(s.rs_score)}`}>{s.rs_score ?? '—'}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctColor(s.rs_vs_benchmark)}`}>{fmtPct(s.rs_vs_benchmark)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
