import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom', // Simulates browser DOM
    globals: true,        // Allows using describe, test, expect globally without explicit imports
    setupFiles: './vitest.setup.ts', // Run initializations before running tests
  },
})
