import { STATIC, fetchStatic, fetchApi } from './dataClient'

export interface KqEpRow {
  Rank: number; Ticker: string; Price: number; 'Gap%': number
  'Vol Multiple': number; 'Avg Vol 50d': number; 'ADR 20%': number
  '1M Return%': number; '3M Return%': number
}

export interface KqHtfRow {
  Rank: number; Ticker: string; Price: number; 'Pole%': number
  'Pole Days': number; 'Flag Days': number; 'Flag Drawdown%': number
  'Flag High': number; 'Flag Low': number; 'Vol Contraction': string
  'ADR 20%': number; 'Avg Vol 50d': number; '1M Return%': number
  'Vol Contract%': number; 'Range Narrowing': string; Quality: number
}

export interface KqBreakoutRow {
  Rank: number; Ticker: string; State: string; Stars: number; Price: number
  'Prior Move%': number; 'Prior Days': number; 'Consol Days': number
  'Consol High': number; 'Consol Low': number; 'Consol DD%': number
  'Higher Lows': string; 'Range Narrowing': string; 'Range Contract%': number
  'Inside Day': string; 'Surf EMA': string; EMA10: number; EMA20: number; EMA50: number
  'Consol VolDryup%': number; 'Breakout VolX': number; 'Exit EMA': number
  'Stop%': number; 'ADR 20%': number; '$Vol (M)': number
  '1M%': number; '3M%': number; '6M%': number
}

export interface KqVcpRow {
  Rank: number; Ticker: string; Price: number; Contractions: number
  'Depths%': string; 'Base Depth%': number; 'Final Depth%': number
  Pivot: number; 'Px vs Pivot%': number; Breakout: string
  'Vol Dryup%': number; 'Trend OK': string; 'Near 52wH': string
  'ADR 20%': number; 'Avg Vol 50d': number; '1M Return%': number; '3M Return%': number
}

export interface KqCwhRow {
  Rank: number; Ticker: string; State: string; Price: number
  'Prior Uptrend%': number; 'Cup Days': number; 'Cup Depth%': number
  'Left Peak': number; 'Right Peak': number; 'Cup Trough': number
  'Handle Days': number; 'Handle Depth%': number
  Pivot: number; 'Px vs Pivot%': number; 'Vol Dryup%': number
  'ADR 20%': number; 'Avg Vol 50d': number
  '1M Return%': number; '3M Return%': number; Target: number; 'Potential%': number
}

export interface KqDoubleBottomRow {
  Rank: number; Ticker: string; State: string; Price: number
  'L1 Price': number; 'L2 Price': number; 'Bottom Diff%': number
  'Base Duration (bars)': number; 'Peak P (Neckline)': number
  'Rebound%': number; 'Prior Decline%': number
  Pivot: number; 'Px vs Pivot%': number; 'Breakout VolX': number
  'ADR 20%': number; 'Avg Vol 50d': number; '1M Return%': number; '3M Return%': number
}

export interface KqIpoBaseRow {
  Rank: number; Ticker: string; State: string; Price: number
  'Total Bars': number; 'IPO Decline%': number
  'Base Duration (bars)': number; 'Tight Range%': number; 'Vol Dryup%': number
  Pivot: number; 'Px vs Pivot%': number; 'Breakout VolX': number
  'ADR 20%': number; 'Avg Vol 50d': number; '1M Return%': number; '3M Return%': number
}

export interface KqScannerResponse {
  scan_date: string
  universe_size: number
  ep: KqEpRow[]
  htf: KqHtfRow[]
  breakout: KqBreakoutRow[]
  vcp: KqVcpRow[]
  cwh: KqCwhRow[]
  double_bottom: KqDoubleBottomRow[]
  ipo_base: KqIpoBaseRow[]
}

export const fetchKqScanner = (): Promise<KqScannerResponse> =>
  STATIC
    ? fetchStatic('kq_scanner.json')
    : fetchApi('/api/kq-scanner')
