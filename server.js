import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import bcrypt from 'bcryptjs'
import os from 'os'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

const DATA_PATH = path.join(__dirname, '..', 'frontend', 'public', 'mockData.json')
const UPLOADS_PATH = path.join(__dirname, '..', 'frontend', 'public', 'uploads')

// Make sure upload folder exists
if (!fs.existsSync(UPLOADS_PATH)) {
  fs.mkdirSync(UPLOADS_PATH, { recursive: true })
}

// Dynamic import for Sharp (better ES module compatibility)
let sharp
try {
  const sharpModule = await import('sharp')
  sharp = sharpModule.default
  console.log('✅ Sharp loaded successfully!')
} catch (error) {
  console.error('❌ Failed to load Sharp:', error.message)
  console.log('📸 Image optimization will be disabled')
}

// ────────────────────────────────────────
// PROFESSIONAL IMAGE OPTIMIZATION CONFIG
// ────────────────────────────────────────
const IMAGE_CONFIGS = {
  // Hero/Banner images - High quality
  hero: {
    width: 1920,
    height: 1080,
    quality: 85,
    formats: ['webp', 'jpg']
  },
  // Gallery images - Medium quality
  gallery: {
    width: 800,
    height: 600,
    quality: 80,
    formats: ['webp', 'jpg']
  },
  // Thumbnails - Small size
  thumbnail: {
    width: 400,
    height: 300,
    quality: 75,
    formats: ['webp', 'jpg']
  },
  // Profile images - Square
  profile: {
    width: 400,
    height: 400,
    quality: 80,
    formats: ['webp', 'jpg']
  }
}

// Advanced image processing function
async function processImage(inputBuffer, config, filename) {
  if (!sharp) {
    throw new Error('Image processing not available - Sharp not loaded')
  }

  const results = []
  const baseFilename = path.parse(filename).name
  
  try {
    // Get image metadata
    const metadata = await sharp(inputBuffer).metadata()
    console.log(`🖼️ Processing image: ${filename} (${metadata.width}x${metadata.height}, ${metadata.format})`)
    
    // Process each format
    for (const format of config.formats) {
      let pipeline = sharp(inputBuffer)
        .resize(config.width, config.height, {
          fit: 'cover',
          position: 'center',
          withoutEnlargement: false
        })
        .sharpen()
      
      // Apply format-specific optimizations
      if (format === 'webp') {
        pipeline = pipeline.webp({
          quality: config.quality,
          effort: 6, // Maximum compression effort
          smartSubsample: true
        })
      } else if (format === 'jpg' || format === 'jpeg') {
        pipeline = pipeline.jpeg({
          quality: config.quality,
          progressive: true,
          mozjpeg: true // Use mozjpeg encoder for better compression
        })
      } else if (format === 'png') {
        pipeline = pipeline.png({
          quality: config.quality,
          compressionLevel: 9,
          progressive: true
        })
      }
      
      const outputFilename = `${baseFilename}-${config.width}x${config.height}.${format}`
      const outputPath = path.join(UPLOADS_PATH, outputFilename)
      
      // Process and save
      await pipeline.toFile(outputPath)
      
      // Get file stats
      const stats = fs.statSync(outputPath)
      const originalSize = inputBuffer.length
      const newSize = stats.size
      const compressionRatio = ((originalSize - newSize) / originalSize * 100).toFixed(1)
      
      console.log(`✅ Created ${outputFilename} - ${newSize} bytes (${compressionRatio}% smaller)`)
      
      results.push({
        format,
        filename: outputFilename,
        url: `/uploads/${outputFilename}`,
        size: newSize,
        dimensions: `${config.width}x${config.height}`,
        compressionRatio
      })
    }
    
    return results
  } catch (error) {
    console.error('💥 Image processing error:', error)
    throw new Error(`Image processing failed: ${error.message}`)
  }
}

// Smart image type detection
function detectImageType(filename, size) {
  const name = filename.toLowerCase()
  
  // Hero/Banner detection
  if (name.includes('hero') || name.includes('banner') || name.includes('background')) {
    return 'hero'
  }
  
  // Profile/Avatar detection
  if (name.includes('profile') || name.includes('avatar') || name.includes('instructor') || name.includes('staff')) {
    return 'profile'
  }
  
  // Large images go to gallery
  if (size > 2 * 1024 * 1024) { // > 2MB
    return 'gallery'
  }
  
  // Default to thumbnail for smaller images
  return 'thumbnail'
}

// ────────────────────────────────────────
// Middleware
// ────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ];
    
    // Check if the origin includes ngrok domains (dynamic)
    if (origin && (origin.includes('ngrok-free.dev') || origin.includes('ngrok.io') || origin.includes('ngrok.app'))) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Allow all origins for development, but log them
      console.log('CORS: Allowing origin:', origin);
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

// BEAST MODE File upload setup - 200MB max for high-quality images
app.use(fileUpload({
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB for RAW images
  useTempFiles: true,
  tempFileDir: os.tmpdir(),
  safeFileNames: true,
  preserveExtension: true,
  abortOnLimit: true,
  parseNested: true,
  debug: false,
  // Advanced options for large files
  createParentPath: true,
  upsert: true
}))

// JSON parsing AFTER file upload middleware - with conditional parsing
app.use((req, res, next) => {
  // Skip JSON parsing for file uploads
  if (req.path === '/api/upload' && req.method === 'POST') {
    return next()
  }
  
  // Apply JSON parsing for other routes
  express.json({ limit: '50mb' })(req, res, next)
})

app.use((req, res, next) => {
  // Skip URL encoding for file uploads
  if (req.path === '/api/upload' && req.method === 'POST') {
    return next()
  }
  
  // Apply URL encoding for other routes
  express.urlencoded({ limit: '50mb', extended: true })(req, res, next)
})

// Serve uploaded media with AGGRESSIVE caching and optimization
app.use('/uploads', express.static(UPLOADS_PATH, {
  maxAge: '30d', // 30 days cache
  immutable: true,
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Set aggressive caching for images
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable'); // 30 days
    res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());
    
    // Set proper MIME types for WebP
    if (filePath.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }
    
    // Enable compression
    res.setHeader('Vary', 'Accept-Encoding');
  }
}))

// Serve frontend build in production
const DIST_PATH = path.join(__dirname, 'dist')
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH, { maxAge: '1h' }))
  app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
    res.sendFile(path.join(DIST_PATH, 'index.html'))
  })
}

// ────────────────────────────────────────
// Admin Auth (way better now)
// ────────────────────────────────────────
if (!process.env.ADMIN_PASS_HASH) {
  console.error('Missing ADMIN_PASS_HASH in .env — generate one with bcrypt')
  process.exit(1)
}

const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH

let loginAttempts = {}
let activeSessions = new Set() // still in-memory (restart = logout everyone)

// Rate limiting for login attempts
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization
  if (activeSessions.has(token)) return next()
  return res.status(401).json({ error: 'Unauthorized' })
}

// ────────────────────────────────────────
// Auth Routes
// ────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const clientIP = req.ip || req.connection.remoteAddress
  
  console.log('Login attempt:', username, 'from', clientIP)
  
  // Check rate limiting
  const attemptKey = `${clientIP}_${username}`
  const now = Date.now()
  
  if (loginAttempts[attemptKey]) {
    const { count, lastAttempt } = loginAttempts[attemptKey]
    
    // Reset attempts if lockout time has passed
    if (now - lastAttempt > LOCKOUT_TIME) {
      delete loginAttempts[attemptKey]
    } else if (count >= MAX_LOGIN_ATTEMPTS) {
      const remainingTime = Math.ceil((LOCKOUT_TIME - (now - lastAttempt)) / 1000 / 60)
      return res.status(429).json({ 
        error: `Too many login attempts. Try again in ${remainingTime} minutes.` 
      })
    }
  }
  
  if (username === ADMIN_USER && bcrypt.compareSync(password, ADMIN_PASS_HASH)) {
    // Successful login - clear attempts
    delete loginAttempts[attemptKey]
    
    const token = crypto.randomBytes(32).toString('hex')
    activeSessions.add(token)
    console.log('Login successful, token:', token)
    return res.json({ success: true, token })
  }
  
  // Failed login - increment attempts
  if (!loginAttempts[attemptKey]) {
    loginAttempts[attemptKey] = { count: 0, lastAttempt: now }
  }
  loginAttempts[attemptKey].count++
  loginAttempts[attemptKey].lastAttempt = now
  
  console.log('Login failed for:', username, `(${loginAttempts[attemptKey].count}/${MAX_LOGIN_ATTEMPTS} attempts)`)
  res.status(401).json({ error: 'Invalid credentials' })
})

app.post('/api/logout', (req, res) => {
  const token = req.headers.authorization
  if (token) {
    activeSessions.delete(token)
  }
  res.json({ success: true })
})

// ────────────────────────────────────────
// Data Routes
// ────────────────────────────────────────
app.get('/api/data', (req, res) => {
  if (!fs.existsSync(DATA_PATH)) return res.status(404).json({ error: 'Data not found' })
  
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Read failed' })
    try {
      res.json(JSON.parse(data))
    } catch {
      res.status(500).json({ error: 'Invalid JSON' })
    }
  })
})

app.post('/api/data', authMiddleware, (req, res) => {
  const newData = req.body
  if (!newData || typeof newData !== 'object' || Object.keys(newData).length === 0) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  // Rough size limit ~10MB JSON
  if (JSON.stringify(newData).length > 10 * 1024 * 1024) {
    return res.status(413).json({ error: 'Payload too large' })
  }

  const backupPath = `${DATA_PATH}.bak`
  try {
    if (fs.existsSync(DATA_PATH)) fs.copyFileSync(DATA_PATH, backupPath)
    fs.writeFileSync(DATA_PATH, JSON.stringify(newData, null, 2))
    res.json({ success: true })
  } catch (err) {
    console.error('[SAVE ERROR]', err)
    res.status(500).json({ error: 'Failed to save data' })
  }
})

// ────────────────────────────────────────
// 🔥 ULTIMATE IMAGE UPLOAD & OPTIMIZATION SYSTEM 🔥
// ────────────────────────────────────────
app.post('/api/upload', authMiddleware, async (req, res) => {
  try {
    console.log('🚀 BEAST MODE Upload request received')
    console.log('Files:', req.files ? Object.keys(req.files) : 'none')
    console.log('Body:', req.body)

    if (!req.files || !req.files.file) {
      console.log('❌ No file in request')
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const file = req.files.file
    const originalSize = file.size
    const originalName = file.name
    
    console.log('📁 File details:', {
      name: originalName,
      size: `${(originalSize / 1024 / 1024).toFixed(2)}MB`,
      mimetype: file.mimetype
    })

    // Validate file type
    const ext = path.extname(originalName).toLowerCase()
    const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff']
    const videoExts = ['.mp4', '.webm', '.mov', '.avi']
    const allowedExts = [...imageExts, ...videoExts]

    if (!allowedExts.includes(ext)) {
      console.log('❌ Invalid file type:', ext)
      return res.status(400).json({ 
        error: `Invalid file type: ${ext}. Allowed: ${allowedExts.join(', ')}` 
      })
    }

    // Handle video files (no processing needed)
    if (videoExts.includes(ext)) {
      console.log('🎥 Processing video file...')
      
      // Check video size (200MB limit for videos)
      const maxVideoSize = 200 * 1024 * 1024 // 200MB
      if (originalSize > maxVideoSize) {
        return res.status(400).json({ 
          error: `Video file too large. Maximum size is ${Math.round(maxVideoSize / 1024 / 1024)}MB` 
        })
      }

      const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase()}`
      const uploadPath = path.join(UPLOADS_PATH, safeName)
      
      await file.mv(uploadPath)
      
      console.log('✅ Video upload successful:', safeName)
      return res.json({ 
        url: `/uploads/${safeName}`,
        type: 'video',
        originalSize: originalSize,
        filename: safeName
      })
    }

    // 🔥 ADVANCED IMAGE PROCESSING 🔥
    console.log('🖼️ Processing image with BEAST MODE optimization...')
    
    // Read file buffer
    let fileBuffer
    if (file.tempFilePath) {
      fileBuffer = fs.readFileSync(file.tempFilePath)
    } else {
      fileBuffer = file.data
    }

    // Detect optimal image type based on filename and size
    const imageType = detectImageType(originalName, originalSize)
    const config = IMAGE_CONFIGS[imageType]
    
    console.log(`🎯 Detected image type: ${imageType}`)
    console.log(`⚙️ Using config:`, config)

    // Process image with multiple formats and sizes
    const processedImages = await processImage(fileBuffer, config, originalName)
    
    // Calculate total compression savings
    const totalNewSize = processedImages.reduce((sum, img) => sum + img.size, 0)
    const totalSavings = ((originalSize - totalNewSize) / originalSize * 100).toFixed(1)
    
    console.log(`💾 Original size: ${(originalSize / 1024 / 1024).toFixed(2)}MB`)
    console.log(`💾 Total new size: ${(totalNewSize / 1024 / 1024).toFixed(2)}MB`)
    console.log(`🎉 Total savings: ${totalSavings}%`)
    
    // Return the best format (WebP if available, otherwise first format)
    const bestImage = processedImages.find(img => img.format === 'webp') || processedImages[0]
    
    // Clean up temp file
    if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
      fs.unlinkSync(file.tempFilePath)
    }
    
    console.log('✅ BEAST MODE processing complete!')
    
    res.json({
      url: bestImage.url,
      type: 'image',
      originalSize: originalSize,
      optimizedSize: bestImage.size,
      compressionRatio: bestImage.compressionRatio,
      format: bestImage.format,
      dimensions: bestImage.dimensions,
      filename: bestImage.filename,
      allFormats: processedImages, // Include all generated formats
      savings: `${totalSavings}%`
    })

  } catch (err) {
    console.error('💥 [BEAST MODE UPLOAD ERROR]', err)
    
    // Clean up temp file on error
    if (req.files?.file?.tempFilePath && fs.existsSync(req.files.file.tempFilePath)) {
      try {
        fs.unlinkSync(req.files.file.tempFilePath)
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr)
      }
    }
    
    res.status(500).json({ 
      error: 'Upload failed: ' + err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
  }
})

// ────────────────────────────────────────
// Enhanced Delete File with Multi-format Support
// ────────────────────────────────────────
app.delete('/api/file', authMiddleware, (req, res) => {
  const { filePath } = req.body
  if (!filePath) return res.status(400).json({ error: 'filePath required' })

  try {
    const fileName = path.basename(filePath)
    const baseName = path.parse(fileName).name
    const fullPath = path.join(UPLOADS_PATH, fileName)
    
    let deletedFiles = []
    
    // Delete the main file
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
      deletedFiles.push(fileName)
    }
    
    // Delete related optimized versions (if any)
    const files = fs.readdirSync(UPLOADS_PATH)
    const relatedFiles = files.filter(file => {
      const fileBaseName = path.parse(file).name
      return fileBaseName.startsWith(baseName.split('-')[0]) && file !== fileName
    })
    
    relatedFiles.forEach(relatedFile => {
      const relatedPath = path.join(UPLOADS_PATH, relatedFile)
      if (fs.existsSync(relatedPath)) {
        fs.unlinkSync(relatedPath)
        deletedFiles.push(relatedFile)
      }
    })
    
    console.log(`🗑️ Deleted files:`, deletedFiles)
    
    res.json({ 
      success: true, 
      deletedFiles: deletedFiles,
      message: `Deleted ${deletedFiles.length} file(s)`
    })
  } catch (err) {
    console.error('Delete error:', err)
    res.status(500).json({ error: 'Delete failed: ' + err.message })
  }
})

// ────────────────────────────────────────
// Cleanup Orphan Files (merged endpoints)
// ────────────────────────────────────────
app.post('/api/cleanup', authMiddleware, (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))
    const dataStr = JSON.stringify(data)
    const files = fs.readdirSync(UPLOADS_PATH)

    const used = new Set()
    const regex = /\/uploads\/([^"'\s]+)/g
    let m
    while ((m = regex.exec(dataStr)) !== null) {
      used.add(m[1])
    }

    let deleted = 0
    for (const file of files) {
      if (!used.has(file)) {
        fs.unlinkSync(path.join(UPLOADS_PATH, file))
        deleted++
      }
    }

    res.json({ success: true, deletedCount: deleted })
  } catch (err) {
    console.error('[CLEANUP ERROR]', err)
    res.status(500).json({ error: err.message })
  }
})

// ────────────────────────────────────────
// Error handler + long timeout (but not insane)
// ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err)
  res.status(500).json({ error: 'Server error' })
})

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server live → http://localhost:${PORT}`)
}).on('error', (err) => {
  console.error('Server error:', err)
})

server.timeout = 20 * 60 * 1000          // 20 min — still long but safer
server.keepAliveTimeout = 20 * 60 * 1000
server.headersTimeout = 20 * 60 * 1000