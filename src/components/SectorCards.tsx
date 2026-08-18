import { Link } from 'react-router-dom'
import type { SectorItem } from '../types'
import { fmtPct, rsColor, pctColor } from '../utils/format'

interface Props { sectors: SectorItem[] }

function rsBarHex(v: number | null): string {
  const n = v ?? 0
  if (n >= 70) return '#089981'
  if (n >= 50) return '#FF9800'
  return '#F23645'
}

export default function SectorCards({ sectors }: Props) {
  const sorted = [...sectors].sort((a, b) => (b.rs_rating ?? -1) - (a.rs_rating ?? -1))

  return (
    <div className="border border-[#2A2E39] divide-y divide-[#2A2E39]">
      {/* Column header */}
      <div className="flex items-center px-4 py-1.5 bg-[#1E222D]">
        <span className="w-8 shrink-0" />
        <span className="flex-1 panel-label">板塊</span>
        <span className="w-14 text-right panel-label shrink-0">RS</span>
        <span className="w-16 text-right panel-label shrink-0 hidden sm:block">1D</span>
        <span className="w-16 text-right panel-label shrink-0">1M</span>
        <span className="w-16 text-right panel-label shrink-0 hidden md:block">3M</span>
      </div>

      {sorted.map((s, i) => {
        const pct = Math.max(0, Math.min(99, s.rs_rating ?? 0))
        const hex = rsBarHex(s.rs_rating)
        return (
          <Link key={s.sector_key} to={`/sector/${s.sector_key}`}
                className="flex items-center px-4 py-2.5 hover:bg-[#252B3D] transition-colors group">
            {/* Rank */}
            <span className="w-8 text-[#787B86] text-xs font-mono shrink-0">
              {i + 1}
            </span>

            {/* Name + RS bar */}
            <div className="flex-1 min-w-0 mr-3">
              <div className="text-[#D1D4DC] text-sm font-medium truncate group-hover:text-white transition-colors">
                {s.sector_name}
              </div>
              <div className="mt-1.5 h-[3px] rounded-full bg-[#2A2E39] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                     style={{ width: `${pct}%`, backgroundColor: hex }} />
              </div>
            </div>

            {/* RS score */}
            <span className={`w-14 text-right font-mono font-bold text-base shrink-0 ${rsColor(s.rs_rating)}`}>
              {s.rs_rating ?? '—'}
            </span>

            {/* 1D */}
            <span className={`w-16 text-right text-xs font-mono shrink-0 hidden sm:block ${pctColor(s.rs_1d)}`}>
              {fmtPct(s.rs_1d)}
            </span>

            {/* 1M */}
            <span className={`w-16 text-right text-xs font-mono shrink-0 ${pctColor(s.rs_20d)}`}>
              {fmtPct(s.rs_20d)}
            </span>

            {/* 3M */}
            <span className={`w-16 text-right text-xs font-mono shrink-0 hidden md:block ${pctColor(s.rs_63d)}`}>
              {fmtPct(s.rs_63d)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
