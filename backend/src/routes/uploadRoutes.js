// Upload Routes
// File upload endpoints

import { Router } from 'express'
import uploadController from '../controllers/uploadController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/upload', authMiddleware, uploadController.uploadFile.bind(uploadController))
router.delete('/file', authMiddleware, uploadController.deleteFile.bind(uploadController))
router.post('/cleanup', authMiddleware, uploadController.cleanupFiles.bind(uploadController))

export default router