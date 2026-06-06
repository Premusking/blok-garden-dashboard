// ─── Garden / Holdings ───────────────────────────────────────────────────────

export interface TokenHolding {
  address: `0x${string}`
  symbol: string
  name: string
  decimals: number
  balance: bigint          // raw on-chain balance
  balanceFormatted: string // human-readable
  priceUsd: number
  valueUsd: number
  allocationPct: number    // 0–100
  color: string
}

export interface GardenInfo {
  address: `0x${string}`
  owner: `0x${string}`
  isConnectedToIndex: boolean
  connectedIndexAddress?: `0x${string}`
  connectedIndexName?: string
  passType?: PassType
  totalValueUsd: number
  holdings: TokenHolding[]
}

export type PassType = 'Builder' | 'Baddie' | 'Angel' | 'Quant' | 'Unknown'

// ─── Index / Drift ────────────────────────────────────────────────────────────

export interface IndexWeight {
  tokenAddress: `0x${string}`
  symbol: string
  targetWeightBps: number   // basis points, e.g. 4000 = 40%
  currentWeightBps: number
  driftBps: number          // signed, positive = overweight
}

// ─── P&L / History ───────────────────────────────────────────────────────────

export interface PnlDataPoint {
  timestamp: number   // unix seconds
  valueUsd: number
}

export type RebalanceEventType = 'buy' | 'sell' | 'rebalance' | 'deposit' | 'withdraw'

export interface RebalanceEvent {
  id: string
  txHash: `0x${string}`
  type: RebalanceEventType
  description: string
  amountUsd: number
  timestamp: number
  blockNumber: number
}

// ─── DAO Governance ──────────────────────────────────────────────────────────

export interface Proposal {
  id: string
  creator: `0x${string}`
  startDate: number
  endDate: number
  metadata: string
  executed: boolean
  votes: VoteCast[]
}

export interface VoteCast {
  proposalId: string
  voter: `0x${string}`
  voteOption: number  // 0=abstain, 1=yes, 2=no
  votingPower: bigint
  timestamp: number
}

// ─── API responses ────────────────────────────────────────────────────────────

export interface CoinGeckoPriceResponse {
  [coinId: string]: {
    usd: number
    usd_24h_change: number
  }
}

export interface SubgraphProposalResponse {
  proposalCreateds: Array<{
    id: string
    creator: string
    startDate: string
    endDate: string
    metadata: string
    blockNumber: string
    timestamp: string
  }>
  proposalExecuteds: Array<{
    id: string
    blockNumber: string
    timestamp: string
  }>
  voteCasts: Array<{
    id: string
    proposalId: string
    voter: string
    voteOption: number
    votingPower: string
    timestamp: string
  }>
}

// ── Time range (re-exported for hooks/components) ─────────────────────────────
export type TimeRange = '24h' | '7d' | '30d' | '90d'
