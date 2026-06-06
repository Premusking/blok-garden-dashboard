import { COINGECKO_BASE, COINGECKO_IDS } from './constants'
import type { CoinGeckoPriceResponse } from '../types'

let _cache: { data: CoinGeckoPriceResponse; ts: number } | null = null

export async function fetchTokenPrices(symbols: string[]): Promise<CoinGeckoPriceResponse> {
  const now = Date.now()
  if (_cache && now - _cache.ts < 60_000) return _cache.data

  const ids = symbols
    .map((s) => COINGECKO_IDS[s.toUpperCase()])
    .filter(Boolean)

  if (ids.length === 0) return {}

  try {
    const apiKey = import.meta.env.VITE_COINGECKO_API_KEY
    const url =
      `${COINGECKO_BASE}/simple/price` +
      `?ids=${ids.join(',')}` +
      `&vs_currencies=usd` +
      `&include_24hr_change=true` +
      (apiKey ? `&x_cg_pro_api_key=${apiKey}` : '')

    const res = await fetch(url)
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`)

    const data: CoinGeckoPriceResponse = await res.json()
    _cache = { data, ts: now }
    return data
  } catch (err) {
    console.warn('[prices] CoinGecko fetch failed, returning mock prices', err)
    return getMockPrices(symbols)
  }
}

export function getPriceForSymbol(prices: CoinGeckoPriceResponse, symbol: string): number {
  const id = COINGECKO_IDS[symbol.toUpperCase()]
  return prices[id]?.usd ?? 0
}

export function get24hChangeForSymbol(prices: CoinGeckoPriceResponse, symbol: string): number {
  const id = COINGECKO_IDS[symbol.toUpperCase()]
  return prices[id]?.usd_24h_change ?? 0
}

export async function fetchHistoricalPrices(
  symbol: string,
  days: number
): Promise<Array<{ timestamp: number; price: number }>> {
  const id = COINGECKO_IDS[symbol.toUpperCase()]
  if (!id) return getMockHistory(days)

  try {
    const apiKey = import.meta.env.VITE_COINGECKO_API_KEY
    const url =
      `${COINGECKO_BASE}/coins/${id}/market_chart` +
      `?vs_currency=usd&days=${days}&interval=${days <= 1 ? 'hourly' : 'daily'}` +
      (apiKey ? `&x_cg_pro_api_key=${apiKey}` : '')

    const res = await fetch(url)
    if (!res.ok) throw new Error(`CoinGecko history ${res.status}`)

    const data = await res.json()
    return (data.prices as [number, number][]).map(([ts, price]) => ({
      timestamp: Math.floor(ts / 1000),
      price,
    }))
  } catch (err) {
    console.warn('[prices] Historical fetch failed, using mock data', err)
    return getMockHistory(days)
  }
}

const MOCK_PRICES: Record<string, number> = {
  ETH: 3200, WETH: 3200, BTC: 65000, WBTC: 65000,
  MATIC: 0.75, LINK: 14.2, UNI: 7.4, ARB: 1.05,
  OP: 2.1, AAVE: 88, GMX: 24, PENDLE: 3.8,
  USDC: 1, USDT: 1, DAI: 1,
}

function getMockPrices(symbols: string[]): CoinGeckoPriceResponse {
  const result: CoinGeckoPriceResponse = {}
  for (const sym of symbols) {
    const id = COINGECKO_IDS[sym.toUpperCase()] ?? sym.toLowerCase()
    result[id] = {
      usd: MOCK_PRICES[sym.toUpperCase()] ?? 1,
      usd_24h_change: (Math.random() - 0.4) * 10,
    }
  }
  return result
}

function getMockHistory(days: number): Array<{ timestamp: number; price: number }> {
  const now = Math.floor(Date.now() / 1000)
  const points = days <= 1 ? 24 : days
  const interval = days <= 1 ? 3600 : 86400
  let price = 44000
  return Array.from({ length: points }, (_, i) => {
    price += (Math.random() - 0.45) * 800
    return { timestamp: now - (points - i) * interval, price: Math.max(price, 30000) }
  })
}
