import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { EtfItem } from '../types'
import { fmtPct, fmtPrice, pctColor, rsColor } from '../utils/format'

type SortKey = 'rs_rating' | 'change_pct' | 'change_5d' | 'change_20d' | 'rs_rank'

interface Props { etfs: EtfItem[] }

export default function EtfRankTable({ etfs }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('rs_rating')

  const sorted = [...etfs].sort((a, b) => {
    if (sortKey === 'rs_rank') return (a.rs_rank ?? 999) - (b.rs_rank ?? 999)
    return (b[sortKey] ?? -999) - (a[sortKey] ?? -999)
  })

  const col = (key: SortKey, label: string) => (
    <th
      className={`px-3 py-3 text-right cursor-pointer hover:text-blue-400 select-none ${sortKey === key ? 'text-blue-400' : 'text-slate-400'}`}
      onClick={() => setSortKey(key)}
    >
      {label} {sortKey === key ? '↓' : ''}
    </th>
  )

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Rank</th>
            <th className="px-4 py-3 text-left">ETF</th>
            <th className="px-3 py-3 text-right text-slate-400">Price</th>
            {col('rs_rating', 'RS Rating')}
            {col('change_pct', '1D')}
            {col('change_5d', '5D')}
            {col('change_20d', '1M')}
            <th className="px-3 py-3 text-right text-slate-500">Stocks</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(e => (
            <tr key={e.etf_ticker} className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors">
              <td className="px-4 py-3 text-slate-400 font-mono">{e.rs_rank ?? '—'}</td>
              <td className="px-4 py-3">
                <Link to={`/etf/${e.etf_ticker}`} className="font-bold text-white hover:text-blue-400 font-mono">{e.etf_ticker}</Link>
                <div className="text-slate-500 text-xs truncate max-w-56">{e.name}</div>
              </td>
              <td className="px-3 py-3 text-right font-mono text-slate-300">{fmtPrice(e.price)}</td>
              <td className={`px-3 py-3 text-right font-mono font-bold ${rsColor(e.rs_rating)}`}>{e.rs_rating ?? '—'}</td>
              <td className={`px-3 py-3 text-right font-mono text-xs ${pctColor(e.change_pct)}`}>{fmtPct(e.change_pct)}</td>
              <td className={`px-3 py-3 text-right font-mono text-xs ${pctColor(e.change_5d)}`}>{fmtPct(e.change_5d)}</td>
              <td className={`px-3 py-3 text-right font-mono text-xs ${pctColor(e.change_20d)}`}>{fmtPct(e.change_20d)}</td>
              <td className="px-3 py-3 text-right text-slate-500">{e.constituent_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
