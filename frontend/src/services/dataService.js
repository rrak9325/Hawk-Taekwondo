// Data Service
// Handles school data CRUD operations

import apiClient from '../api/client.js'

export class DataService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
    this.maxCacheSize = 10 // Maximum number of cached items
  }

  async getSchoolData(useCache = true) {
    const cacheKey = 'schoolData'
    const cached = this.cache.get(cacheKey)
    
    if (useCache && cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return { success: true, data: cached.data }
    }

    try {
      // Try API first, then fallback to static file
      let data
      try {
        data = await apiClient.get(`/api/data?t=${Date.now()}`)
      } catch (apiError) {
        console.warn('API failed, trying static file:', apiError)
        const response = await fetch(`/mockData.json?t=${Date.now()}`)
        if (!response.ok) throw new Error('Static file also failed')
        data = await response.json()
      }
      
      // Cache the data with size limit
      this.setCacheItem(cacheKey, {
        data,
        timestamp: Date.now()
      })
      
      return { success: true, data }
    } catch (error) {
      console.error('Failed to fetch school data:', error)
      
      // Return cached data if available, even if expired
      if (cached) {
        console.warn('Using expired cached data due to fetch failure')
        return { success: true, data: cached.data }
      }
      
      return { 
        success: false, 
        error: error.message || 'Failed to fetch data' 
      }
    }
  }
  
  setCacheItem(key, value) {
    // Remove oldest item if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }

  async updateSchoolData(data) {
    try {
      console.log('🔄 Updating school data...')
      console.log('📊 Data size:', JSON.stringify(data).length, 'bytes')
      console.log('🔑 Has token:', !!apiClient.token)
      
      // Always try to use the backend API in development
      // Only fall back to file download in production without API
      const isProduction = import.meta.env.PROD
      const hasApiUrl = import.meta.env.VITE_API_URL
      
      console.log('🏗️ Environment:', { isProduction, hasApiUrl })
      
      if (isProduction && !hasApiUrl) {
        // Production mode without API - download file
        console.log('📥 Using download mode (production without API)')
        this.downloadDataFile(data)
        this.clearCache()
        return { success: true, mode: 'download' }
      }
      
      // Development mode or production with API - use backend
      console.log('🌐 Using API mode')
      const response = await apiClient.post('/api/data', data)
      console.log('✅ API response received:', response)
      this.clearCache()
      return { success: true, mode: 'api', data: response }
    } catch (error) {
      console.error('❌ Failed to update school data:', error)
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