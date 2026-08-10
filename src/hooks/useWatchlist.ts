import { useCallback, useEffect, useState } from 'react'

const KEY = 'custom_watchlist'

function load(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

// 自訂自選股，純 localStorage（無登入、無後端）。
export function useWatchlist() {
  const [tickers, setTickers] = useState<string[]>(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(tickers)) } catch { /* ignore */ }
  }, [tickers])

  const add = useCallback((t: string) => {
    const up = t.trim().toUpperCase()
    if (!up) return
    setTickers(prev => (prev.includes(up) ? prev : [...prev, up]))
  }, [])

  const remove = useCallback((t: string) => {
    setTickers(prev => prev.filter(x => x !== t.toUpperCase()))
  }, [])

  const has = useCallback((t: string) => tickers.includes(t.toUpperCase()), [tickers])

  return { tickers, add, remove, has }
}
