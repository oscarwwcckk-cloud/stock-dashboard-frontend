import { Link } from 'react-router-dom'
import { fmtPct, heatColor } from '../utils/format'

export interface HeatTile {
  ticker: string
  label?: string
  change_pct: number | null
  to?: string
}

interface Props { tiles: HeatTile[] }

export default function Heatmap({ tiles }: Props) {
  const sorted = [...tiles].sort((a, b) => (b.change_pct ?? -999) - (a.change_pct ?? -999))
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1.5">
      {sorted.map(t => {
        const inner = (
          <div
            className="rounded-lg p-3 h-20 flex flex-col justify-center items-center text-center"
            style={{ backgroundColor: heatColor(t.change_pct) }}
          >
            <div className="font-mono font-bold text-white text-sm">{t.ticker}</div>
            <div className="font-mono text-white/90 text-xs mt-0.5">{fmtPct(t.change_pct)}</div>
            {t.label && <div className="text-white/60 text-[10px] truncate max-w-full mt-0.5">{t.label}</div>}
          </div>
        )
        return t.to
          ? <Link key={t.ticker} to={t.to} className="hover:opacity-80 transition-opacity">{inner}</Link>
          : <div key={t.ticker}>{inner}</div>
      })}
    </div>
  )
}
