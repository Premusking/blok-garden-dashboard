import { useQuery } from '@tanstack/react-query'
import { createPublicClient, http, formatUnits, isAddress } from 'viem'
import { arbitrum } from 'wagmi/chains'
import { GARDEN_ABI, ERC20_ABI, INDEX_ABI } from '../abis'
import { TOKEN_ADDRESSES, TOKEN_META } from '../lib/constants'
import { fetchTokenPrices, getPriceForSymbol } from '../lib/prices'
import type { GardenInfo, TokenHolding } from '../types'

// ── Public client (read-only, no wallet needed) ───────────────────────────────
const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http(
    import.meta.env.VITE_ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc'
  ),
})

// ── Main hook ─────────────────────────────────────────────────────────────────
export function useGardenData(gardenAddress: string | null) {
  return useQuery({
    queryKey: ['garden', gardenAddress],
    enabled: !!gardenAddress && isAddress(gardenAddress),
    staleTime: 30_000,
    retry: 2,
    queryFn: () => fetchGardenData(gardenAddress as `0x${string}`),
  })
}

async function fetchGardenData(gardenAddress: `0x${string}`): Promise<GardenInfo> {
  // Step 1: Read owner + index connectivity from the Diamond
  const [owner, isConnected] = await Promise.all([
    publicClient.readContract({
      address: gardenAddress,
      abi: GARDEN_ABI,
      functionName: 'owner',
    }),
    publicClient.readContract({
      address: gardenAddress,
      abi: GARDEN_ABI,
      functionName: 'isConnectedToIndex',
    }).catch(() => false),
  ])

  // Step 2: Get connected index address (if any)
  let connectedIndexAddress: `0x${string}` | undefined
  let connectedIndexName: string | undefined
  let indexComponents: string[] = []

  if (isConnected) {
    try {
      connectedIndexAddress = await publicClient.readContract({
        address: gardenAddress,
        abi: GARDEN_ABI,
        functionName: 'getConnectedIndex',
      }) as `0x${string}`

      const [name, components] = await Promise.all([
        publicClient.readContract({
          address: connectedIndexAddress,
          abi: INDEX_ABI,
          functionName: 'name',
        }),
        publicClient.readContract({
          address: connectedIndexAddress,
          abi: INDEX_ABI,
          functionName: 'getComponents',
        }),
      ])
      connectedIndexName = name as string
      indexComponents = components as string[]
    } catch {
      // Index read failed — continue without it
    }
  }

  // Step 3: Determine which tokens to check
  // Priority: index components → known protocol tokens
  const tokenAddressesToCheck = indexComponents.length > 0
    ? indexComponents as `0x${string}`[]
    : Object.values(TOKEN_ADDRESSES)

  // Step 4: Multicall – balance + symbol + decimals for each token
  const calls = tokenAddressesToCheck.flatMap((addr) => [
    { address: addr, abi: ERC20_ABI, functionName: 'balanceOf', args: [gardenAddress] },
    { address: addr, abi: ERC20_ABI, functionName: 'symbol' },
    { address: addr, abi: ERC20_ABI, functionName: 'decimals' },
    { address: addr, abi: ERC20_ABI, functionName: 'name' },
  ])

  const results = await publicClient.multicall({ contracts: calls as any[], allowFailure: true })

  // Step 5: Parse multicall results
  const tokensWithBalance: Array<{
    address: `0x${string}`; symbol: string; name: string
    decimals: number; balance: bigint
  }> = []

  for (let i = 0; i < tokenAddressesToCheck.length; i++) {
    const base = i * 4
    const balance = results[base].status === 'success' ? results[base].result as bigint : 0n
    if (balance === 0n) continue

    const symbol   = results[base + 1].status === 'success' ? results[base + 1].result as string : '???'
    const decimals = results[base + 2].status === 'success' ? results[base + 2].result as number : 18
    const name     = results[base + 3].status === 'success' ? results[base + 3].result as string : symbol

    tokensWithBalance.push({ address: tokenAddressesToCheck[i], symbol, name, decimals, balance })
  }

  // Step 6: Fetch prices for tokens found
  const symbols = tokensWithBalance.map((t) => t.symbol)
  const prices = await fetchTokenPrices(symbols)

  // Step 7: Build holdings with USD values
  const holdings: TokenHolding[] = tokensWithBalance.map((t) => {
    const formatted = parseFloat(formatUnits(t.balance, t.decimals))
    const price = getPriceForSymbol(prices, t.symbol)
    const valueUsd = formatted * price
    const meta = TOKEN_META[t.symbol.toUpperCase()] ?? TOKEN_META['DEFAULT']
    return {
      address: t.address,
      symbol: t.symbol,
      name: t.name,
      decimals: t.decimals,
      balance: t.balance,
      balanceFormatted: formatted.toFixed(4),
      priceUsd: price,
      valueUsd,
      allocationPct: 0, // computed below
      color: meta.color,
    }
  }).sort((a, b) => b.valueUsd - a.valueUsd)

  const totalValueUsd = holdings.reduce((sum, h) => sum + h.valueUsd, 0)
  holdings.forEach((h) => {
    h.allocationPct = totalValueUsd > 0 ? (h.valueUsd / totalValueUsd) * 100 : 0
  })

  return {
    address: gardenAddress,
    owner: owner as `0x${string}`,
    isConnectedToIndex: isConnected as boolean,
    connectedIndexAddress,
    connectedIndexName,
    totalValueUsd,
    holdings,
  }
}
