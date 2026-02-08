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
      // Basic validation
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Invalid payload' })
      }

      const result = await dataService.updateSchoolData(req.body)
      
      if (result.success) {
        console.log('✅ Admin data updated successfully')
        res.json({ success: true })
      } else {
        res.status(result.status || 500).json({ error: result.error })
      }
    } catch (error) {
      console.error('Update data controller error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export const dataController = new DataController()
export default dataController