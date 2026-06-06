import type { GardenInfo } from '../../types'
import styles from './GardenBanner.module.css'

interface Props { garden: GardenInfo }

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function GardenBanner({ garden }: Props) {
  return (
    <div className={styles.banner}>
      <div className={styles.left}>
        <div className={styles.gardenIcon} aria-hidden="true">⬡</div>
        <div>
          <div className={styles.gardenAddr}>
            Garden{' '}
            <a
              href={`https://arbiscan.io/address/${garden.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.addrLink}
            >
              <code>{shortAddr(garden.address)}</code> ↗
            </a>
          </div>
          <div className={styles.ownerLine}>
            Owner:{' '}
            <a
              href={`https://arbiscan.io/address/${garden.owner}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.addrLink}
            >
              <code>{shortAddr(garden.owner)}</code>
            </a>
          </div>
        </div>
      </div>

      <div className={styles.tags}>
        {garden.isConnectedToIndex && garden.connectedIndexName ? (
          <span className="badge badge-green">
            ⬡ {garden.connectedIndexName}
          </span>
        ) : (
          <span className="badge badge-muted">Self-managed</span>
        )}

        <span className="badge badge-muted">
          Arbitrum One
        </span>

        <a
          href={`https://arbiscan.io/address/${garden.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.scanLink}
        >
          View on Arbiscan ↗
        </a>
      </div>
    </div>
  )
}
