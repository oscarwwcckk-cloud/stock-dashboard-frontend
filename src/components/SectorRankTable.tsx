import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { SectorItem } from '../types'
import { fmtPct, excessBg, rsColor } from '../utils/format'

type SortKey = 'rs_rating' | 'rs_1d' | 'rs_5d' | 'rs_20d' | 'rs_63d' | 'rs_rank'

interface Props { sectors: SectorItem[] }

export default function SectorRankTable({ sectors }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('rs_rating')

  const sorted = [...sectors].sort((a, b) =>
    sortKey === 'rs_rank'
      ? (a.rs_rank ?? 999) - (b.rs_rank ?? 999)
      : (b[sortKey] ?? -999) - (a[sortKey] ?? -999)
  )

  const col = (key: SortKey, label: string) => (
    <th
      className={`px-3 py-2.5 text-right cursor-pointer select-none text-[10px] font-bold tracking-widest uppercase transition-colors
        ${sortKey === key ? 'text-[#2962FF]' : 'text-[#787B86] hover:text-[#D1D4DC]'}`}
      onClick={() => setSortKey(key)}
    >
      {label}{sortKey === key ? ' ▾' : ''}
    </th>
  )

  return (
    <div className="overflow-x-auto border border-[#2A2E39]">
      <table className="w-full text-sm">
        <thead className="bg-[#1E222D]">
          <tr>
            <th className="px-4 py-2.5 text-left text-[10px] font-bold tracking-widest uppercase text-[#787B86]">#</th>
            <th className="px-4 py-2.5 text-left text-[10px] font-bold tracking-widest uppercase text-[#787B86]">板塊</th>
            <th className="px-3 py-2.5 text-center text-[10px] font-bold tracking-widest uppercase text-[#787B86]">基準</th>
            {col('rs_rating', 'RS')}
            {col('rs_1d',     '1D')}
            {col('rs_5d',     '5D')}
            {col('rs_20d',    '1M')}
            {col('rs_63d',    '3M')}
            <th className="px-3 py-2.5 text-right text-[10px] font-bold tracking-widest uppercase text-[#787B86]">持股</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, i) => (
            <tr key={s.sector_key}
                className="border-t border-[#2A2E39] hover:bg-[#252B3D] transition-colors">
              <td className="px-4 py-2 text-[#787B86] font-mono text-xs">{i + 1}</td>
              <td className="px-4 py-2">
                <Link to={`/sector/${s.sector_key}`}
                      className="text-[#D1D4DC] hover:text-[#2962FF] font-medium transition-colors">
                  {s.sector_name}
                </Link>
              </td>
              <td className="px-3 py-2 text-center">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-[#2962FF]/10 text-[#2962FF] border border-[#2962FF]/20">
                  {s.benchmark}
                </span>
              </td>
              <td className={`px-3 py-2 text-right font-mono font-bold ${rsColor(s.rs_rating)}`}>{s.rs_rating ?? '—'}</td>
              <td className={`px-3 py-2 text-right text-xs font-mono ${excessBg(s.rs_1d)}`}>{fmtPct(s.rs_1d)}</td>
              <td className={`px-3 py-2 text-right text-xs font-mono ${excessBg(s.rs_5d)}`}>{fmtPct(s.rs_5d)}</td>
              <td className={`px-3 py-2 text-right text-xs font-mono ${excessBg(s.rs_20d)}`}>{fmtPct(s.rs_20d)}</td>
              <td className={`px-3 py-2 text-right text-xs font-mono ${excessBg(s.rs_63d)}`}>{fmtPct(s.rs_63d)}</td>
              <td className="px-3 py-2 text-right text-[#787B86] text-xs font-mono">{s.constituent_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
