interface Props {
  rank: number | null
  total: number
  label?: string
}

export default function RankBadge({ rank, total, label = 'sectors' }: Props) {
  if (!rank) return null

  const pct = rank / total
  const color =
    pct <= 0.1 ? 'bg-emerald-500 text-white' :
    pct <= 0.3 ? 'bg-emerald-700 text-emerald-100' :
    pct <= 0.6 ? 'bg-yellow-700 text-yellow-100' :
    'bg-red-800 text-red-100'

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${color}`}>
      #{rank} of {total} {label}
    </span>
  )
}
