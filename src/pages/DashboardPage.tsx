import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Navbar } from '../components/layout/Navbar'
import { GardenSearch } from '../components/dashboard/GardenSearch'
import { GardenBanner } from '../components/dashboard/GardenBanner'
import { MetricsRow } from '../components/dashboard/MetricsRow'
import { HoldingsTab } from '../components/dashboard/HoldingsTab'
import { PnlTab } from '../components/dashboard/PnlTab'
import { DriftTab } from '../components/dashboard/DriftTab'
import { GovernanceTab } from '../components/dashboard/GovernanceTab'
import { Tabs } from '../components/ui/Tabs'
import { useGardenData } from '../hooks/useGardenData'
import styles from './DashboardPage.module.css'

const TABS = [
  { id: 'holdings',   label: 'Holdings'    },
  { id: 'pnl',        label: 'P&L Chart'   },
  { id: 'drift',      label: 'Index Drift'  },
  { id: 'governance', label: 'Governance'   },
]

export function DashboardPage() {
  const { } = useAccount()
  const [gardenAddress, setGardenAddress] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('holdings')

  const { data: garden, isLoading, error, isFetching } = useGardenData(gardenAddress)

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        {/* Garden address input */}
        <GardenSearch
          onSearch={(addr) => { setGardenAddress(addr); setActiveTab('holdings') }}
          currentAddress={gardenAddress}
        />

        {/* Loading state */}
        {isLoading && gardenAddress && (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} aria-label="Loading garden data" />
            <p className="muted">Fetching garden data from Arbitrum One…</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className={styles.errorCard}>
            <p className="warn">⚠ Could not load garden data</p>
            <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>
              {(error as Error).message || 'Check the address and try again.'}
            </p>
          </div>
        )}

        {/* Dashboard */}
        {garden && !isLoading && (
          <div className={styles.dashboard}>
            {isFetching && (
              <div className={styles.refetchBadge}>Refreshing…</div>
            )}

            <GardenBanner garden={garden} />

            <MetricsRow garden={garden} />

            <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

            {activeTab === 'holdings'   && <HoldingsTab   garden={garden} />}
            {activeTab === 'pnl'        && <PnlTab         garden={garden} />}
            {activeTab === 'drift'      && <DriftTab        garden={garden} />}
            {activeTab === 'governance' && <GovernanceTab />}
          </div>
        )}

        {/* Empty state — no address yet */}
        {!gardenAddress && !isLoading && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} aria-hidden="true">⬡</div>
            <h2 className={styles.emptyTitle}>Track any BLOK Capital Garden</h2>
            <p className={styles.emptySub}>
              Enter a Garden contract address above to see holdings, P&L, index drift, and governance activity.
            </p>
            <div className={styles.emptyLinks}>
              <a href="https://blokcapital.io" target="_blank" rel="noopener noreferrer">
                Get a Garden →
              </a>
              <a href="https://docs.blokcapital.io" target="_blank" rel="noopener noreferrer">
                Read the docs →
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
