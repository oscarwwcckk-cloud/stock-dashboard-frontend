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

const NAV = [
  { to: '/',          end: true,  full: '大盤分析',       short: '大盤', icon: 'M3 3v18h18M7 14l3-3 3 3 5-6' },
  { to: '/sectors',   end: false, full: '板塊',           short: '板塊', icon: 'M4 6h16M4 12h16M4 18h10' },
  { to: '/etfs',      end: false, full: 'ETF排名',        short: 'ETF',  icon: 'M3 12l4-4 4 4 4-6 4 4M3 20h18' },
  { to: '/heatmap',   end: false, full: '熱力圖',         short: '熱力', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
  { to: '/watchlist', end: false, full: 'Set up篩選器',   short: '篩選', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' },
  { to: '/my-list',   end: false, full: '自選股',         short: '自選', icon: 'M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z' },
]

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
         strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
      <path d={d} />
    </svg>
  )
}

function Sidebar() {
  const active   = 'flex items-center gap-2.5 pl-3 pr-4 py-2 text-sm font-medium text-[#C8D1E8] bg-[#1C2030] border-l-2 border-[#4E8AFF]'
  const inactive = 'flex items-center gap-2.5 pl-3 pr-4 py-2 text-sm font-medium text-[#5C6480] border-l-2 border-transparent hover:text-[#C8D1E8] hover:bg-[#131720] transition-colors'
  return (
    <aside className="hidden md:flex md:flex-col md:w-44 shrink-0 sticky top-0 h-screen
                      bg-[#0B0D13] border-r border-[#252B3D]">
      {/* ── Logo ── */}
      <div className="h-14 flex items-center justify-center px-3 border-b border-[#252B3D] shrink-0">
        <img src="/marketrader-logo.png" alt="MarketRader" className="h-10 w-auto object-contain" />
      </div>

      {/* ── Nav ── */}
      <nav className="flex flex-col pt-1.5">
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.end}
                   className={({ isActive }) => isActive ? active : inactive}>
            <Icon d={n.icon} />
            <span>{n.full}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="mt-auto px-4 pb-4 pt-2 border-t border-[#252B3D]">
        <span className="text-[#5C6480] text-[10px] font-mono">RS · KQ · J.Law</span>
      </div>
    </aside>
  )
}

function BottomTab() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex bg-[#0B0D13]/95 backdrop-blur border-t border-[#252B3D]">
      {NAV.map(n => (
        <NavLink key={n.to} to={n.to} end={n.end}
                 className={({ isActive }) =>
                   `flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] transition-colors ${isActive ? 'text-[#4E8AFF]' : 'text-[#5C6480]'}`}>
          <Icon d={n.icon} />
          {n.short}
        </NavLink>
      ))}
    </nav>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen flex bg-[#0B0D13] text-[#C8D1E8]">
          <Sidebar />
          <div className="flex-1 min-w-0 relative">
            {/* ── Watermark ── */}
            <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center md:left-44">
              <img src="/marketrader-logo.png" alt="" aria-hidden="true"
                   className="w-[480px] max-w-[60vw] opacity-[0.04] select-none" />
            </div>
            <IndexBar />
            <main className="relative z-10 pb-20 md:pb-6">
              <Routes>
                <Route path="/" element={<MarketPage />} />
                <Route path="/sectors" element={<HomePage />} />
                <Route path="/market" element={<MarketPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/etfs" element={<EtfPage />} />
                <Route path="/etf/:ticker" element={<EtfDetailPage />} />
                <Route path="/heatmap" element={<HeatmapPage />} />
                <Route path="/my-list" element={<MyListPage />} />
                <Route path="/sector/:key" element={<SectorPage />} />
                <Route path="/stock/:ticker" element={<StockPage />} />
              </Routes>
            </main>
          </div>
          <BottomTab />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
