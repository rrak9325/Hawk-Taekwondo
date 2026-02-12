// Authentication Model
// Data access for authentication

import bcrypt from 'bcryptjs'

export class AuthModel {
  constructor() {
    this.adminUser = null
    this.adminPassHash = null
    this.initialized = false
  }

  initialize() {
    if (this.initialized) return
    
    // Get credentials from environment
    this.adminUser = process.env.ADMIN_USER || 'admin'
    this.adminPassHash = process.env.ADMIN_PASS_HASH
    
    if (!this.adminPassHash) {
      console.error('Missing ADMIN_PASS_HASH in environment variables')
      process.exit(1)
    }
    
    this.initialized = true
  }

  async validateCredentials(username, password) {
    this.initialize()
    
    try {
      if (username !== this.adminUser) {
        return false
      }
      
      return bcrypt.compareSync(password, this.adminPassHash)
    } catch (error) {
      console.error('Credential validation error:', error)
      return false
    }
  }
}

export const authModel = new AuthModel()
export default authModel