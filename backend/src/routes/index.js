// Main Routes
// Combines all route modules

import { Router } from 'express'
import authRoutes from './authRoutes.js'
import dataRoutes from './dataRoutes.js'
import uploadRoutes from './uploadRoutes.js'

const router = Router()

// Mount route modules
router.use('/api', authRoutes)
router.use('/api', dataRoutes)
router.use('/api', uploadRoutes)

export default router