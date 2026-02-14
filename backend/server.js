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
      break
    }
  } catch (error) {
    // Continue to next path
  }
}

import createApp from './src/app.js'

// Start server
async function startServer() {
  try {
    // Create and start Express app
    const app = createApp()
    const PORT = process.env.PORT || 3001

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`)
    }).on('error', (err) => {
      console.error('Server error:', err)
      process.exit(1)
    })

    // Set reasonable timeouts for large file uploads (5 minutes)
    const FIVE_MINUTES = 5 * 60 * 1000
    server.timeout = FIVE_MINUTES
    server.keepAliveTimeout = FIVE_MINUTES
    server.headersTimeout = FIVE_MINUTES + 1000
    
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