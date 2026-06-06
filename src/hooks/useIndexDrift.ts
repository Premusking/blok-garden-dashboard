import { useQuery } from '@tanstack/react-query'
import { createPublicClient, http } from 'viem'
import { arbitrum } from 'wagmi/chains'
import { INDEX_ABI, ERC20_ABI } from '../abis'
import { fetchTokenPrices } from '../lib/prices'
import type { GardenInfo, IndexWeight } from '../types'

const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http(import.meta.env.VITE_ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc'),
})

export function useIndexDrift(garden: GardenInfo | undefined) {
  return useQuery({
    queryKey: ['indexDrift', garden?.connectedIndexAddress, garden?.address],
    enabled: !!garden?.isConnectedToIndex && !!garden?.connectedIndexAddress,
    staleTime: 60_000,
    queryFn: () => computeIndexDrift(garden!),
  })
}

async function computeIndexDrift(garden: GardenInfo): Promise<IndexWeight[]> {
  const indexAddr = garden.connectedIndexAddress!

  const [components, rawWeights] = await Promise.all([
    publicClient.readContract({ address: indexAddr, abi: INDEX_ABI, functionName: 'getComponents' }),
    publicClient.readContract({ address: indexAddr, abi: INDEX_ABI, functionName: 'getWeights' }),
  ])

  const componentAddrs = components as `0x${string}`[]
  const weights = rawWeights as bigint[]

  const symbolResults = await publicClient.multicall({
    contracts: componentAddrs.map((addr) => ({
      address: addr, abi: ERC20_ABI, functionName: 'symbol',
    })),
    allowFailure: true,
  })

  const symbols = symbolResults.map((r, i) =>
    r.status === 'success' ? r.result as string : `TOKEN_${i}`
  )

  // Fetch prices (used for future value-weighted drift calculation)
  await fetchTokenPrices(symbols)

  const totalTargetBps = weights.reduce((s, w) => s + Number(w), 0) || 10000

  const holdingByAddr = new Map(
    garden.holdings.map((h) => [h.address.toLowerCase(), h])
  )

  const driftItems: IndexWeight[] = componentAddrs.map((addr, i) => {
    const symbol = symbols[i]
    const targetBps = Math.round((Number(weights[i]) / totalTargetBps) * 10000)
    const holding = holdingByAddr.get(addr.toLowerCase())
    const currentBps = holding ? Math.round(holding.allocationPct * 100) : 0

    return {
      tokenAddress: addr,
      symbol,
      targetWeightBps: targetBps,
      currentWeightBps: currentBps,
      driftBps: currentBps - targetBps,
    }
  })

  return driftItems.sort((a, b) => Math.abs(b.driftBps) - Math.abs(a.driftBps))
}
