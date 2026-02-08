// Data Routes
// School data endpoints

import { Router } from 'express'
import dataController from '../controllers/dataController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/data', dataController.getData.bind(dataController))
router.post('/data', authMiddleware, dataController.updateData.bind(dataController))

export default router