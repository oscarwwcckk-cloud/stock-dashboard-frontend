export const fmtPct = (v: number | null | undefined, decimals = 2): string => {
  if (v == null) return '—'
  const sign = v >= 0 ? '+' : ''
  return `${sign}${v.toFixed(decimals)}%`
}

export const fmtPrice = (v: number | null | undefined): string => {
  if (v == null) return '—'
  return `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Futu × TV colour tokens
export const pctColor = (v: number | null | undefined): string => {
  if (v == null) return 'text-[#5C6480]'
  if (v > 2)  return 'text-[#26C6A6] font-semibold'
  if (v > 0)  return 'text-[#26C6A6]'
  if (v < -2) return 'text-[#EF5465] font-semibold'
  if (v < 0)  return 'text-[#EF5465]'
  return 'text-[#5C6480]'
}

// RS score: TV teal (high) → Futu orange (mid) → TV red (low)
export const rsColor = (v: number | null | undefined): string => {
  if (v == null) return 'text-[#5C6480]'
  if (v >= 90) return 'text-[#26C6A6] font-bold'
  if (v >= 70) return 'text-[#26C6A6]'
  if (v >= 50) return 'text-[#F5A623]'
  return 'text-[#EF5465]'
}

// Finviz-style heatmap tile background
export const heatColor = (v: number | null | undefined): string => {
  if (v == null) return 'hsl(222, 18%, 16%)'
  const mag  = Math.min(Math.abs(v), 3) / 3
  const hue  = v >= 0 ? 166 : 0       // TV teal-green / TV red hue
  const sat  = 20 + mag * 55
  const light = 18 + mag * 18
  return `hsl(${hue}, ${sat}%, ${light}%)`
}

// Inline excess-return chip backgrounds
export const excessBg = (v: number | null | undefined): string => {
  if (v == null) return 'bg-[#1C2030] text-[#5C6480]'
  if (v >  5) return 'bg-[#26C6A6]/15 text-[#26C6A6] font-semibold'
  if (v >  0) return 'bg-[#26C6A6]/8  text-[#26C6A6]'
  if (v < -5) return 'bg-[#EF5465]/15 text-[#EF5465] font-semibold'
  if (v <  0) return 'bg-[#EF5465]/8  text-[#EF5465]'
  return 'bg-[#1C2030] text-[#5C6480]'
}
