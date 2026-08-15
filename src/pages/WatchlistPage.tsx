import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchKqScanner } from '../api/kqScanner'
import type { KqScannerResponse } from '../api/kqScanner'
import { fmtPrice, fmtPct } from '../utils/format'

type TabKey = 'ep' | 'htf' | 'breakout' | 'vcp' | 'cwh' | 'double_bottom' | 'ipo_base'

const TABS: { key: TabKey; label: string; desc: string }[] = [
  { key: 'ep',           label: 'EP 爆量缺口',  desc: '開盤跳空 + 爆量突破，動能最強' },
  { key: 'htf',          label: 'HTF 旗形',     desc: '高柱旗形整理，量縮等待續漲' },
  { key: 'breakout',     label: '突破',         desc: '整理區間向上突破' },
  { key: 'vcp',          label: 'VCP 量縮整理', desc: '多重收縮型態，量能持續萎縮' },
  { key: 'cwh',          label: 'CWH 杯柄',     desc: '經典杯柄型態，軸心點突破' },
  { key: 'double_bottom', label: '雙底',        desc: '雙底型態，頸線突破' },
  { key: 'ipo_base',     label: 'IPO底部',      desc: 'IPO後首次整理突破' },
]

function pctCol(v: number | null | undefined) {
  if (v == null) return 'text-[#5C6480]'
  return v >= 0 ? 'text-[#26C6A6]' : 'text-[#EF5465]'
}

function stateTag(state: string) {
  if (state === 'BREAKOUT') return <span className="text-xs px-1.5 py-0.5 rounded border bg-[#26C6A6]/10 text-[#26C6A6] border-[#26C6A6]/25 font-mono">突破</span>
  if (state === 'COILED')   return <span className="text-xs px-1.5 py-0.5 rounded border bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/25 font-mono">待發</span>
  if (state === 'FORMING')  return <span className="text-xs px-1.5 py-0.5 rounded border bg-[#4E8AFF]/10 text-[#4E8AFF] border-[#4E8AFF]/25 font-mono">構建中</span>
  return <span className="text-xs px-1.5 py-0.5 rounded border bg-[#1C2030] text-[#5C6480] border-[#252B3D] font-mono">{state}</span>
}

function stars(n: number) {
  return <span className="text-[#F5A623] text-xs">{'★'.repeat(n)}{'☆'.repeat(Math.max(0, 5 - n))}</span>
}

// ── EP 表格 ────────────────────────────────────────────────────────────────
function EpTable({ rows }: { rows: KqScannerResponse['ep'] }) {
  if (!rows.length) return <Empty />
  return (
    <div className="overflow-x-auto border border-[#252B3D]">
      <table className="w-full text-sm">
        <thead className="bg-[#131720]">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">代碼</th>
            <th className="px-3 py-3 text-right">股價</th>
            <th className="px-3 py-3 text-right">缺口%</th>
            <th className="px-3 py-3 text-right">量倍</th>
            <th className="px-3 py-3 text-right">ADR%</th>
            <th className="px-3 py-3 text-right">1M%</th>
            <th className="px-3 py-3 text-right">3M%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.Ticker} className="border-t border-[#252B3D] hover:bg-[#1C2030] transition-colors">
              <td className="px-4 py-2 text-[#5C6480] text-xs">{r.Rank}</td>
              <td className="px-4 py-2">
                <Link to={`/stock/${r.Ticker}`} className="font-bold text-[#C8D1E8] hover:text-[#4E8AFF] font-mono transition-colors">{r.Ticker}</Link>
              </td>
              <td className="px-3 py-2 text-right font-mono text-[#C8D1E8]">{fmtPrice(r.Price)}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['Gap%'])}`}>{r['Gap%'] != null ? `+${r['Gap%'].toFixed(1)}%` : '—'}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#F5A623]">{r['Vol Multiple']}x</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{r['ADR 20%']?.toFixed(1)}%</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['1M Return%'])}`}>{fmtPct(r['1M Return%'])}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['3M Return%'])}`}>{fmtPct(r['3M Return%'])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── HTF 表格 ───────────────────────────────────────────────────────────────
function HtfTable({ rows }: { rows: KqScannerResponse['htf'] }) {
  if (!rows.length) return <Empty />
  return (
    <div className="overflow-x-auto border border-[#252B3D]">
      <table className="w-full text-sm">
        <thead className="bg-[#131720]">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">代碼</th>
            <th className="px-3 py-3 text-right">股價</th>
            <th className="px-3 py-3 text-right">柱漲%</th>
            <th className="px-3 py-3 text-right">柱天</th>
            <th className="px-3 py-3 text-right">旗天</th>
            <th className="px-3 py-3 text-right">旗回%</th>
            <th className="px-3 py-3 text-right">量縮%</th>
            <th className="px-3 py-3 text-right">評分</th>
            <th className="px-3 py-3 text-right">1M%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.Ticker} className="border-t border-[#252B3D] hover:bg-[#1C2030] transition-colors">
              <td className="px-4 py-2 text-[#5C6480] text-xs">{r.Rank}</td>
              <td className="px-4 py-2">
                <Link to={`/stock/${r.Ticker}`} className="font-bold text-[#C8D1E8] hover:text-[#4E8AFF] font-mono transition-colors">{r.Ticker}</Link>
              </td>
              <td className="px-3 py-2 text-right font-mono text-[#C8D1E8]">{fmtPrice(r.Price)}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['Pole%'])}`}>{r['Pole%'] != null ? `+${r['Pole%'].toFixed(1)}%` : '—'}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{r['Pole Days']}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{r['Flag Days']}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['Flag Drawdown%'])}`}>{r['Flag Drawdown%'] != null ? `${r['Flag Drawdown%'].toFixed(1)}%` : '—'}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{r['Vol Contract%']?.toFixed(1)}%</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#F5A623]">{r.Quality}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['1M Return%'])}`}>{fmtPct(r['1M Return%'])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Breakout 表格 ──────────────────────────────────────────────────────────
function BreakoutTable({ rows }: { rows: KqScannerResponse['breakout'] }) {
  if (!rows.length) return <Empty />
  return (
    <div className="overflow-x-auto border border-[#252B3D]">
      <table className="w-full text-sm">
        <thead className="bg-[#131720]">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">代碼</th>
            <th className="px-3 py-3 text-left">狀態</th>
            <th className="px-3 py-3 text-left">★</th>
            <th className="px-3 py-3 text-right">股價</th>
            <th className="px-3 py-3 text-right">前段漲%</th>
            <th className="px-3 py-3 text-right">整理天</th>
            <th className="px-3 py-3 text-right">量縮%</th>
            <th className="px-3 py-3 text-right">突破量倍</th>
            <th className="px-3 py-3 text-right">止損%</th>
            <th className="px-3 py-3 text-right">1M%</th>
            <th className="px-3 py-3 text-right">3M%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.Ticker} className="border-t border-[#252B3D] hover:bg-[#1C2030] transition-colors">
              <td className="px-4 py-2 text-[#5C6480] text-xs">{r.Rank}</td>
              <td className="px-4 py-2">
                <Link to={`/stock/${r.Ticker}`} className="font-bold text-[#C8D1E8] hover:text-[#4E8AFF] font-mono transition-colors">{r.Ticker}</Link>
              </td>
              <td className="px-3 py-2">{stateTag(r.State)}</td>
              <td className="px-3 py-2">{stars(r.Stars)}</td>
              <td className="px-3 py-2 text-right font-mono text-[#C8D1E8]">{fmtPrice(r.Price)}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['Prior Move%'])}`}>{r['Prior Move%'] != null ? `+${r['Prior Move%'].toFixed(1)}%` : '—'}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{r['Consol Days']}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{r['Consol VolDryup%']?.toFixed(1)}%</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#F5A623]">{r['Breakout VolX']?.toFixed(1)}x</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#EF5465]">{r['Stop%']?.toFixed(1)}%</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['1M%'])}`}>{fmtPct(r['1M%'])}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['3M%'])}`}>{fmtPct(r['3M%'])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── VCP 表格 ───────────────────────────────────────────────────────────────
function VcpTable({ rows }: { rows: KqScannerResponse['vcp'] }) {
  if (!rows.length) return <Empty />
  return (
    <div className="overflow-x-auto border border-[#252B3D]">
      <table className="w-full text-sm">
        <thead className="bg-[#131720]">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">代碼</th>
            <th className="px-3 py-3 text-right">股價</th>
            <th className="px-3 py-3 text-right">收縮次</th>
            <th className="px-3 py-3 text-right">底部深%</th>
            <th className="px-3 py-3 text-right">最終深%</th>
            <th className="px-3 py-3 text-right">軸心點</th>
            <th className="px-3 py-3 text-right">距軸心%</th>
            <th className="px-3 py-3 text-right">量縮%</th>
            <th className="px-3 py-3 text-right">1M%</th>
            <th className="px-3 py-3 text-right">3M%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.Ticker} className="border-t border-[#252B3D] hover:bg-[#1C2030] transition-colors">
              <td className="px-4 py-2 text-[#5C6480] text-xs">{r.Rank}</td>
              <td className="px-4 py-2">
                <Link to={`/stock/${r.Ticker}`} className="font-bold text-[#C8D1E8] hover:text-[#4E8AFF] font-mono transition-colors">{r.Ticker}</Link>
              </td>
              <td className="px-3 py-2 text-right font-mono text-[#C8D1E8]">{fmtPrice(r.Price)}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#F5A623]">{r.Contractions}次</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{r['Base Depth%']?.toFixed(1)}%</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{r['Final Depth%']?.toFixed(1)}%</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#C8D1E8]">{fmtPrice(r.Pivot)}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['Px vs Pivot%'])}`}>{r['Px vs Pivot%'] != null ? `${r['Px vs Pivot%'].toFixed(1)}%` : '—'}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{r['Vol Dryup%']?.toFixed(1)}%</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['1M Return%'])}`}>{fmtPct(r['1M Return%'])}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['3M Return%'])}`}>{fmtPct(r['3M Return%'])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── CWH 表格 ───────────────────────────────────────────────────────────────
function CwhTable({ rows }: { rows: KqScannerResponse['cwh'] }) {
  if (!rows.length) return <Empty />
  return (
    <div className="overflow-x-auto border border-[#252B3D]">
      <table className="w-full text-sm">
        <thead className="bg-[#131720]">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">代碼</th>
            <th className="px-3 py-3 text-left">狀態</th>
            <th className="px-3 py-3 text-right">股價</th>
            <th className="px-3 py-3 text-right">杯天</th>
            <th className="px-3 py-3 text-right">杯深%</th>
            <th className="px-3 py-3 text-right">柄天</th>
            <th className="px-3 py-3 text-right">軸心點</th>
            <th className="px-3 py-3 text-right">距軸心%</th>
            <th className="px-3 py-3 text-right">目標</th>
            <th className="px-3 py-3 text-right">潛在%</th>
            <th className="px-3 py-3 text-right">1M%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.Ticker} className="border-t border-[#252B3D] hover:bg-[#1C2030] transition-colors">
              <td className="px-4 py-2 text-[#5C6480] text-xs">{r.Rank}</td>
              <td className="px-4 py-2">
                <Link to={`/stock/${r.Ticker}`} className="font-bold text-[#C8D1E8] hover:text-[#4E8AFF] font-mono transition-colors">{r.Ticker}</Link>
              </td>
              <td className="px-3 py-2">{stateTag(r.State)}</td>
              <td className="px-3 py-2 text-right font-mono text-[#C8D1E8]">{fmtPrice(r.Price)}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{r['Cup Days']}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{r['Cup Depth%']?.toFixed(1)}%</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{r['Handle Days']}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#C8D1E8]">{fmtPrice(r.Pivot)}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['Px vs Pivot%'])}`}>{r['Px vs Pivot%'] != null ? `${r['Px vs Pivot%'].toFixed(1)}%` : '—'}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#26C6A6]">{fmtPrice(r.Target)}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['Potential%'])}`}>{r['Potential%'] != null ? `+${r['Potential%'].toFixed(1)}%` : '—'}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['1M Return%'])}`}>{fmtPct(r['1M Return%'])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Double Bottom 表格 ────────────────────────────────────────────────────
function DoubleBottomTable({ rows }: { rows: KqScannerResponse['double_bottom'] }) {
  if (!rows.length) return <Empty />
  return (
    <div className="overflow-x-auto border border-[#252B3D]">
      <table className="w-full text-sm">
        <thead className="bg-[#131720]">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">代碼</th>
            <th className="px-3 py-3 text-left">狀態</th>
            <th className="px-3 py-3 text-right">股價</th>
            <th className="px-3 py-3 text-right">底1</th>
            <th className="px-3 py-3 text-right">底2</th>
            <th className="px-3 py-3 text-right">底差%</th>
            <th className="px-3 py-3 text-right">頸線</th>
            <th className="px-3 py-3 text-right">反彈%</th>
            <th className="px-3 py-3 text-right">軸心點</th>
            <th className="px-3 py-3 text-right">距軸心%</th>
            <th className="px-3 py-3 text-right">1M%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.Ticker} className="border-t border-[#252B3D] hover:bg-[#1C2030] transition-colors">
              <td className="px-4 py-2 text-[#5C6480] text-xs">{r.Rank}</td>
              <td className="px-4 py-2">
                <Link to={`/stock/${r.Ticker}`} className="font-bold text-[#C8D1E8] hover:text-[#4E8AFF] font-mono transition-colors">{r.Ticker}</Link>
              </td>
              <td className="px-3 py-2">{stateTag(r.State)}</td>
              <td className="px-3 py-2 text-right font-mono text-[#C8D1E8]">{fmtPrice(r.Price)}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{fmtPrice(r['L1 Price'])}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{fmtPrice(r['L2 Price'])}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['Bottom Diff%'])}`}>{r['Bottom Diff%'] != null ? `${r['Bottom Diff%'].toFixed(1)}%` : '—'}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#C8D1E8]">{fmtPrice(r['Peak P (Neckline)'])}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['Rebound%'])}`}>{r['Rebound%'] != null ? `+${r['Rebound%'].toFixed(1)}%` : '—'}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#C8D1E8]">{fmtPrice(r.Pivot)}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['Px vs Pivot%'])}`}>{r['Px vs Pivot%'] != null ? `${r['Px vs Pivot%'].toFixed(1)}%` : '—'}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['1M Return%'])}`}>{fmtPct(r['1M Return%'])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── IPO Base 表格 ─────────────────────────────────────────────────────────
function IpoBaseTable({ rows }: { rows: KqScannerResponse['ipo_base'] }) {
  if (!rows.length) return <Empty />
  return (
    <div className="overflow-x-auto border border-[#252B3D]">
      <table className="w-full text-sm">
        <thead className="bg-[#131720]">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">代碼</th>
            <th className="px-3 py-3 text-left">狀態</th>
            <th className="px-3 py-3 text-right">股價</th>
            <th className="px-3 py-3 text-right">IPO回調%</th>
            <th className="px-3 py-3 text-right">底部天</th>
            <th className="px-3 py-3 text-right">量縮%</th>
            <th className="px-3 py-3 text-right">軸心點</th>
            <th className="px-3 py-3 text-right">距軸心%</th>
            <th className="px-3 py-3 text-right">1M%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.Ticker} className="border-t border-[#252B3D] hover:bg-[#1C2030] transition-colors">
              <td className="px-4 py-2 text-[#5C6480] text-xs">{r.Rank}</td>
              <td className="px-4 py-2">
                <Link to={`/stock/${r.Ticker}`} className="font-bold text-[#C8D1E8] hover:text-[#4E8AFF] font-mono transition-colors">{r.Ticker}</Link>
              </td>
              <td className="px-3 py-2">{stateTag(r.State)}</td>
              <td className="px-3 py-2 text-right font-mono text-[#C8D1E8]">{fmtPrice(r.Price)}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['IPO Decline%'])}`}>{r['IPO Decline%'] != null ? `${r['IPO Decline%'].toFixed(1)}%` : '—'}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{r['Base Duration (bars)']}</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#5C6480]">{r['Vol Dryup%']?.toFixed(1)}%</td>
              <td className="px-3 py-2 text-right font-mono text-xs text-[#C8D1E8]">{fmtPrice(r.Pivot)}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['Px vs Pivot%'])}`}>{r['Px vs Pivot%'] != null ? `${r['Px vs Pivot%'].toFixed(1)}%` : '—'}</td>
              <td className={`px-3 py-2 text-right font-mono text-xs ${pctCol(r['1M Return%'])}`}>{fmtPct(r['1M Return%'])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Empty() {
  return <div className="text-[#5C6480] text-sm px-4 py-6 font-mono">今日掃描無符合條件的股票。</div>
}

export default function WatchlistPage() {
  const [tab, setTab] = useState<TabKey>('ep')

  const { data, isLoading, error } = useQuery<KqScannerResponse>({
    queryKey: ['kq-scanner'],
    queryFn: fetchKqScanner,
    staleTime: 10 * 60 * 1000,
  })

  const counts: Record<TabKey, number> = {
    ep: data?.ep.length ?? 0,
    htf: data?.htf.length ?? 0,
    breakout: data?.breakout.length ?? 0,
    vcp: data?.vcp.length ?? 0,
    cwh: data?.cwh.length ?? 0,
    double_bottom: data?.double_bottom.length ?? 0,
    ipo_base: data?.ipo_base.length ?? 0,
  }

  const activeTab = TABS.find(t => t.key === tab)!

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">KQ Scanner — Set up篩選器</h1>
        {data?.scan_date && (
          <p className="text-slate-500 text-sm mt-1">
            掃描時間：{data.scan_date} · 覆蓋 {data.universe_size?.toLocaleString()} 支股票
          </p>
        )}
      </div>

      {isLoading && <div className="text-slate-500 animate-pulse text-sm">載入篩選結果中...</div>}

      {error && (
        <div className="text-[#EF5465] text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-3">
          載入KQ篩選資料失敗。
        </div>
      )}

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              tab === t.key
                ? 'bg-amber-500/20 text-[#F5A623] border border-amber-500/40'
                : 'text-[#5C6480] bg-slate-800 border border-slate-700 hover:text-white'
            }`}
          >
            {t.label}
            {data && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                tab === t.key ? 'bg-amber-500/30 text-amber-300' : 'bg-slate-700 text-[#5C6480]'
              }`}>
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab description */}
      {data && (
        <div className="text-[#5C6480] text-xs border-l-2 border-slate-700 pl-3">
          {activeTab.desc}
        </div>
      )}

      {/* Table */}
      {data && tab === 'ep'           && <EpTable rows={data.ep} />}
      {data && tab === 'htf'          && <HtfTable rows={data.htf} />}
      {data && tab === 'breakout'     && <BreakoutTable rows={data.breakout} />}
      {data && tab === 'vcp'          && <VcpTable rows={data.vcp} />}
      {data && tab === 'cwh'          && <CwhTable rows={data.cwh} />}
      {data && tab === 'double_bottom' && <DoubleBottomTable rows={data.double_bottom} />}
      {data && tab === 'ipo_base'     && <IpoBaseTable rows={data.ipo_base} />}
    </div>
  )
}
