// Data Controller
// Handles school data HTTP requests

import dataService from '../services/dataService.js'
import { sanitizeInput } from '../utils/security.js'

export class DataController {
  async getData(req, res) {
    try {
      console.log('📥 GET DATA REQUEST RECEIVED')
      
      // Use mockData.json directly instead of MongoDB
      const fs = await import('fs')
      const path = await import('path')
      const { fileURLToPath } = await import('url')
      
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const mockDataPath = path.join(__dirname, '../../../public/mockData.json')
      
      if (!fs.existsSync(mockDataPath)) {
        console.error('❌ mockData.json not found')
        return res.status(404).json({ error: 'Data file not found' })
      }
      
      const data = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'))
      console.log('✅ Sending mockData.json to client')
      console.log('- Programs:', Array.isArray(data.programs) ? data.programs.length : 0)
      console.log('- Instructors:', Array.isArray(data.instructors) ? data.instructors.length : 0)
      
      res.json(data)
      
    } catch (error) {
      console.error('💥 Get data controller error:', error)
      res.status(500).json({ error: 'Internal server error: ' + error.message })
    }
  }

  async updateData(req, res) {
    try {
      console.log('\n📥 ========== UPDATE REQUEST ==========')
      console.log('📊 Request body size:', JSON.stringify(req.body).length, 'bytes')
      console.log('🔐 Auth header:', req.headers.authorization ? 'Present' : 'Missing')
      console.log('📦 Body keys:', Object.keys(req.body))
      
      // Basic validation
      if (!req.body || typeof req.body !== 'object') {
        console.log('❌ Invalid payload - not an object')
        return res.status(400).json({ error: 'Invalid payload' })
      }

      console.log('📥 Raw request body keys:', Object.keys(req.body))
      console.log('📥 SchoolInfo keys:', req.body.schoolInfo ? Object.keys(req.body.schoolInfo) : 'No schoolInfo')
      console.log('📥 Programs type:', Array.isArray(req.body.programs) ? 'array' : typeof req.body.programs)
      console.log('📥 Instructors type:', Array.isArray(req.body.instructors) ? 'array' : typeof req.body.instructors)
      
      // Sanitize input data
      const sanitizedData = sanitizeInput(req.body)
      
      // Fix hours field if it's an empty object
      if (sanitizedData.schoolInfo?.hours && 
          typeof sanitizedData.schoolInfo.hours === 'object' && 
          !Array.isArray(sanitizedData.schoolInfo.hours) && 
          Object.keys(sanitizedData.schoolInfo.hours).length === 0) {
        console.log('🔧 Converting empty hours object to empty array')
        sanitizedData.schoolInfo.hours = []
      }
      
      console.log('🔄 Data sanitized, saving to mockData.json...')
      console.log('📤 Sanitized data keys:', Object.keys(sanitizedData))
      
      // Save to mockData.json instead of MongoDB
      const fs = await import('fs')
      const path = await import('path')
      const { fileURLToPath } = await import('url')
      
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const mockDataPath = path.join(__dirname, '../../../public/mockData.json')
      
      // Read existing data to preserve any missing fields
      let existingData = {}
      if (fs.existsSync(mockDataPath)) {
        existingData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'))
      }
      
      // Merge new data with existing data (preserve existing fields)
      const mergedData = { ...existingData, ...sanitizedData }
      
      // Write to file
      fs.writeFileSync(mockDataPath, JSON.stringify(mergedData, null, 2))
      
      console.log('✅ Data saved to mockData.json successfully')
      console.log('========================================\n')
      res.json({ success: true })
      
    } catch (error) {
      console.error('💥 Update data controller error:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      console.log('========================================\n')
      res.status(500).json({ error: 'Internal server error: ' + error.message })
    }
  }
}

export const dataController = new DataController()
export default dataController