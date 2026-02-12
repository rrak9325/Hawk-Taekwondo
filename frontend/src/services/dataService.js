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
    
    // TEMPORARY: Use mockData.json while MongoDB connection is being fixed
    try {
      console.log('🌐 Fetching data from mockData.json...')
      
      // Try API first
      try {
        const data = await apiClient.get(`/api/data?t=${Date.now()}`)
        console.log('✅ Got data from API')
        // Cache the data
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        })
        return { success: true, data }
      } catch (apiError) {
        console.warn('⚠️ API failed, falling back to mockData.json:', apiError.message)
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
      
      console.log('✅ Data received from API:', {
        hasPrograms: !!data.programs,
        programsCount: data.programs?.length || 0,
        hasTestimonials: !!data.testimonials,
        testimonialsCount: data.testimonials?.length || 0,
        hasSchedule: !!data.classSchedule,
        batchesCount: data.classSchedule?.batches?.length || 0
      })
      
      // Cache the data
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      })
      
      return { success: true, data }
    } catch (error) {
      console.error('❌ Failed to fetch school data from API:', error)
      
      // Return cached data if available as last resort
      const cached = this.cache.get(cacheKey)
      if (cached) {
        console.warn('⚠️  Using cached data due to API failure')
        return { success: true, data: cached.data }
      }
      
      return { 
        success: false, 
        error: error.message || 'Failed to fetch data from API. Please check backend connection.' 
      }
    }
  }

  async updateSchoolData(data) {
    try {
      console.log('🔄 Updating school data via API...')
      console.log('📊 Data size:', JSON.stringify(data).length, 'bytes')
      console.log('🔑 Has token:', !!apiClient.token)
      console.log('📦 Data summary:', {
        hasPrograms: !!data.programs,
        programsCount: data.programs?.length || 0,
        hasTestimonials: !!data.testimonials,
        testimonialsCount: data.testimonials?.length || 0,
        hasSchedule: !!data.classSchedule,
        batchesCount: data.classSchedule?.batches?.length || 0
      })
      
      const response = await apiClient.post('/api/data', data)
      console.log('✅ API update successful:', response)
      
      // Clear cache to force fresh fetch
      this.clearCache()
      console.log('🗑️  Cache cleared')
      
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