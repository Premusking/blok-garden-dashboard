import type { GardenInfo } from '../../types'
import styles from './MetricsRow.module.css'

interface Props {
  garden: GardenInfo
  pnl7d?: number
  pnl30d?: number
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`
  return `$${n.toFixed(2)}`
}

function pctFmt(n: number) {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

export function MetricsRow({ garden, pnl7d, pnl30d }: Props) {
  return (
    <div className={styles.row}>
      <MetricCard
        label="Portfolio Value"
        value={fmt(garden.totalValueUsd)}
        sub={`${garden.holdings.length} assets`}
        subClass=""
      />
      <MetricCard
        label="7-Day P&L"
        value={pnl7d !== undefined ? fmt(Math.abs(pnl7d)) : '—'}
        sub={pnl7d !== undefined ? pctFmt((pnl7d / (garden.totalValueUsd - pnl7d)) * 100) : ''}
        subClass={pnl7d !== undefined ? (pnl7d >= 0 ? 'pos' : 'neg') : ''}
        valueClass={pnl7d !== undefined ? (pnl7d >= 0 ? 'pos' : 'neg') : ''}
        prefix={pnl7d !== undefined ? (pnl7d >= 0 ? '+' : '−') : ''}
      />
      <MetricCard
        label="30-Day P&L"
        value={pnl30d !== undefined ? fmt(Math.abs(pnl30d)) : '—'}
        sub={pnl30d !== undefined ? pctFmt((pnl30d / (garden.totalValueUsd - pnl30d)) * 100) : ''}
        subClass={pnl30d !== undefined ? (pnl30d >= 0 ? 'pos' : 'neg') : ''}
        valueClass={pnl30d !== undefined ? (pnl30d >= 0 ? 'pos' : 'neg') : ''}
        prefix={pnl30d !== undefined ? (pnl30d >= 0 ? '+' : '−') : ''}
      />
      <MetricCard
        label="Index Mode"
        value={garden.isConnectedToIndex ? 'Auto' : 'Manual'}
        sub={garden.isConnectedToIndex ? 'Rebalancing on' : 'Self-managed'}
        subClass={garden.isConnectedToIndex ? 'pos' : ''}
        valueClass={garden.isConnectedToIndex ? 'pos' : 'muted'}
      />
      <MetricCard label="Network" value="Arbitrum" sub="One" subClass="" />
    </div>
  )
}

interface MetricCardProps {
  label: string; value: string; sub: string; subClass: string
  valueClass?: string; prefix?: string
}

function MetricCard({ label, value, sub, subClass, valueClass, prefix }: MetricCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={`${styles.value} ${valueClass ? styles[valueClass as keyof typeof styles] ?? valueClass : ''}`}>
        {prefix}{value}
      </div>
      {sub && <div className={`${styles.sub} ${subClass ? styles[subClass as keyof typeof styles] ?? subClass : ''}`}>{sub}</div>}
    </div>
  )
}
