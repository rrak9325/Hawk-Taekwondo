import dotenv from 'dotenv'
import createApp from './src/app.js'

// Load environment variables
dotenv.config()

const app = createApp()
const PORT = process.env.PORT || 3001

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`)
}).on('error', (err) => {
  console.error('Server error:', err)
})

// Set very high timeouts for large file uploads
server.timeout = 0 // No timeout
server.keepAliveTimeout = 0 // No timeout
server.headersTimeout = 0 // No timeout