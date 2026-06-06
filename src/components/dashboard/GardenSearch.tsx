import { useState } from 'react'
import { isAddress } from 'viem'
import { useAccount } from 'wagmi'
import styles from './GardenSearch.module.css'

interface Props {
  onSearch: (address: string) => void
  currentAddress: string | null
}

export function GardenSearch({ onSearch, currentAddress }: Props) {
  const { address: walletAddress } = useAccount()
  const [input, setInput] = useState(currentAddress ?? '')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!isAddress(trimmed)) {
      setError('Enter a valid Ethereum address (0x…)')
      return
    }
    setError('')
    onSearch(trimmed)
  }

  function useMyWallet() {
    if (walletAddress) {
      setInput(walletAddress)
      setError('')
      onSearch(walletAddress)
    }
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputWrap}>
          <span className={styles.icon} aria-hidden="true">⬡</span>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter Garden contract address (0x…)"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError('') }}
            spellCheck={false}
            autoComplete="off"
          />
          {walletAddress && (
            <button type="button" className={styles.myWallet} onClick={useMyWallet}>
              My wallet
            </button>
          )}
        </div>
        <button className={styles.loadBtn} type="submit">
          Load Garden →
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <p className={styles.hint}>
        Your Garden is a personal Diamond proxy deployed by the BLOK Capital protocol.
        {!walletAddress && ' Connect your wallet to auto-fill your address.'}
      </p>
    </div>
  )
}
