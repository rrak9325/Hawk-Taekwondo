import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // Optimize build performance
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    // esbuild is faster and included by default,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Ensure proper file extensions for modules
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },

  server: {
    host: true,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com; media-src 'self' blob: https://res.cloudinary.com https://*.cloudinary.com; font-src 'self' data:; connect-src 'self' https://hawktaekwondo.onrender.com https://hawk-taekwondo-backend.onrender.com http://localhost:3001 https://res.cloudinary.com https://*.cloudinary.com https://api.cloudinary.com; frame-src 'self' https://www.google.com https://maps.google.com; object-src 'none'; base-uri 'self'; form-action 'self';",
      // Force correct MIME types for JavaScript modules
      'X-Content-Type-Options': 'nosniff'
    },

    allowedHosts: [
      'localhost',
      '.ngrok-free.dev',
      'sturdiest-frontally-brooke.ngrok-free.dev'
    ],

    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        timeout: 0,
        proxyTimeout: 0,
        secure: false
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        timeout: 0,
        proxyTimeout: 0,
        secure: false
      }
    }
  }
})