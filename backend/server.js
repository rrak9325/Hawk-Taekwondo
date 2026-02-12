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

// Set reasonable timeouts for file uploads (5 minutes)
server.timeout = 5 * 60 * 1000 // 5 minutes
server.keepAliveTimeout = 65 * 1000 // 65 seconds (slightly more than default)
server.headersTimeout = 66 * 1000 // 66 seconds (slightly more than keepAliveTimeout)