// Main Routes
// Combines all route modules

import { Router } from 'express'
import authRoutes from './authRoutes.js'
import dataRoutes from './dataRoutes.js'
import uploadRoutes from './uploadRoutes.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync } from 'fs'
import os from 'os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router()

// Health check endpoint - Production monitoring ready
router.get('/health', (req, res) => {
  try {
    const startTime = process.uptime()
    const memoryUsage = process.memoryUsage()
    const uploadsDir = `${__dirname}/../../uploads`
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(startTime),
      version: process.env.npm_package_version || '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        external: Math.round(memoryUsage.external / 1024 / 1024) + 'MB'
      },
      system: {
        cpus: os.cpus().length,
        loadavg: os.loadavg(),
        totalmem: Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB',
        freemem: Math.round(os.freemem() / 1024 / 1024 / 1024) + 'GB'
      },
      services: {
        uploadsDirectory: existsSync(uploadsDir) ? 'accessible' : 'missing',
        cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'not configured'
      }
    }

    // Check if critical services are working
    const isHealthy = healthStatus.services.uploadsDirectory === 'accessible'
    
    res.status(isHealthy ? 200 : 503).json(healthStatus)
  } catch (error) {
    console.error('Health check error:', error)
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    })
  }
})

// Mount route modules
router.use('/api', authRoutes)
router.use('/api', dataRoutes)
router.use('/api', uploadRoutes)

export default router