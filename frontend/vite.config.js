import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },

  server: {
    host: true,                     // allows access from network (0.0.0.0)
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com; media-src 'self' blob: https://res.cloudinary.com https://*.cloudinary.com; font-src 'self' data:; connect-src 'self' https://hawktaekwondo.onrender.com http://localhost:3001 https://res.cloudinary.com https://*.cloudinary.com https://api.cloudinary.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';"
    },

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
        timeout: 0, // No timeout
        proxyTimeout: 0, // No timeout
        secure: false
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        timeout: 0, // No timeout
        proxyTimeout: 0, // No timeout
        secure: false
      }
    }
  }
})