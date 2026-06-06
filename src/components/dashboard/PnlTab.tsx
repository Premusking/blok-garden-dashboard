import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { format, fromUnixTime } from 'date-fns'
import { usePnlHistory } from '../../hooks/usePnlHistory'
import { TIME_RANGES } from '../../lib/constants'
import type { GardenInfo, TimeRange } from '../../types'
import styles from './PnlTab.module.css'

interface Props { garden: GardenInfo }

export function PnlTab({ garden }: Props) {
  const [range, setRange] = useState<TimeRange>('30d')
  const { data, isLoading, error } = usePnlHistory(garden, range)

  const chartData = (data ?? []).map((p) => ({
    ts: p.timestamp,
    value: Math.round(p.valueUsd),
    label: range === '24h'
      ? format(fromUnixTime(p.timestamp), 'HH:mm')
      : format(fromUnixTime(p.timestamp), 'MMM d'),
  }))

  const first = chartData[0]?.value ?? 0
  const last = chartData[chartData.length - 1]?.value ?? 0
  const change = last - first
  const changePct = first > 0 ? (change / first) * 100 : 0
  const isUp = change >= 0

  return (
    <div className="card">
      <div className={styles.header}>
        <div>
          <div className="card-title" style={{ marginBottom: 4 }}>Portfolio value</div>
          {!isLoading && data && (
            <div className={styles.valueLine}>
              <span className={styles.bigValue}>
                ${last.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
              <span className={isUp ? styles.pos : styles.neg}>
                {isUp ? '+' : ''}${change.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                {' '}({isUp ? '+' : ''}{changePct.toFixed(2)}%)
              </span>
            </div>
          )}
        </div>
        <div className={styles.rangePicker}>
          {TIME_RANGES.map((r) => (
            <button
              key={r.value}
              className={`${styles.rangeBtn} ${range === r.value ? styles.active : ''}`}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className={styles.loading}>Loading price history…</div>
      )}
      {error && (
        <div className={styles.error}>Could not load price data. Using cached values.</div>
      )}
      {!isLoading && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#555B72', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#555B72', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={48}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-surface)',
                border: '0.5px solid var(--border-default)',
                borderRadius: 8,
                fontSize: 12,
                color: 'var(--text-primary)',
              }}
              formatter={(v) => [
                `$${Number(v ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                'Portfolio Value'
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#1D9E75"
              strokeWidth={2}
              fill="url(#pnlGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#1D9E75', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
