interface Props {
  rank: number | null
  total: number
  label?: string
}

export default function RankBadge({ rank, total, label = 'sectors' }: Props) {
  if (!rank) return null

  const pct = rank / total
  const cls =
    pct <= 0.1 ? 'text-[#089981] bg-[#089981]/10 border-[#089981]/25'
    : pct <= 0.3 ? 'text-[#089981] bg-[#089981]/8  border-[#089981]/15'
    : pct <= 0.6 ? 'text-[#FF9800] bg-[#FF9800]/8  border-[#FF9800]/20'
    : 'text-[#F23645] bg-[#F23645]/8  border-[#F23645]/20'

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono font-semibold ${cls}`}>
      #{rank} / {total} {label}
    </span>
  )
}
