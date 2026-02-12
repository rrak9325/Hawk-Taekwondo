// Authentication Service
// Handles login, logout, and auth state

import apiClient from '../api/client.js'

export class AuthService {
  async login(credentials) {
    try {
      const response = await apiClient.post('/api/login', credentials)
      
      if (response.success && response.token) {
        apiClient.setToken(response.token)
        return { success: true, token: response.token }
      }
      
      throw new Error('Invalid response format')
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      }
    }
  }

  async logout() {
    try {
      await apiClient.post('/api/logout')
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      apiClient.clearToken()
    }
  }

  isAuthenticated() {
    return !!apiClient.token
  }

  getToken() {
    return apiClient.token
  }
}

export const authService = new AuthService()
export default authService