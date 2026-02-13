// Data Service
// Handles school data CRUD operations

import apiClient from '../api/client.js'

export class DataService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  async getSchoolData(useCache = true) {
    const cacheKey = 'schoolData'
    
    try {
      // Try API first
      try {
        const data = await apiClient.get(`/api/data?t=${Date.now()}`)
        // Cache the data
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        })
        return { success: true, data }
      } catch (apiError) {
        // Fallback to mockData.json
        const mockResponse = await fetch('/mockData.json')
        const data = await mockResponse.json()
        
        // Cache the data
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        })
        
        return { success: true, data }
      }
    } catch (error) {
      console.error('Failed to fetch school data:', error)
      
      // Return cached data if available as last resort
      const cached = this.cache.get(cacheKey)
      if (cached) {
        return { success: true, data: cached.data }
      }
      
      return { 
        success: false, 
        error: error.message || 'Failed to fetch data' 
      }
    }
  }

  async updateSchoolData(data) {
    try {
      const response = await apiClient.post('/api/data', data)
      
      // Clear cache to force fresh fetch
      this.clearCache()
      
      return { success: true, mode: 'api', data: response }
    } catch (error) {
      console.error('Failed to update school data:', error)
      return { 
        success: false, 
        error: error.message || 'Failed to update data' 
      }
    }
  }

  downloadDataFile(data) {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mockData.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  clearCache() {
    this.cache.clear()
  }
}

export const dataService = new DataService()
export default dataService