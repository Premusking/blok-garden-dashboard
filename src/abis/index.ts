// Minimal ABI covering the Garden Diamond read surface:
//   - DiamondLoupe  (EIP-2535 introspection)
//   - Ownership     (ERC-173)
//   - IndexFacet    (BLOK Capital index connectivity)
//   - ERC-20        (token balances, used against each holding address)

export const GARDEN_ABI = [
  // ── DiamondLoupe ──────────────────────────────────────────────────────────
  {
    inputs: [],
    name: 'facets',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'facetAddress', type: 'address' },
          { internalType: 'bytes4[]', name: 'functionSelectors', type: 'bytes4[]' },
        ],
        internalType: 'struct IDiamondLoupe.Facet[]',
        name: 'facets_',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: '_functionSelector', type: 'bytes4' }],
    name: 'facetAddress',
    outputs: [{ internalType: 'address', name: 'facetAddress_', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },

  // ── Ownership (ERC-173) ───────────────────────────────────────────────────
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: 'owner_', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },

  // ── IndexFacet ────────────────────────────────────────────────────────────
  {
    inputs: [],
    name: 'isConnectedToIndex',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getConnectedIndex',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },

  // ── Events emitted by the Garden ─────────────────────────────────────────
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'index', type: 'address' },
    ],
    name: 'IndexConnected',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'IndexDisconnected',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address[]', name: 'tokens', type: 'address[]' },
      { indexed: false, internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
    ],
    name: 'Rebalanced',
    type: 'event',
  },
] as const

// ── ERC-20 minimal ABI (balance + metadata) ──────────────────────────────────
export const ERC20_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// ── Index contract ABI (components + weights) ─────────────────────────────────
export const INDEX_ABI = [
  {
    inputs: [],
    name: 'getComponents',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getWeights',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// ── Chainlink AggregatorV3 ABI (price feeds) ──────────────────────────────────
export const CHAINLINK_ABI = [
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { internalType: 'uint80', name: 'roundId', type: 'uint80' },
      { internalType: 'int256', name: 'answer', type: 'int256' },
      { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
