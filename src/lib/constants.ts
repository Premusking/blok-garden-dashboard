import { arbitrum } from 'wagmi/chains'

// ── Supported networks ────────────────────────────────────────────────────────
export const SUPPORTED_CHAINS = [arbitrum] as const

// ── BLOK Capital protocol addresses on Arbitrum One ──────────────────────────
export const CONTRACTS = {
  // DAO voting plugin (from subgraph.yaml)
  VOTING_PLUGIN: '0xbe40B1D2f9f64163Ab6F0030819E89d07045d3D1' as `0x${string}`,
} as const

// ── The Graph subgraph endpoint ───────────────────────────────────────────────
export const SUBGRAPH_URL =
  import.meta.env.VITE_SUBGRAPH_URL ||
  'https://api.studio.thegraph.com/query/YOUR_ID/blokc-graph/version/latest'

// ── CoinGecko token ID map (symbol → coingecko id) ───────────────────────────
// Used to fetch USD prices. Extend as more tokens are added to indices.
export const COINGECKO_IDS: Record<string, string> = {
  ETH: 'ethereum',
  WETH: 'weth',
  BTC: 'bitcoin',
  WBTC: 'wrapped-bitcoin',
  MATIC: 'matic-network',
  LINK: 'chainlink',
  UNI: 'uniswap',
  ARB: 'arbitrum',
  OP: 'optimism',
  AAVE: 'aave',
  GMX: 'gmx',
  PENDLE: 'pendle',
  USDC: 'usd-coin',
  USDT: 'tether',
  DAI: 'dai',
}

// ── Chainlink price feed addresses on Arbitrum One ───────────────────────────
// Reference: https://docs.chain.link/data-feeds/price-feeds/addresses?network=arbitrum
export const CHAINLINK_FEEDS: Record<string, `0x${string}`> = {
  'ETH/USD':  '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612',
  'BTC/USD':  '0x6ce185860a4963106506C203335A2910413708e9',
  'LINK/USD': '0x86E53CF1B873786aC9Cc9c69c6E79C01C379C1A8',
  'ARB/USD':  '0xb2A824043730FE05F3DA2efaFa1CBbe83fa548D6',
  'UNI/USD':  '0x9C917083fDb403ab5ADbEC26Ee294f6EcAda2720',
  'AAVE/USD': '0xaD1d5344AaDE45F43E596773Bcc4c423EAbdD034',
  'GMX/USD':  '0xDB98056FecFff59D032aB628337A4887110df3dB',
}

// ── Known ERC-20 token addresses on Arbitrum One ─────────────────────────────
export const TOKEN_ADDRESSES: Record<string, `0x${string}`> = {
  WETH:  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  WBTC:  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  USDC:  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  USDT:  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  ARB:   '0x912CE59144191C1204E64559FE8253a0e49E6548',
  LINK:  '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
  UNI:   '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
  AAVE:  '0xba5DdD1f9d7F570dc94a51479a000E3BCE967196',
  GMX:   '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
  PENDLE:'0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8',
  MATIC: '0x561877b6b3DD7651313794e5F2954B714Cc129CC',
}

// ── Token display metadata ────────────────────────────────────────────────────
export const TOKEN_META: Record<string, { name: string; color: string; bg: string; tc: string }> = {
  ETH:    { name: 'Ethereum',   color: '#378ADD', bg: '#E6F1FB', tc: '#0C447C' },
  WETH:   { name: 'Wrapped ETH',color: '#378ADD', bg: '#E6F1FB', tc: '#0C447C' },
  BTC:    { name: 'Bitcoin',    color: '#EF9F27', bg: '#FAEEDA', tc: '#633806' },
  WBTC:   { name: 'Wrapped BTC',color: '#EF9F27', bg: '#FAEEDA', tc: '#633806' },
  MATIC:  { name: 'Polygon',    color: '#7F77DD', bg: '#EEEDFE', tc: '#3C3489' },
  LINK:   { name: 'Chainlink',  color: '#1D9E75', bg: '#E1F5EE', tc: '#085041' },
  UNI:    { name: 'Uniswap',    color: '#D4537E', bg: '#FBEAF0', tc: '#72243E' },
  ARB:    { name: 'Arbitrum',   color: '#5189C8', bg: '#E6F1FB', tc: '#0C447C' },
  OP:     { name: 'Optimism',   color: '#E24B4A', bg: '#FCEBEB', tc: '#791F1F' },
  AAVE:   { name: 'Aave',       color: '#B6509E', bg: '#FBEAF0', tc: '#72243E' },
  GMX:    { name: 'GMX',        color: '#1D9E75', bg: '#E1F5EE', tc: '#085041' },
  PENDLE: { name: 'Pendle',     color: '#378ADD', bg: '#E6F1FB', tc: '#0C447C' },
  USDC:   { name: 'USD Coin',   color: '#888780', bg: '#F1EFE8', tc: '#444441' },
  USDT:   { name: 'Tether',     color: '#639922', bg: '#EAF3DE', tc: '#27500A' },
  DEFAULT:{ name: 'Unknown',    color: '#888780', bg: '#F1EFE8', tc: '#444441' },
}

// ── CoinGecko API base ────────────────────────────────────────────────────────
export const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

// ── Time ranges for P&L chart ─────────────────────────────────────────────────
export type TimeRange = '24h' | '7d' | '30d' | '90d'
export const TIME_RANGES: { label: string; value: TimeRange; days: number }[] = [
  { label: '24h',  value: '24h',  days: 1  },
  { label: '7d',   value: '7d',   days: 7  },
  { label: '30d',  value: '30d',  days: 30 },
  { label: '90d',  value: '90d',  days: 90 },
]
