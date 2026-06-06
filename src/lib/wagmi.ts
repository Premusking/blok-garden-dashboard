import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { arbitrum } from 'wagmi/chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'BLOK Capital Garden Dashboard',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo_project_id',
  chains: [arbitrum],
  ssr: false,
})
