import { useState } from 'react'
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
  { id: 'holdings',   label: 'Holdings'   },
  { id: 'pnl',        label: 'P&L Chart'  },
  { id: 'drift',      label: 'Index Drift' },
  { id: 'governance', label: 'Governance'  },
]

function parseError(err: unknown): { title: string; body: string } {
  const msg = (err as Error)?.message ?? ''

  if (msg.startsWith('NOT_A_CONTRACT:')) {
    return {
      title: '⚠ This is a wallet address, not a Garden',
      body: 'A Garden is a smart contract deployed by the BLOK Capital protocol — it is different from your wallet address. You need to enter the Garden contract address that was created for you when you joined BLOK Capital. Find it in the BLOK Capital app under "My Garden".',
    }
  }
  if (msg.startsWith('NOT_A_GARDEN:')) {
    return {
      title: '⚠ Not a BLOK Capital Garden contract',
      body: 'This address is a smart contract, but it does not appear to be a BLOK Capital Garden. Double-check the address in the BLOK Capital app.',
    }
  }
  return {
    title: '⚠ Could not load garden data',
    body: 'Check that the address is correct and that you are on Arbitrum One. If this is a new Garden it may still be indexing.',
  }
}

export function DashboardPage() {
  const [gardenAddress, setGardenAddress] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('holdings')

  const { data: garden, isLoading, error, isFetching } = useGardenData(gardenAddress)

  const errorInfo = error ? parseError(error) : null

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <GardenSearch
          onSearch={(addr) => { setGardenAddress(addr); setActiveTab('holdings') }}
          currentAddress={gardenAddress}
        />

        {isLoading && gardenAddress && (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} aria-label="Loading" />
            <p className="muted">Fetching garden data from Arbitrum One…</p>
          </div>
        )}

        {errorInfo && !isLoading && (
          <div className={styles.errorCard}>
            <p className={styles.errorTitle}>{errorInfo.title}</p>
            <p className={styles.errorBody}>{errorInfo.body}</p>
            <div className={styles.errorHint}>
              <strong>How to find your Garden address:</strong>
              <ol>
                <li>Go to <a href="https://blokcapital.io" target="_blank" rel="noopener noreferrer">blokcapital.io</a> and connect your wallet</li>
                <li>Navigate to <strong>My Garden</strong></li>
                <li>Copy the Garden contract address (starts with 0x)</li>
              </ol>
            </div>
          </div>
        )}

        {garden && !isLoading && (
          <div className={styles.dashboard}>
            {isFetching && <div className={styles.refetchBadge}>Refreshing…</div>}
            <GardenBanner garden={garden} />
            <MetricsRow garden={garden} />
            <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
            {activeTab === 'holdings'   && <HoldingsTab   garden={garden} />}
            {activeTab === 'pnl'        && <PnlTab         garden={garden} />}
            {activeTab === 'drift'      && <DriftTab        garden={garden} />}
            {activeTab === 'governance' && <GovernanceTab />}
          </div>
        )}

        {!gardenAddress && !isLoading && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} aria-hidden="true">⬡</div>
            <h2 className={styles.emptyTitle}>Track any BLOK Capital Garden</h2>
            <p className={styles.emptySub}>
              Enter a <strong>Garden contract address</strong> above — not your wallet address.
              Your Garden contract is created when you join BLOK Capital and can be found in the app under "My Garden".
            </p>
            <div className={styles.emptyCards}>
              <div className={styles.emptyCard}>
                <div className={styles.emptyCardIcon}>✗</div>
                <div className={styles.emptyCardLabel}>Wallet address</div>
                <div className={styles.emptyCardDesc}>Your MetaMask / EOA address — this will not work</div>
              </div>
              <div className={styles.emptyCard + ' ' + styles.emptyCardGreen}>
                <div className={styles.emptyCardIcon}>✓</div>
                <div className={styles.emptyCardLabel}>Garden contract address</div>
                <div className={styles.emptyCardDesc}>The Diamond proxy created for you by BLOK Capital</div>
              </div>
            </div>
            <div className={styles.emptyLinks}>
              <a href="https://blokcapital.io" target="_blank" rel="noopener noreferrer">Get a Garden →</a>
              <a href="https://docs.blokcapital.io" target="_blank" rel="noopener noreferrer">Read the docs →</a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
