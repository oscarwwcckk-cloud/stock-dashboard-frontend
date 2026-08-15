import { useEffect, useRef } from 'react'
import {
  createChart, CandlestickSeries, HistogramSeries, ColorType,
  type IChartApi, type UTCTimestamp,
} from 'lightweight-charts'
import type { OhlcBar } from '../types'

interface Props {
  bars: OhlcBar[]
  height?: number
  showVolume?: boolean
}

// Futu 風配色：綠漲 / 紅跌
const UP = '#22c55e'
const DOWN = '#ef4444'

export default function CandleChart({ bars, height = 360, showVolume = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const chart: IChartApi = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
        fontFamily: 'ui-monospace, monospace',
      },
      grid: {
        vertLines: { color: 'rgba(148,163,184,0.06)' },
        horzLines: { color: 'rgba(148,163,184,0.06)' },
      },
      rightPriceScale: { borderColor: 'rgba(148,163,184,0.15)' },
      timeScale: { borderColor: 'rgba(148,163,184,0.15)', timeVisible: false },
      crosshair: { mode: 0 },
      width: el.clientWidth,
      height,
    })

    const candles = chart.addSeries(CandlestickSeries, {
      upColor: UP, downColor: DOWN,
      borderUpColor: UP, borderDownColor: DOWN,
      wickUpColor: UP, wickDownColor: DOWN,
    })

    const toTime = (d: string) =>
      (Date.parse(d + 'T00:00:00Z') / 1000) as UTCTimestamp

    const candleData = bars
      .filter(b => b.open != null && b.high != null && b.low != null && b.close != null)
      .map(b => ({
        time: toTime(b.date),
        open: b.open as number, high: b.high as number,
        low: b.low as number, close: b.close as number,
      }))
    candles.setData(candleData)

    if (showVolume) {
      const vol = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: 'vol',
      })
      chart.priceScale('vol').applyOptions({
        scaleMargins: { top: 0.82, bottom: 0 },
      })
      vol.setData(
        bars
          .filter(b => b.volume != null)
          .map(b => ({
            time: toTime(b.date),
            value: b.volume as number,
            color: (b.close ?? 0) >= (b.open ?? 0) ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)',
          }))
      )
    }

    chart.timeScale().fitContent()

    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width
      if (w) chart.applyOptions({ width: Math.floor(w) })
    })
    ro.observe(el)

    return () => {
      ro.disconnect()
      chart.remove()
    }
  }, [bars, height, showVolume])

  if (!bars || bars.length === 0) {
    return <div className="flex items-center justify-center h-40 text-slate-500 text-sm">No chart data</div>
  }

  return <div ref={containerRef} className="w-full" style={{ height }} />
}
