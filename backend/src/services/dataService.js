// Data Service
// Business logic for school data management

import dataModel from '../models/dataModel.js'

export class DataService {
  async getSchoolData() {
    try {
      const data = await dataModel.read()
      
      if (!data) {
        return {
          success: false,
          status: 404,
          error: 'Data not found'
        }
      }
      
      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Data service read error:', error)
      return {
        success: false,
        status: 500,
        error: 'Failed to read data'
      }
    }
  }

  async updateSchoolData(newData) {
    try {
      // Validate data structure
      if (!newData || typeof newData !== 'object') {
        return {
          success: false,
          status: 400,
          error: 'Invalid data: must be an object'
        }
      }
      
      // Validate data size
      let dataSize
      try {
        dataSize = JSON.stringify(newData).length
      } catch (stringifyError) {
        return {
          success: false,
          status: 400,
          error: 'Invalid data: contains circular references or non-serializable values'
        }
      }
      
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      if (dataSize > maxSize) {
        return {
          success: false,
          status: 413,
          error: 'Payload too large'
        }
      }
      
      // Validate required structure (basic schema validation)
      const requiredFields = ['school', 'programs', 'classSchedule', 'about', 'contact']
      const missingFields = requiredFields.filter(field => !newData[field])
      
      if (missingFields.length > 0) {
        console.warn('⚠️  Missing fields:', missingFields.join(', '))
        // Don't fail - just warn, as this might be a partial update
      }
      
      // Ensure arrays are actually arrays (prevent object-to-array corruption)
      const arrayFields = [
        'testimonials',
        'classSchedule.batches',
        'classSchedule.dailySchedule',
        'about.stats',
        'about.values',
        'gallery.featured'
      ]
      
      for (const fieldPath of arrayFields) {
        const parts = fieldPath.split('.')
        let current = newData
        
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) break
          current = current[parts[i]]
        }
        
        const lastPart = parts[parts.length - 1]
        if (current && current[lastPart] !== undefined && !Array.isArray(current[lastPart])) {
          console.warn(`⚠️  Converting ${fieldPath} from object to array`)
          current[lastPart] = Object.values(current[lastPart])
        }
      }

      const success = await dataModel.write(newData)
      
      if (success) {
        return { success: true }
      } else {
        return {
          success: false,
          status: 500,
          error: 'Failed to save data'
        }
      }
    } catch (error) {
      console.error('Data service write error:', error)
      return {
        success: false,
        status: 500,
        error: 'Failed to save data'
      }
    }
  }
}

export const dataService = new DataService()
export default dataService