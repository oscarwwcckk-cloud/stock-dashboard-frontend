export interface IndexEntry {
  key: string
  ticker: string
  price: number | null
  change_pct: number | null
  change_5d: number | null
  change_20d: number | null
}

export interface IndexSnapshotResponse {
  date: string
  indices: IndexEntry[]
}

export interface SectorItem {
  sector_key: string
  sector_name: string
  benchmark: string
  rs_rating: number | null
  rs_score: number | null
  rs_rank: number | null
  rs_1d: number | null
  rs_5d: number | null
  rs_20d: number | null
  rs_63d: number | null
  constituent_count: number
}

export interface SectorListResponse {
  date: string
  sectors: SectorItem[]
}

export interface StockInSector {
  ticker: string
  name: string
  price: number | null
  change_pct: number | null
  rs_score: number | null
  rs_vs_benchmark: number | null
  sector_rank: number | null
  industry: string
}

export interface SectorDetailResponse extends SectorItem {
  date: string
  stocks: StockInSector[]
}

export interface SectorHistoryPoint {
  date: string
  rs_score: number | null
  rs_1d: number | null
}

export interface SectorHistoryResponse {
  sector_key: string
  sector_name: string
  benchmark: string
  data: SectorHistoryPoint[]
}

// ── 買入/觀察名單 ──────────────────────────────────────────────────────────────

export interface WatchlistEntry {
  ticker: string
  name: string
  sector_key: string
  price: number | null
  rs_score: number | null
  pivot_price: number | null
  pct_from_pivot: number | null
  jlaw_score: number | null
  base_amplitude: number | null
  base_length: number | null
  list_label: string
}

export interface WatchlistResponse {
  date: string
  buy_list: WatchlistEntry[]
  watch_list: WatchlistEntry[]
}

export interface StockSearchItem {
  ticker: string
  name: string
  sector_key: string
  sector_name: string
}

export interface StockIndexItem {
  ticker: string
  name: string
  sector_key: string
  sector_name: string
  price: number | null
  change_pct: number | null
  rs_score: number | null
  rs_vs_benchmark: number | null
  sector_rank: number | null
}

export interface StocksIndexResponse {
  date: string | null
  stocks: StockIndexItem[]
}

// ── ETFs ────────────────────────────────────────────────────────────────────

export interface EtfItem {
  etf_ticker: string
  name: string
  group: string
  benchmark: string
  rs_rating: number | null
  rs_score: number | null
  rs_rank: number | null
  price: number | null
  change_pct: number | null
  change_5d: number | null
  change_20d: number | null
  constituent_count: number
}

export interface EtfListResponse {
  date: string
  etfs: EtfItem[]
}

export interface EtfDetailResponse extends EtfItem {
  date: string
  stocks: StockInSector[]
}

export interface EtfHistoryPoint {
  date: string
  rs_rating: number | null
  change_pct: number | null
}

export interface EtfHistoryResponse {
  etf_ticker: string
  name: string
  group: string
  data: EtfHistoryPoint[]
}

export interface StockDetailResponse {
  ticker: string
  name: string
  sector_key: string
  sector_name: string
  benchmark: string
  price: number | null
  change_pct: number | null
  rs_score: number | null
  rs_vs_benchmark: number | null
  sector_rank: number | null
  total_in_sector: number
  industry: string
}

export interface RSHistoryPoint {
  date: string
  rs_ratio: number
}

export interface RSHistoryResponse {
  ticker: string
  benchmark: string
  data: RSHistoryPoint[]
}

export interface OhlcBar {
  date: string
  open: number | null
  high: number | null
  low: number | null
  close: number | null
  volume: number | null
}

export interface OhlcResponse {
  ticker: string
  bars: OhlcBar[]
}

// ── Market Analysis ──────────────────────────────────────────────────────────

export interface MarketAnalysisEntry {
  date: string
  index_key: string
  ticker: string
  price: number | null
  change_pct: number | null
  ma20: number | null
  ma50: number | null
  ma200: number | null
  pct_from_ma20: number | null
  pct_from_ma50: number | null
  pct_from_ma200: number | null
  above_ma20: number | null
  above_ma50: number | null
  above_ma200: number | null
  rsi14: number | null
  macd_line: number | null
  macd_signal: number | null
  macd_hist: number | null
  volume: number | null
  vol_avg50: number | null
  vol_ratio: number | null
  high_52w: number | null
  low_52w: number | null
  pct_from_52w_high: number | null
  pct_from_52w_low: number | null
  dist_days: number | null
  change_5d: number | null
  change_20d: number | null
  change_63d: number | null
  trend_state: string | null
  market_signal: string | null
}

export interface MarketAnalysisResponse {
  date: string
  indices: MarketAnalysisEntry[]
}

export interface MarketHistoryPoint {
  date: string
  price: number | null
  change_pct: number | null
  ma20: number | null
  ma50: number | null
  ma200: number | null
  rsi14: number | null
  macd_hist: number | null
  dist_days: number | null
  trend_state: string | null
}

export interface MarketHistoryResponse {
  index_key: string
  ticker: string
  data: MarketHistoryPoint[]
}

export interface HealthResponse {
  status: string
  last_refresh: string | null
  sector_count: number
  stock_count: number
}

// ── Market Breadth (Finviz) ──────────────────────────────────────────────────

export interface BreadthMetric {
  pct: number | null
  count: number | null
}

export interface MarketBreadthResponse {
  advancing: BreadthMetric
  declining: BreadthMetric
  new_high: BreadthMetric
  new_low: BreadthMetric
  above_sma50: BreadthMetric
  below_sma50: BreadthMetric
  above_sma200: BreadthMetric
  below_sma200: BreadthMetric
  fetched_at: string | null
}
