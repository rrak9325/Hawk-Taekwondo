// API Client Configuration
// Centralized HTTP client with interceptors

// Handle API URL detection for different environments
const API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || 
     // Try to construct backend URL from current domain
     (window.location.hostname.includes('render.app') 
       ? window.location.origin.replace(window.location.hostname.split('.')[0], 'hawk-taekwondo-backend')
       : window.location.origin.replace('hawk-taekwondo-frontend', 'hawk-taekwondo-backend')))
  : '' // Empty for development to use Vite proxy

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
    this.token = sessionStorage.getItem('adminToken') // Use sessionStorage like the old service
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    // Debug logging in production
    if (import.meta.env.PROD) {
      console.log('🚀 API Request:', url)
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    if (this.token) {
      config.headers.Authorization = this.token
    }

    // For FormData uploads, don't set Content-Type
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type']
    }

    try {
      const response = await fetch(url, config)
      
      if (response.status === 401) {
        // Clear token on unauthorized
        this.clearToken()
        throw new Error('Session expired')
      }
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // HTTP Methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options })
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    })
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options })
  }

  // File upload method
  upload(endpoint, formData, options = {}) {
    const config = {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - let browser handle it
        // Only add Authorization header
        ...(this.token && { Authorization: this.token }),
        ...options.headers,
      },
    }
    
    // Remove Content-Type if it exists to let browser set it with boundary
    delete config.headers['Content-Type']
    
    return this.request(endpoint, config)
  }

  // Auth methods
  setToken(token) {
    this.token = token
    if (token) {
      sessionStorage.setItem('adminToken', token)
    } else {
      sessionStorage.removeItem('adminToken')
    }
  }

  clearToken() {
    this.token = null
    sessionStorage.removeItem('adminToken')
  }
}

export const apiClient = new ApiClient()
export default apiClient