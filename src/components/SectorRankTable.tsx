import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { SectorItem } from '../types'
import { fmtPct, excessBg } from '../utils/format'

type SortKey = 'rs_score' | 'rs_1d' | 'rs_5d' | 'rs_20d' | 'rs_63d' | 'rs_rank'

interface Props { sectors: SectorItem[] }

export default function SectorRankTable({ sectors }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('rs_score')

  const sorted = [...sectors].sort((a, b) => {
    if (sortKey === 'rs_rank') {
      return (a.rs_rank ?? 999) - (b.rs_rank ?? 999)
    }
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
            <th className="px-4 py-3 text-left">Sector</th>
            <th className="px-3 py-3 text-center text-slate-500">Bench</th>
            {col('rs_score', 'RS Score')}
            {col('rs_1d',    '1D vs Bench')}
            {col('rs_5d',    '5D vs Bench')}
            {col('rs_20d',   '1M vs Bench')}
            {col('rs_63d',   '3M vs Bench')}
            <th className="px-3 py-3 text-right text-slate-500">Stocks</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, i) => (
            <tr key={s.sector_key} className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors">
              <td className="px-4 py-3 text-slate-400 font-mono">{i + 1}</td>
              <td className="px-4 py-3">
                <Link to={`/sector/${s.sector_key}`} className="text-white hover:text-blue-400 font-medium">
                  {s.sector_name}
                </Link>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={`text-xs px-2 py-0.5 rounded font-mono ${s.benchmark === 'QQQ' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
                  {s.benchmark}
                </span>
              </td>
              <td className={`px-3 py-3 text-right rounded font-mono text-xs ${excessBg(s.rs_score)}`}>{fmtPct(s.rs_score)}</td>
              <td className={`px-3 py-3 text-right text-xs ${excessBg(s.rs_1d)}`}>{fmtPct(s.rs_1d)}</td>
              <td className={`px-3 py-3 text-right text-xs ${excessBg(s.rs_5d)}`}>{fmtPct(s.rs_5d)}</td>
              <td className={`px-3 py-3 text-right text-xs ${excessBg(s.rs_20d)}`}>{fmtPct(s.rs_20d)}</td>
              <td className={`px-3 py-3 text-right text-xs ${excessBg(s.rs_63d)}`}>{fmtPct(s.rs_63d)}</td>
              <td className="px-3 py-3 text-right text-slate-500">{s.constituent_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
