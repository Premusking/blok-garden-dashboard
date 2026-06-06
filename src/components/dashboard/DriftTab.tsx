import { useIndexDrift } from '../../hooks/useIndexDrift'
import type { GardenInfo } from '../../types'
import styles from './DriftTab.module.css'

interface Props { garden: GardenInfo }

export function DriftTab({ garden }: Props) {
  const { data, isLoading, error } = useIndexDrift(garden)

  if (!garden.isConnectedToIndex) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p className="muted">This garden is in self-managed mode — no index connected.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className={styles.header}>
        <div>
          <div className="card-title" style={{ marginBottom: 4 }}>Target vs current weights</div>
          {garden.connectedIndexName && (
            <div className={styles.indexName}>
              <span className="badge badge-green">Index</span>
              {garden.connectedIndexName}
            </div>
          )}
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.sq} style={{ background: 'var(--border-default)' }} />
            Target
          </span>
          <span className={styles.legendItem}>
            <span className={styles.sq} style={{ background: '#1D9E75' }} />
            Current
          </span>
        </div>
      </div>

      {isLoading && <p className="muted" style={{ padding: '1rem 0' }}>Loading index weights…</p>}
      {error && <p className="warn" style={{ padding: '1rem 0' }}>Could not load index data.</p>}

      {data && data.map((d) => {
        const targetPct = d.targetWeightBps / 100
        const currentPct = d.currentWeightBps / 100
        const diffPct = (d.driftBps / 100)
        const isOver = diffPct > 0
        const isSignificant = Math.abs(diffPct) > 1
        const barMax = 60 // scale bars to max 60% width in the bar area

        return (
          <div className={styles.driftRow} key={d.tokenAddress}>
            <div className={styles.symbol}>{d.symbol}</div>
            <div className={styles.barArea}>
              <div
                className={styles.targetBar}
                style={{ width: `${Math.min(targetPct * (barMax / 50), barMax)}%` }}
              />
              <div
                className={styles.currentBar}
                style={{
                  width: `${Math.min(currentPct * (barMax / 50), barMax)}%`,
                  background: isSignificant ? (isOver ? '#EF9F27' : '#E24B4A') : '#1D9E75',
                }}
              />
            </div>
            <div className={styles.pcts}>
              <span className="muted">{targetPct.toFixed(1)}% target</span>
              <span
                className={
                  !isSignificant ? '' : isOver ? styles.warn : styles.neg
                }
              >
                {diffPct >= 0 ? '+' : ''}{diffPct.toFixed(1)}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
