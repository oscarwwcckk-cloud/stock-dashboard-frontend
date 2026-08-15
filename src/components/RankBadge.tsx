interface Props {
  rank: number | null
  total: number
  label?: string
}

export default function RankBadge({ rank, total, label = 'sectors' }: Props) {
  if (!rank) return null

  const pct = rank / total
  const cls =
    pct <= 0.1 ? 'text-[#26C6A6] bg-[#26C6A6]/10 border-[#26C6A6]/25'
    : pct <= 0.3 ? 'text-[#26C6A6] bg-[#26C6A6]/8  border-[#26C6A6]/15'
    : pct <= 0.6 ? 'text-[#F5A623] bg-[#F5A623]/8  border-[#F5A623]/20'
    : 'text-[#EF5465] bg-[#EF5465]/8  border-[#EF5465]/20'

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono font-semibold ${cls}`}>
      #{rank} / {total} {label}
    </span>
  )
}
