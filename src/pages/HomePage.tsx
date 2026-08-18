import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchSectors } from '../api/sectors'
import type { SectorListResponse } from '../types'
import SectorRankTable from '../components/SectorRankTable'
import SectorCards from '../components/SectorCards'
import SearchBar from '../components/SearchBar'

export default function HomePage() {
  const [view, setView] = useState<'cards' | 'table'>('cards')

  const { data, isLoading, error } = useQuery<SectorListResponse>({
    queryKey: ['sectors'],
    queryFn: () => fetchSectors(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })

  const tab = (v: 'cards' | 'table', label: string) => (
    <button
      onClick={() => setView(v)}
      className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
        view === v ? 'bg-[#2962FF]/15 text-[#2962FF] border border-[#2962FF]/25' : 'text-[#787B86] hover:text-[#D1D4DC] border border-transparent'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="max-w-7xl mx-auto px-3 lg:px-4 py-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#D1D4DC]">板塊相對強度</h1>
          {data?.date && (
            <p className="text-slate-500 text-sm mt-1">依 RS Rating vs SPX 排名 · {data.date}</p>
          )}
        </div>
        <SearchBar />
      </div>

      {isLoading && (
        <div className="text-slate-500 animate-pulse text-sm">載入板塊中...</div>
      )}

      {error && (
        <div className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-3">
          載入板塊資料失敗。請確認後端正在運行。
        </div>
      )}

      {data && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="panel-label">{data.sectors.length} 個板塊 · RS Rating (1–99) vs SPX</span>
            <div className="flex gap-1 bg-[#1E222D] border border-[#2A2E39] rounded p-0.5">
              {tab('cards', '卡片')}
              {tab('table', '表格')}
            </div>
          </div>
          {view === 'cards'
            ? <SectorCards sectors={data.sectors} />
            : <SectorRankTable sectors={data.sectors} />}
        </div>
      )}
    </div>
  )
}
