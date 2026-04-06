import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import scssTokensPlugin from './build/vite-plugin-scss-tokens'

export default defineConfig({
  plugins: [react(), scssTokensPlugin()],
  test: {
    environment: 'node',
  },
})
