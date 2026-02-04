// Centralized API service for Hawk Taekwondo
class ApiService {
  constructor() {
    this.baseUrl = ''
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  // Get cached data or fetch fresh
  async getData(useCache = true) {
    const cacheKey = 'schoolData'
    const cached = this.cache.get(cacheKey)
    
    if (useCache && cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    try {
      // TRY API FIRST, THEN FALLBACK TO STATIC FILE
      let response
      try {
        response = await fetch(`/api/data?t=${Date.now()}`)
        if (!response.ok) throw new Error('API failed')
      } catch (apiError) {
        console.warn('API failed, trying static file:', apiError)
        response = await fetch(`/mockData.json?t=${Date.now()}`)
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Cache the data
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      })
      
      return data
    } catch (error) {
      console.error('Failed to fetch school data:', error)
      
      // Return cached data if available, even if expired
      if (cached) {
        console.warn('Using expired cached data due to fetch failure')
        return cached.data
      }
      
      throw error
    }
  }

  // Admin API calls
  async adminRequest(endpoint, options = {}) {
    const token = sessionStorage.getItem('adminToken')
    
    const config = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': token
      }
    }

    // Don't set Content-Type for FormData, let browser handle it
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type']
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }

    console.log('Making admin request to:', endpoint, 'with config:', {
      method: config.method || 'GET',
      hasAuth: !!token,
      bodyType: config.body ? config.body.constructor.name : 'none'
    })

    const response = await fetch(`/api${endpoint}`, config)
    
    console.log('Response status:', response.status, response.statusText)
    
    if (response.status === 401) {
      sessionStorage.removeItem('adminToken')
      throw new Error('Session expired')
    }
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`API error ${response.status}: ${errorText}`)
    }
    
    return response
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }

  // Login
  async login(credentials) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Login failed')
    }
    
    return result
  }

  // Save data
  async saveData(data) {
    const response = await this.adminRequest('/data', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    
    // Clear cache after successful save
    this.clearCache()
    
    return response.json()
  }

  // Upload file
  async uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type)
    
    const response = await this.adminRequest('/upload', {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set Content-Type for FormData
    })
    
    const result = await response.json()
    console.log('Upload response:', result)
    return result
  }

  // Delete file
  async deleteFile(filePath) {
    const response = await this.adminRequest('/file', {
      method: 'DELETE',
      body: JSON.stringify({ filePath })
    })
    
    return response.json()
  }

  // Cleanup unused files
  async cleanupFiles() {
    const response = await this.adminRequest('/cleanup', {
      method: 'POST'
    })
    
    return response.json()
  }
}

// Export singleton instance
export default new ApiService()