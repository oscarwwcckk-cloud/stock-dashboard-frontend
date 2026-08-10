import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts'

interface DataPoint {
  date: string
  value: number | null
  [key: string]: string | number | null
}

interface Props {
  data: DataPoint[]
  dataKey?: string
  label?: string
  color?: string
  referenceValue?: number
  height?: number
}

const fmt = (d: string) => {
  const parts = d.split('-')
  return `${parts[1]}/${parts[2]}`
}

const tickFmt = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`

export default function RSChart({ data, dataKey = 'value', label = 'RS', color = '#60a5fa', referenceValue, height = 220 }: Props) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-40 text-slate-500 text-sm">No chart data</div>
  }

  const values = data.map(d => d[dataKey] as number).filter(v => v != null)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = (max - min) * 0.1 || 1

  const step = Math.max(1, Math.floor(data.length / 8))
  const ticks = data.filter((_, i) => i % step === 0).map(d => d.date)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis
          dataKey="date"
          ticks={ticks}
          tickFormatter={fmt}
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={{ stroke: '#334155' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={tickFmt}
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={[min - pad, max + pad]}
          width={56}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
          labelStyle={{ color: '#94a3b8', fontSize: 12 }}
          itemStyle={{ color: color }}
          formatter={(v) => {
            const n = v as number
            return [`${n > 0 ? '+' : ''}${n.toFixed(2)}%`, label] as [string, string]
          }}
        />
        {referenceValue != null && (
          <ReferenceLine y={referenceValue} stroke="#475569" strokeDasharray="4 2" />
        )}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          dot={false}
          strokeWidth={2}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
