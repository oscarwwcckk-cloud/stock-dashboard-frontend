export const fmtPct = (v: number | null | undefined, decimals = 2): string => {
  if (v == null) return '—'
  const sign = v >= 0 ? '+' : ''
  return `${sign}${v.toFixed(decimals)}%`
}

export const fmtPrice = (v: number | null | undefined): string => {
  if (v == null) return '—'
  return `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const pctColor = (v: number | null | undefined): string => {
  if (v == null) return 'text-slate-400'
  if (v > 2) return 'text-emerald-400 font-semibold'
  if (v > 0) return 'text-emerald-500'
  if (v < -2) return 'text-red-400 font-semibold'
  if (v < 0) return 'text-red-500'
  return 'text-slate-400'
}

export const rsColor = (v: number | null | undefined): string => {
  if (v == null) return 'text-slate-400'
  if (v >= 90) return 'text-emerald-300 font-bold'
  if (v >= 70) return 'text-emerald-500'
  if (v >= 50) return 'text-yellow-500'
  return 'text-red-500'
}

// finviz 風熱力磚底色：綠(漲)/紅(跌)，強度隨 |change%| 提升（±3% 飽和）
export const heatColor = (v: number | null | undefined): string => {
  if (v == null) return 'hsl(215, 15%, 20%)'
  const mag = Math.min(Math.abs(v), 3) / 3   // 0..1
  const hue = v >= 0 ? 145 : 0
  const sat = 15 + mag * 55                  // 15%..70%
  const light = 24 + mag * 16                // 24%..40%
  return `hsl(${hue}, ${sat}%, ${light}%)`
}

export const excessBg = (v: number | null | undefined): string => {
  if (v == null) return 'bg-slate-800'
  if (v > 5) return 'bg-emerald-900 text-emerald-300'
  if (v > 0) return 'bg-emerald-950 text-emerald-400'
  if (v < -5) return 'bg-red-900 text-red-300'
  if (v < 0) return 'bg-red-950 text-red-400'
  return 'bg-slate-800 text-slate-400'
}
