import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { GardenInfo } from '../../types'
import styles from './HoldingsTab.module.css'

interface Props { garden: GardenInfo }

export function HoldingsTab({ garden }: Props) {
  const { holdings, totalValueUsd } = garden
  if (holdings.length === 0) {
    return <p className="muted" style={{ textAlign: 'center', padding: '2rem' }}>No token balances found in this garden.</p>
  }

  const chartData = holdings.map((h) => ({
    name: h.symbol,
    value: h.allocationPct,
    color: h.color,
  }))

  return (
    <div className={styles.grid}>
      {/* Token list */}
      <div className="card">
        <div className="card-title">Token holdings</div>
        {holdings.map((h) => (
          <div className={styles.tokenRow} key={h.address}>
            <div className={styles.tokenIcon} style={{ background: h.color + '22', color: h.color }}>
              {h.symbol.slice(0, 3)}
            </div>
            <div className={styles.tokenInfo}>
              <div className={styles.tokenSymbol}>{h.symbol}</div>
              <div className={styles.tokenName}>{h.name}</div>
            </div>
            <div className={styles.tokenBar}>
              <div
                className={styles.tokenBarFill}
                style={{ width: `${h.allocationPct}%`, background: h.color }}
              />
            </div>
            <div className={styles.tokenRight}>
              <div className={styles.tokenValue}>${h.valueUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
              <div className={styles.tokenBal}>{h.balanceFormatted} {h.symbol}</div>
              <div className={styles.tokenPct}>{h.allocationPct.toFixed(1)}%</div>
            </div>
          </div>
        ))}
        <div className={styles.totalRow}>
          <span className="muted">Total</span>
          <span style={{ fontWeight: 500 }}>
            ${totalValueUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      {/* Donut chart */}
      <div className="card">
        <div className="card-title">Allocation</div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => [`${(Number(v)).toFixed(1)}%`, '']}
              contentStyle={{
                background: 'var(--bg-card)',
                border: '0.5px solid var(--border-default)',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.legend}>
          {holdings.map((h) => (
            <div className={styles.legendItem} key={h.address}>
              <div className={styles.legendDot} style={{ background: h.color }} />
              <span>{h.symbol}</span>
              <span className="muted">{h.allocationPct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
