// Authentication Service
// Business logic for authentication

import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// Security constants
const MAX_LOGIN_ATTEMPTS = 3
const LOCKOUT_DURATION_MS = 30 * 60 * 1000 // 30 minutes
const SESSION_TOKEN_BYTES = 32

function getAdminCredentials() {
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD_HASH) {
    throw new Error('Admin credentials not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD_HASH environment variables.')
  }
  
  return {
    username: process.env.ADMIN_USERNAME,
    passwordHash: process.env.ADMIN_PASSWORD_HASH
  }
}

export class AuthService {
  constructor() {
    this.loginAttempts = new Map()
    this.activeSessions = new Set()
    this.MAX_LOGIN_ATTEMPTS = MAX_LOGIN_ATTEMPTS
    this.LOCKOUT_TIME = LOCKOUT_DURATION_MS
    this.PROGRESSIVE_DELAY = true
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
        const delayMs = Math.min(attempts.count * 1000, 5000) // Max 5 second delay
        await new Promise(resolve => setTimeout(resolve, delayMs))
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
      const sessionToken = crypto.randomBytes(SESSION_TOKEN_BYTES).toString('hex')
      this.activeSessions.add(sessionToken)
      
      return {
        success: true,
        token: sessionToken
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

  async logout(sessionToken) {
    if (sessionToken) {
      this.activeSessions.delete(sessionToken)
    }
  }

  isValidSession(sessionToken) {
    return this.activeSessions.has(sessionToken)
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