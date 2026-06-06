import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import styles from './Navbar.module.css'

export function Navbar() {
  const { isConnected } = useAccount()

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <div className={styles.logoIcon}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="18" height="18" rx="5" fill="#1D9E75"/>
            <path d="M4 13 L9 5 L14 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="9" cy="5" r="1.5" fill="white"/>
          </svg>
        </div>
        <div>
          <div className={styles.logoName}>BLOK Capital</div>
          <div className={styles.logoSub}>Garden Dashboard</div>
        </div>
      </div>

      <div className={styles.right}>
        {isConnected && (
          <a
            href="https://docs.blokcapital.io"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.docsLink}
          >
            Docs ↗
          </a>
        )}
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="address"
        />
      </div>
    </nav>
  )
}
