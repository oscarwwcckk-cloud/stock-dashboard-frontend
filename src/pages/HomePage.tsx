import { useQuery } from '@tanstack/react-query'
import { fetchSectors } from '../api/sectors'
import type { SectorListResponse } from '../types'
import SectorRankTable from '../components/SectorRankTable'
import SearchBar from '../components/SearchBar'

export default function HomePage() {
  const { data, isLoading, error } = useQuery<SectorListResponse>({
    queryKey: ['sectors'],
    queryFn: () => fetchSectors(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Sector RS Dashboard</h1>
          {data?.date && (
            <p className="text-slate-500 text-sm mt-1">Last updated: {data.date}</p>
          )}
        </div>
        <SearchBar />
      </div>

      {isLoading && (
        <div className="text-slate-500 animate-pulse text-sm">Loading sectors...</div>
      )}

      {error && (
        <div className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-3">
          Failed to load sector data. Make sure the backend is running.
        </div>
      )}

      {data && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
              {data.sectors.length} Sectors — Ranked by Relative Strength
            </h2>
          </div>
          <SectorRankTable sectors={data.sectors} />
        </div>
      )}
    </div>
  )
}
