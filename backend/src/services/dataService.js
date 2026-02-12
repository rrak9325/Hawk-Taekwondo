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
      // Validate data size
      const dataSize = JSON.stringify(newData).length
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      if (dataSize > maxSize) {
        return {
          success: false,
          status: 413,
          error: 'Payload too large'
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