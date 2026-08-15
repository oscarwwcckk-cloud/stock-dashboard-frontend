# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server (proxies /api → localhost:8000)
npm run build      # tsc -b && vite build (TypeScript check + bundle)
npm run lint       # ESLint
```

Deploy to Vercel (mandatory after any change — this is NOT a git repo):
```bash
bash /c/Users/kd122/stock-dashboard/deploy.sh
```

## Architecture

**Stack**: React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + TanStack Query v5 + React Router v7

### Dual Data Mode

`src/api/dataClient.ts` switches between two fetch strategies via `VITE_DATA_MODE`:
- **`static`** (production/Vercel): fetches pre-built JSON from `/data/` — no backend needed
- **`api`** (development): proxies through axios to `VITE_API_URL` (default `http://localhost:8000`)

This is the central architectural decision. All page-level API calls go through `dataClient` rather than importing from `src/api/client.ts` directly. `client.ts` is only for non-static endpoints (e.g. watchlist mutations).

### State Management

TanStack Query handles all server state. No global store (Redux/Zustand/Context) is used. Custom watchlist is the only client state and lives in `localStorage` via `src/hooks/useWatchlist.ts`.

### Routing

All routes defined in `src/App.tsx`. Layout: persistent sidebar (desktop) + bottom tab nav (mobile). Route params (`/stock/:ticker`, `/sector/:key`, `/etf/:ticker`) feed directly into `useQuery` `queryKey` — guard with `enabled: !!ticker` to prevent queries with undefined params.

### Key Pages

| Route | Page | Data Source |
|-------|------|-------------|
| `/` | MarketPage | `/api/market` — SPX/NDX/DJI MA/RSI/MACD snapshots |
| `/sectors` | HomePage | `/api/sectors` — RS rating vs SPX |
| `/watchlist` | WatchlistPage | `/api/kq-scanner` — 7 pattern tabs (EP/HTF/Breakout/VCP/CWH/DB/IPO) |
| `/etfs` | EtfPage | `/api/etfs` — SPDR + Thematic ETF RS rankings |
| `/my-list` | MyListPage | localStorage tickers → batch stock detail fetch |

### Charting

Two chart libraries coexist:
- **`lightweight-charts`** (`CandleChart.tsx`): OHLC candlestick + volume bars — imperative API, must `chart.remove()` in useEffect cleanup
- **`recharts`** (`RSChart.tsx`): RS ratio line charts — declarative JSX

### Design Tokens

All defined as inline Tailwind classes; no CSS variables or theme file. Key values:
- Background: `#0B0D13` · Text: `#C8D1E8` · Accent: `#4E8AFF`
- Bullish: `#26C6A6` (teal) · Bearish: `#EF5465` (red) · Borders: `#252B3D`
- Color helpers: `src/utils/format.ts` — `pctColor()`, `rsColor()`, `heatColor()`

### Types

All shared TypeScript interfaces in `src/types/index.ts`. Add new API response shapes here rather than inline in component files.
