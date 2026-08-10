import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useWatchlist } from '../hooks/useWatchlist'
import { fetchStockDetail } from '../api/stocks'
import type { StockInSector, StockDetailResponse } from '../types'
import StockTable from '../components/StockTable'

export default function MyListPage() {
  const { tickers, add, remove } = useWatchlist()
  const [input, setInput] = useState('')

  const { data: stocks = [], isFetching } = useQuery<StockInSector[]>({
    queryKey: ['my-list', tickers],
    queryFn: async () => {
      const results = await Promise.allSettled(tickers.map(t => fetchStockDetail(t)))
      return results
        .filter((r): r is PromiseFulfilledResult<StockDetailResponse> => r.status === 'fulfilled')
        .map(r => {
          const d = r.value
          return {
            ticker: d.ticker, name: d.name, price: d.price, change_pct: d.change_pct,
            rs_score: d.rs_score, rs_vs_benchmark: d.rs_vs_benchmark,
            sector_rank: d.sector_rank, industry: d.industry,
          }
        })
    },
    enabled: tickers.length > 0,
    staleTime: 5 * 60 * 1000,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    add(input)
    setInput('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">我的自選股</h1>
        <p className="text-slate-500 text-xs mt-1">存在本機瀏覽器（localStorage），不上傳。</p>
      </div>

      <form onSubmit={submit} className="flex gap-2 max-w-sm">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="加入代碼，例如 NVDA"
          className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium">
          加入
        </button>
      </form>

      {tickers.length === 0 && (
        <div className="text-slate-500 text-sm">尚未加入任何股票。輸入代碼開始追蹤。</div>
      )}

      {tickers.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            {tickers.map(t => (
              <span key={t} className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-sm font-mono">
                {t}
                <button onClick={() => remove(t)} className="text-slate-500 hover:text-red-400" aria-label={`remove ${t}`}>×</button>
              </span>
            ))}
          </div>

          {isFetching && stocks.length === 0
            ? <div className="text-slate-500 animate-pulse text-sm">Loading...</div>
            : stocks.length > 0 && <StockTable stocks={stocks} />}
        </>
      )}
    </div>
  )
}
