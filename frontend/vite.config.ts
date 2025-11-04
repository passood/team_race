import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'tanstack-vendor': [
            '@tanstack/react-query',
            '@tanstack/react-router',
          ],
          'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge'],
          'date-vendor': ['date-fns'],
          'store-vendor': ['zustand'],
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 600,
  },
})
