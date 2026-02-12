// Data Service
// Business logic for school data management

import dataModel from '../utils/dataModel.js'

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
      console.log('📝 Data service: Starting update...')
      
      // Validate data size
      const dataSize = JSON.stringify(newData).length
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      console.log('📊 Data size:', (dataSize / 1024).toFixed(2), 'KB')
      
      if (dataSize > maxSize) {
        console.error('❌ Payload too large:', (dataSize / 1024 / 1024).toFixed(2), 'MB')
        return {
          success: false,
          status: 413,
          error: 'Payload too large'
        }
      }

      console.log('🔄 Calling dataModel.write()...')
      const success = await dataModel.write(newData)
      
      if (success) {
        console.log('✅ Data service: Update successful')
        return { success: true }
      } else {
        console.error('❌ Data service: dataModel.write() returned false')
        return {
          success: false,
          status: 500,
          error: 'Failed to save data - write returned false'
        }
      }
    } catch (error) {
      console.error('❌ Data service write error:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      return {
        success: false,
        status: 500,
        error: 'Failed to save data: ' + error.message
      }
    }
  }
}

export const dataService = new DataService()
export default dataService