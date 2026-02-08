// Data Controller
// Handles school data HTTP requests

import dataService from '../services/dataService.js'

export class DataController {
  async getData(req, res) {
    try {
      const result = await dataService.getSchoolData()
      
      if (result.success) {
        res.json(result.data)
      } else {
        res.status(result.status || 404).json({ error: result.error })
      }
    } catch (error) {
      console.error('Get data controller error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async updateData(req, res) {
    try {
      console.log('📥 Received data update request')
      console.log('📊 Request body size:', JSON.stringify(req.body).length, 'bytes')
      console.log('🔐 Auth header:', req.headers.authorization ? 'Present' : 'Missing')
      
      // Basic validation
      if (!req.body || typeof req.body !== 'object') {
        console.log('❌ Invalid payload')
        return res.status(400).json({ error: 'Invalid payload' })
      }

      console.log('🔄 Calling data service...')
      const result = await dataService.updateSchoolData(req.body)
      console.log('📤 Data service result:', result)
      
      if (result.success) {
        console.log('✅ Data update successful')
        res.json({ success: true })
      } else {
        console.log('❌ Data update failed:', result.error)
        res.status(result.status || 500).json({ error: result.error })
      }
    } catch (error) {
      console.error('💥 Update data controller error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export const dataController = new DataController()
export default dataController