import { useQuery } from '@tanstack/react-query'
import { fetchIndexSnapshot } from '../api/indices'
import { fmtPrice, fmtPct } from '../utils/format'

export default function IndexBar() {
  const { data } = useQuery({
    queryKey: ['indices'],
    queryFn: fetchIndexSnapshot,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="h-10 flex items-center bg-[#0B0D13] border-b border-[#252B3D] px-4">
      <div className="flex overflow-x-auto no-scrollbar divide-x divide-[#252B3D]">
        {data?.indices.map(idx => {
          const up = (idx.change_pct ?? 0) >= 0
          return (
            <div key={idx.key}
                 className="shrink-0 flex items-center gap-2.5 px-4 first:pl-0">
              {/* trend dot */}
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${up ? 'bg-[#26C6A6]' : 'bg-[#EF5465]'}`} />
              <span className="text-[#5C6480] text-xs font-mono font-semibold">{idx.key}</span>
              <span className="text-[#C8D1E8] text-sm font-mono font-semibold tabular-nums">
                {fmtPrice(idx.price)}
              </span>
              <span className={`text-xs font-mono tabular-nums ${up ? 'text-[#26C6A6]' : 'text-[#EF5465]'}`}>
                {fmtPct(idx.change_pct)}
              </span>
              {idx.change_5d != null && (
                <span className={`text-[10px] font-mono tabular-nums opacity-60 ${
                  (idx.change_5d ?? 0) >= 0 ? 'text-[#26C6A6]' : 'text-[#EF5465]'
                }`}>
                  5d {fmtPct(idx.change_5d)}
                </span>
              )}
            </div>
          )
        })}
        {!data && (
          <span className="text-[#5C6480] animate-pulse text-xs font-mono py-1">
            載入指數中...
          </span>
        )}
      </div>
    </div>
  )
}
