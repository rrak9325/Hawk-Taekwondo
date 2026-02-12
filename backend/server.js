import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from backend directory
const envPath = path.resolve(__dirname, '.env')
console.log('Loading .env from:', envPath)
const result = dotenv.config({ path: envPath })
console.log('Dotenv result:', result)
console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME)
console.log('ADMIN_PASSWORD_HASH:', process.env.ADMIN_PASSWORD_HASH)

import createApp from './src/app.js'
// Removed MongoDB imports - using mockData.json directly
import fs from 'fs'

// Removed autoMigrate function - no longer needed without MongoDB

// Start server without MongoDB
async function startServer() {
  try {
    console.log('✅ Using mockData.json directly - no database required')
    
    // Create and start Express app
    const app = createApp()
    const PORT = process.env.PORT || 3001

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('\n' + '='.repeat(60))
      console.log('🚀 SERVER STARTED SUCCESSFULLY')
      console.log('='.repeat(60))
      console.log(`📍 Backend API: http://localhost:${PORT}`)
      console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log('💾 Database: None (using mockData.json only)')
      console.log('='.repeat(60))
      console.log('\n✅ Ready to accept requests')
      console.log('   API Endpoint: http://localhost:' + PORT + '/api/data')
      console.log('   No database required - using local files')
      console.log('\n')
    }).on('error', (err) => {
      console.error('Server error:', err)
      process.exit(1)
    })

    // Set very high timeouts for large file uploads
    server.timeout = 0 // No timeout
    server.keepAliveTimeout = 0 // No timeout
    server.headersTimeout = 0 // No timeout
    
    // Graceful shutdown - no MongoDB to disconnect
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM received, shutting down gracefully...')
      server.close(() => {
        console.log('Server closed')
        process.exit(0)
      })
    })
    
    process.on('SIGINT', () => {
      console.log('👋 SIGINT received, shutting down gracefully...')
      server.close(() => {
        console.log('Server closed')
        process.exit(0)
      })
    })
    
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()