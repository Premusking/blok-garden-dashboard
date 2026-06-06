import { useQuery } from '@tanstack/react-query'
import { fetchHistoricalPrices } from '../lib/prices'
import type { GardenInfo, PnlDataPoint, TimeRange } from '../types'

export function usePnlHistory(garden: GardenInfo | undefined, range: TimeRange) {
  return useQuery({
    queryKey: ['pnl', garden?.address, range],
    enabled: !!garden && garden.holdings.length > 0,
    staleTime: 120_000,
    queryFn: () => computePnlHistory(garden!, getDays(range)),
  })
}

function getDays(range: TimeRange): number {
  const map: Record<TimeRange, number> = { '24h': 1, '7d': 7, '30d': 30, '90d': 90 }
  return map[range]
}

async function computePnlHistory(
  garden: GardenInfo,
  days: number
): Promise<PnlDataPoint[]> {
  const priceHistories = await Promise.all(
    garden.holdings.map((h) => fetchHistoricalPrices(h.symbol, days))
  )

  const minPoints = Math.min(...priceHistories.map((h) => h.length))
  if (minPoints === 0) return []

  const result: PnlDataPoint[] = []
  for (let i = 0; i < minPoints; i++) {
    let totalValue = 0
    for (let j = 0; j < garden.holdings.length; j++) {
      const holding = garden.holdings[j]
      const historyForToken = priceHistories[j]
      const idx = Math.floor((i / minPoints) * historyForToken.length)
      const price = historyForToken[idx]?.price ?? 0
      const balance = parseFloat(holding.balanceFormatted)
      totalValue += balance * price
    }
    const entry = priceHistories[0][Math.floor((i / minPoints) * priceHistories[0].length)]
    const ts = entry?.timestamp ?? 0
    result.push({ timestamp: ts, valueUsd: totalValue })
  }

  return result
}
