import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import IndexBar from './components/IndexBar'
import HomePage from './pages/HomePage'
import SectorPage from './pages/SectorPage'
import StockPage from './pages/StockPage'
import MarketPage from './pages/MarketPage'
import WatchlistPage from './pages/WatchlistPage'
import EtfPage from './pages/EtfPage'
import EtfDetailPage from './pages/EtfDetailPage'
import HeatmapPage from './pages/HeatmapPage'
import MyListPage from './pages/MyListPage'

const queryClient = new QueryClient()

function NavBar() {
  const base = 'px-4 py-2 text-sm font-medium rounded-md transition-colors'
  const active = `${base} bg-slate-700 text-white`
  const inactive = `${base} text-slate-400 hover:text-white hover:bg-slate-800`
  return (
    <div className="flex gap-1 bg-slate-900 border-b border-slate-800 px-4 py-2">
      <NavLink to="/" end className={({ isActive }) => isActive ? active : inactive}>
        Sectors
      </NavLink>
      <NavLink to="/etfs" className={({ isActive }) => isActive ? active : inactive}>
        ETF Rankings
      </NavLink>
      <NavLink to="/heatmap" className={({ isActive }) => isActive ? active : inactive}>
        Heatmap
      </NavLink>
      <NavLink to="/market" className={({ isActive }) => isActive ? active : inactive}>
        Market Analysis
      </NavLink>
      <NavLink to="/watchlist" className={({ isActive }) => isActive ? active : inactive}>
        Buy / Watch
      </NavLink>
      <NavLink to="/my-list" className={({ isActive }) => isActive ? active : inactive}>
        My List
      </NavLink>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-white">
          <IndexBar />
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/etfs" element={<EtfPage />} />
            <Route path="/etf/:ticker" element={<EtfDetailPage />} />
            <Route path="/heatmap" element={<HeatmapPage />} />
            <Route path="/my-list" element={<MyListPage />} />
            <Route path="/sector/:key" element={<SectorPage />} />
            <Route path="/stock/:ticker" element={<StockPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
