// Main Application
// Express app configuration

import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

import { ensureDirectories, UPLOADS_PATH } from './config/database.js'
import routes from './routes/index.js'
import errorMiddleware from './middlewares/errorMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function createApp() {
  const app = express()

  // Ensure required directories exist
  ensureDirectories()

  // Security middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }))

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
  })
  app.use('/api', limiter)

  // CORS configuration
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:3000',
        process.env.FRONTEND_URL
      ]
      
      // Allow ngrok domains
      if (origin && (origin.includes('ngrok-free.dev') || origin.includes('ngrok.io') || origin.includes('ngrok.app'))) {
        return callback(null, true)
      }
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        console.log('CORS: Allowing origin:', origin)
        callback(null, true) // Allow all for development
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400 // 24 hours
  }))

  // File upload middleware - Accept any file type and size
  app.use(fileUpload({
    limits: { fileSize: Infinity }, // No file size limit
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
    safeFileNames: true,
    preserveExtension: true,
    abortOnLimit: false, // Don't abort on large files
    parseNested: true,
    createParentPath: true,
    upsert: true,
    debug: false // Set to true for debugging
  }))

  // Body parsing middleware (conditional) - No size limits
  app.use((req, res, next) => {
    if (req.path === '/api/upload' && req.method === 'POST') {
      return next()
    }
    express.json({ limit: 'Infinity' })(req, res, next)
  })

  app.use((req, res, next) => {
    if (req.path === '/api/upload' && req.method === 'POST') {
      return next()
    }
    express.urlencoded({ limit: 'Infinity', extended: true })(req, res, next)
  })

  // Serve uploaded files
  app.use('/uploads', express.static(UPLOADS_PATH, {
    maxAge: '30d',
    immutable: true,
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable')
      res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString())
      
      if (filePath.endsWith('.webp')) {
        res.setHeader('Content-Type', 'image/webp')
      }
      
      res.setHeader('Vary', 'Accept-Encoding')
    }
  }))

  // API routes
  app.use(routes)

  // Serve frontend in production
  const DIST_PATH = path.join(__dirname, '../../frontend/dist')
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(DIST_PATH, { maxAge: '1h' }))
    app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
      res.sendFile(path.join(DIST_PATH, 'index.html'))
    })
  }

  // Error handling
  app.use(errorMiddleware)

  return app
}

export default createApp