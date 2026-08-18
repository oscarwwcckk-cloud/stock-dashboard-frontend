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
    <div className="h-9 flex items-center bg-[#131722] border-b border-[#2A2E39] px-4 shrink-0">
      <div className="flex overflow-x-auto no-scrollbar divide-x divide-[#2A2E39]">
        {data?.indices.map(idx => {
          const up = (idx.change_pct ?? 0) >= 0
          return (
            <div key={idx.key}
                 className="shrink-0 flex items-center gap-2 px-4 first:pl-0">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${up ? 'bg-[#089981]' : 'bg-[#F23645]'}`} />
              <span className="text-[#787B86] text-[11px] font-semibold tracking-wide">{idx.key}</span>
              <span className="text-[#D1D4DC] text-[12px] font-mono font-semibold tabular-nums">
                {fmtPrice(idx.price)}
              </span>
              <span className={`text-[11px] font-mono tabular-nums ${up ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                {fmtPct(idx.change_pct)}
              </span>
              {idx.change_5d != null && (
                <span className={`text-[10px] font-mono tabular-nums opacity-55 ${
                  (idx.change_5d ?? 0) >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                }`}>
                  5d {fmtPct(idx.change_5d)}
                </span>
              )}
            </div>
          )
        })}
        {!data && (
          <span className="text-[#787B86] animate-pulse text-[11px] font-mono py-1">
            載入指數...
          </span>
        )}
      </div>
    </div>
  )
}
