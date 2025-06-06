import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,     // or whichever port you prefer
    watch: {
      usePolling: true, // Enable polling for file system events
    },
    proxy: {
      '/api': 'http://127.0.0.1:8000'
    }
  },
  optimizeDeps: {
    include: ['vue'],
  },
})
