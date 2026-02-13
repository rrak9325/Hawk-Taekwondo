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
import { sanitizeInput } from './utils/security.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function createApp() {
  const app = express()

  // Ensure required directories exist
  ensureDirectories()

  // Security middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          "'self'", 
          "data:", 
          "blob:",
          "https://res.cloudinary.com",
          "https://*.cloudinary.com"
        ],
        mediaSrc: [
          "'self'", 
          "blob:",
          "https://res.cloudinary.com",
          "https://*.cloudinary.com"
        ],
        fontSrc: ["'self'", "data:"],
        connectSrc: [
          "'self'", 
          "https://hawktaekwondo.onrender.com", 
          "http://localhost:3001",
          "https://res.cloudinary.com",
          "https://*.cloudinary.com",
          "https://api.cloudinary.com"
        ],
        frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },

  }))

  // General API rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
  })
  app.use('/api', limiter)

  // Strict rate limiting for login endpoint (brute-force protection)
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Only 5 login attempts per 15 minutes per IP
    skipSuccessfulRequests: true, // Don't count successful logins
    message: 'Too many login attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  })
  app.use('/api/login', loginLimiter)

  // Body parsing middleware - Always parse JSON and URL-encoded
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))

  // Security middleware - Input sanitization for all requests (AFTER body parsing)
  app.use((req, res, next) => {
    // Sanitize query parameters (create new sanitized object)
    if (req.query) {
      const sanitizedQuery = sanitizeInput(req.query)
      // Replace the query object
      Object.keys(req.query).forEach(key => {
        delete req.query[key]
      })
      Object.assign(req.query, sanitizedQuery)
    }
    
    // Sanitize body (except for file uploads and already parsed JSON)
    if (req.body && typeof req.body === 'object' && !req.files) {
      const sanitizedBody = sanitizeInput(req.body)
      // Replace the body object
      Object.keys(req.body).forEach(key => {
        delete req.body[key]
      })
      Object.assign(req.body, sanitizedBody)
    }
    
    next()
  })
  
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

  // File upload middleware - SAFE file size limits and validation
  app.use(fileUpload({
    limits: { 
      fileSize: 50 * 1024 * 1024, // 50MB limit per file
      files: 10 // Max 10 files per request
    },
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
    safeFileNames: true,
    preserveExtension: true,
    abortOnLimit: true, // Abort on size limit exceeded
    parseNested: true,
    createParentPath: true,
    upsert: true,
    debug: false
  }))

  // Serve uploaded files
  app.use('/uploads', express.static(UPLOADS_PATH, {
    maxAge: '30d',
    immutable: true,
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable')
      res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString())
      
      // Set proper MIME types to prevent Brave browser issues
      if (filePath.endsWith('.webp')) {
        res.setHeader('Content-Type', 'image/webp')
      } else if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript')
      } else if (filePath.endsWith('.mjs')) {
        res.setHeader('Content-Type', 'application/javascript')
      }
      
      res.setHeader('Vary', 'Accept-Encoding')
    }
  }))

  // API routes
  app.use(routes)

  // Serve frontend in production
  const DIST_PATH = path.join(__dirname, '../../frontend/dist')
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(DIST_PATH, { 
      maxAge: '1h',
      setHeaders: (res, filePath) => {
        // Force correct MIME types for JavaScript modules (Brave browser fix)
        if (filePath.endsWith('.js') || /\/assets\/.*\.js$/.test(filePath)) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        } else if (filePath.endsWith('.mjs')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        } else if (filePath.endsWith('.css') || /\/assets\/.*\.css$/.test(filePath)) {
          res.setHeader('Content-Type', 'text/css; charset=utf-8')
        } else if (filePath.endsWith('.json')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
        }
        res.setHeader('X-Content-Type-Options', 'nosniff')
      }
    }))
    app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
      res.sendFile(path.join(DIST_PATH, 'index.html'))
    })
  }

  // Error handling
  app.use(errorMiddleware)

  return app
}

export default createApp