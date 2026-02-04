import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,                     // allows access from network (0.0.0.0)

    // Allow ngrok domain + localhost
    allowedHosts: [
      'localhost',
      '.ngrok-free.dev',           // allows all ngrok-free subdomains
      'sturdiest-frontally-brooke.ngrok-free.dev'  // or just your specific one
    ],

    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        timeout: 1800000,
        proxyTimeout: 1800000
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        timeout: 1800000,
        proxyTimeout: 1800000
      }
    }
  }
})