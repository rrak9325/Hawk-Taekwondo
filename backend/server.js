import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables - .env is in the same directory as server.js
const envPath = path.join(__dirname, '.env')
console.log('Loading .env from:', envPath)
const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error('Error loading .env:', result.error)
} else {
  console.log('✅ .env loaded successfully')
  console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set')
}

import createApp from './src/app.js'

// Start server
async function startServer() {
  try {
    // Create and start Express app
    const app = createApp()
    const PORT = process.env.PORT || 3001

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(60))
      console.log('SERVER STARTED')
      console.log('='.repeat(60))
      console.log(`Backend API: http://localhost:${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log('='.repeat(60))
    }).on('error', (err) => {
      console.error('Server error:', err)
      process.exit(1)
    })

    // Set very high timeouts for large file uploads
    server.timeout = 0
    server.keepAliveTimeout = 0
    server.headersTimeout = 0
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...')
      server.close(() => {
        console.log('Server closed')
        process.exit(0)
      })
    })
    
    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully...')
      server.close(() => {
        console.log('Server closed')
        process.exit(0)
      })
    })
    
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()