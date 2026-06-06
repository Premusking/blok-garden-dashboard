import '@rainbow-me/rainbowkit/styles.css'
import './index.css'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { wagmiConfig } from './lib/wagmi'
import { DashboardPage } from './pages/DashboardPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#1D9E75',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
        >
          <DashboardPage />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
