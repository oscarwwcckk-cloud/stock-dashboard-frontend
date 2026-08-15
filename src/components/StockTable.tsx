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
      className={`px-3 py-2.5 text-right cursor-pointer select-none text-[10px] font-bold tracking-widest uppercase transition-colors
        ${sort === key ? 'text-[#4E8AFF]' : 'text-[#5C6480] hover:text-[#C8D1E8]'}`}
      onClick={() => setSort(key)}
    >
      {label}{sort === key ? ' ▾' : ''}
    </th>
  )

  return (
    <div className="overflow-x-auto border border-[#252B3D]">
      <table className="w-full text-sm">
        <thead className="bg-[#131720]">
          <tr>
            <th className="px-4 py-2.5 text-left text-[10px] font-bold tracking-widest uppercase text-[#5C6480]">#</th>
            <th className="px-4 py-2.5 text-left text-[10px] font-bold tracking-widest uppercase text-[#5C6480]">代碼</th>
            <th className="px-4 py-2.5 text-left text-[10px] font-bold tracking-widest uppercase text-[#5C6480]">行業</th>
            <th className="px-3 py-2.5 text-right text-[10px] font-bold tracking-widest uppercase text-[#5C6480]">股價</th>
            {col('change_pct', '1D')}
            {col('rs_score', 'RS')}
            {col('rs_vs_benchmark', 'vs基準')}
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, i) => (
            <tr key={s.ticker}
                className="border-t border-[#252B3D] hover:bg-[#1C2030] transition-colors">
              <td className="px-4 py-2 text-[#5C6480] font-mono text-xs">{i + 1}</td>
              <td className="px-4 py-2">
                <Link to={`/stock/${s.ticker}`}
                      className="font-bold text-[#C8D1E8] hover:text-[#4E8AFF] font-mono transition-colors">
                  {s.ticker}
                </Link>
                <div className="text-[#5C6480] text-xs truncate max-w-32">{s.name}</div>
              </td>
              <td className="px-4 py-2 text-[#5C6480] text-xs">{s.industry || '—'}</td>
              <td className="px-3 py-2 text-right font-mono text-[#C8D1E8] text-sm">{fmtPrice(s.price)}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctColor(s.change_pct)}`}>{fmtPct(s.change_pct)}</td>
              <td className={`px-3 py-2 text-right font-mono font-bold text-sm ${rsColor(s.rs_score)}`}>{s.rs_score ?? '—'}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctColor(s.rs_vs_benchmark)}`}>{fmtPct(s.rs_vs_benchmark)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
