import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables - try multiple locations for Render compatibility
const possibleEnvPaths = [
  path.join(__dirname, '.env'),           // Local development
  path.join(__dirname, '../.env'),        // Render backend directory
  path.join(__dirname, '../../.env'),     // Render root directory
  path.join(__dirname, '../../../.env')   // Alternative structure
]

let envLoaded = false
let usedPath = null

for (const envPath of possibleEnvPaths) {
  try {
    const result = dotenv.config({ path: envPath })
    if (!result.error) {
      envLoaded = true
      usedPath = envPath
      console.log('✅ .env loaded from:', envPath)
      break
    }
  } catch (error) {
    // Continue to next path
  }
}

if (!envLoaded) {
  console.log('❌ .env file not found in any expected location')
  console.log('Searched paths:', possibleEnvPaths)
  console.log('⚠️  Using environment variables from Render dashboard')
} else {
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