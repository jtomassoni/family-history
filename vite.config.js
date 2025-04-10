import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,     // or whichever port you prefer
    watch: {
      usePolling: true, // Enable polling for file system events
    },
  },
  optimizeDeps: {
    include: ['vue'],
  },
})
