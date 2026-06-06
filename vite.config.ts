import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // viem / wagmi need these polyfills in some bundler setups
      'node:buffer': 'buffer',
      'node:process': 'process/browser',
    },
  },
})
