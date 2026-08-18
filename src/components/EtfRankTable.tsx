import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { EtfItem } from '../types'
import { fmtPct, fmtPrice, pctColor, rsColor } from '../utils/format'

type SortKey = 'rs_rating' | 'change_pct' | 'change_5d' | 'change_20d' | 'rs_rank'

interface Props { etfs: EtfItem[] }

export default function EtfRankTable({ etfs }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('rs_rating')

  const sorted = [...etfs].sort((a, b) =>
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
            <th className="px-4 py-2.5 text-left text-[10px] font-bold tracking-widest uppercase text-[#787B86]">ETF</th>
            <th className="px-3 py-2.5 text-right text-[10px] font-bold tracking-widest uppercase text-[#787B86]">股價</th>
            {col('rs_rating', 'RS')}
            {col('change_pct', '1D')}
            {col('change_5d', '5D')}
            {col('change_20d', '1M')}
            <th className="px-3 py-2.5 text-right text-[10px] font-bold tracking-widest uppercase text-[#787B86]">成分</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(e => (
            <tr key={e.etf_ticker}
                className="border-t border-[#2A2E39] hover:bg-[#252B3D] transition-colors">
              <td className="px-4 py-2.5 text-[#787B86] font-mono text-xs">{e.rs_rank ?? '—'}</td>
              <td className="px-4 py-2.5">
                <Link to={`/etf/${e.etf_ticker}`}
                      className="font-bold text-[#D1D4DC] hover:text-[#2962FF] font-mono transition-colors">
                  {e.etf_ticker}
                </Link>
                <div className="text-[#787B86] text-xs truncate max-w-56">{e.name}</div>
              </td>
              <td className="px-3 py-2.5 text-right font-mono text-[#D1D4DC] text-sm">{fmtPrice(e.price)}</td>
              <td className={`px-3 py-2.5 text-right font-mono font-bold text-sm ${rsColor(e.rs_rating)}`}>{e.rs_rating ?? '—'}</td>
              <td className={`px-3 py-2.5 text-right font-mono text-xs ${pctColor(e.change_pct)}`}>{fmtPct(e.change_pct)}</td>
              <td className={`px-3 py-2.5 text-right font-mono text-xs ${pctColor(e.change_5d)}`}>{fmtPct(e.change_5d)}</td>
              <td className={`px-3 py-2.5 text-right font-mono text-xs ${pctColor(e.change_20d)}`}>{fmtPct(e.change_20d)}</td>
              <td className="px-3 py-2.5 text-right text-[#787B86] text-xs font-mono">{e.constituent_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
