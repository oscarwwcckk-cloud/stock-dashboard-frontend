import { useQuery } from '@tanstack/react-query'
import { fetchIndexSnapshot } from '../api/indices'
import { fmtPrice, fmtPct, pctColor } from '../utils/format'

export default function IndexBar() {
  const { data } = useQuery({
    queryKey: ['indices'],
    queryFn: fetchIndexSnapshot,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="flex gap-6 bg-slate-900 border-b border-slate-700 px-6 py-3 text-sm">
      {data?.indices.map(idx => (
        <div key={idx.key} className="flex items-center gap-2">
          <span className="text-slate-400 font-mono font-semibold">{idx.key}</span>
          <span className="text-white font-semibold">{fmtPrice(idx.price)}</span>
          <span className={pctColor(idx.change_pct)}>{fmtPct(idx.change_pct)}</span>
          {idx.change_5d != null && (
            <span className={`text-xs ${pctColor(idx.change_5d)}`}>5d: {fmtPct(idx.change_5d)}</span>
          )}
        </div>
      ))}
      {!data && <span className="text-slate-500 animate-pulse">Loading indices...</span>}
    </div>
  )
}
