// Authentication Service
// Business logic for authentication

import bcrypt from 'bcryptjs'
import crypto from 'crypto'

function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    passwordHash: process.env.ADMIN_PASSWORD_HASH || '$2a$10$8K1TKnwN.N24q5Bp5p8JHeUeZ.bfRFD2.yzY5KkEv.YjZWV3e.C4a'
  }
}

export class AuthService {
  constructor() {
    this.loginAttempts = new Map()
    this.activeSessions = new Set()
    this.MAX_LOGIN_ATTEMPTS = 3 // Reduced from 5 to 3
    this.LOCKOUT_TIME = 30 * 60 * 1000 // Increased to 30 minutes
    this.PROGRESSIVE_DELAY = true // Add progressive delays
  }

  async login(credentials, clientIP) {
    const { username, password } = credentials
    
    // Check rate limiting
    const attemptKey = `${clientIP}_${username}`
    const rateLimitResult = this.checkRateLimit(attemptKey)
    
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        status: 429,
        error: rateLimitResult.message
      }
    }

    // Add progressive delay based on failed attempts
    if (this.PROGRESSIVE_DELAY) {
      const attempts = this.loginAttempts.get(attemptKey)
      if (attempts && attempts.count > 0) {
        const delay = Math.min(attempts.count * 1000, 5000) // Max 5 second delay
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    // Validate credentials against static credentials
    const ADMIN_CREDENTIALS = getAdminCredentials()
    const isValid = username === ADMIN_CREDENTIALS.username && 
                   await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash)
    
    if (isValid) {
      // Clear failed attempts
      this.loginAttempts.delete(attemptKey)
      
      // Generate session token
      const token = crypto.randomBytes(32).toString('hex')
      this.activeSessions.add(token)
      
      return {
        success: true,
        token
      }
    } else {
      // Record failed attempt
      this.recordFailedAttempt(attemptKey)
      
      return {
        success: false,
        status: 401,
        error: 'Invalid credentials'
      }
    }
  }

  async logout(token) {
    if (token) {
      this.activeSessions.delete(token)
    }
  }

  isValidSession(token) {
    return this.activeSessions.has(token)
  }

  checkRateLimit(attemptKey) {
    const now = Date.now()
    const attempts = this.loginAttempts.get(attemptKey)
    
    if (attempts) {
      const { count, lastAttempt } = attempts
      
      // Reset if lockout time passed
      if (now - lastAttempt > this.LOCKOUT_TIME) {
        this.loginAttempts.delete(attemptKey)
        return { allowed: true }
      }
      
      if (count >= this.MAX_LOGIN_ATTEMPTS) {
        const remainingTime = Math.ceil((this.LOCKOUT_TIME - (now - lastAttempt)) / 1000 / 60)
        return {
          allowed: false,
          message: `Too many login attempts. Try again in ${remainingTime} minutes.`
        }
      }
    }
    
    return { allowed: true }
  }

  recordFailedAttempt(attemptKey) {
    const now = Date.now()
    const existing = this.loginAttempts.get(attemptKey)
    
    if (existing) {
      existing.count++
      existing.lastAttempt = now
    } else {
      this.loginAttempts.set(attemptKey, { count: 1, lastAttempt: now })
    }
  }
}

export const authService = new AuthService()
export default authService