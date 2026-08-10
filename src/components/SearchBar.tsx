import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchStocks } from '../api/stocks'
import type { StockSearchItem } from '../types'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<StockSearchItem[]>([])
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const nav = useNavigate()

  useEffect(() => {
    clearTimeout(timer.current)
    if (query.length < 1) { setResults([]); return }
    timer.current = setTimeout(async () => {
      try {
        const res = await searchStocks(query)
        setResults(res)
        setOpen(true)
      } catch { setResults([]) }
    }, 300)
    return () => clearTimeout(timer.current)
  }, [query])

  const pick = (ticker: string) => {
    setQuery(''); setResults([]); setOpen(false)
    nav(`/stock/${ticker}`)
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search ticker or company..."
        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-hidden">
          {results.map(r => (
            <li
              key={r.ticker}
              className="flex items-center justify-between px-4 py-2 hover:bg-slate-700 cursor-pointer"
              onMouseDown={() => pick(r.ticker)}
            >
              <div>
                <span className="font-bold text-white mr-2">{r.ticker}</span>
                <span className="text-slate-400 text-sm">{r.name}</span>
              </div>
              <span className="text-xs text-slate-500">{r.sector_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
