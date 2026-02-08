// Authentication Service
// Business logic for authentication

import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import authModel from '../models/authModel.js'

export class AuthService {
  constructor() {
    this.loginAttempts = new Map()
    this.activeSessions = new Set()
    this.MAX_LOGIN_ATTEMPTS = 5
    this.LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes
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

    // Validate credentials
    const isValid = await authModel.validateCredentials(username, password)
    
    if (isValid) {
      // Clear failed attempts
      this.loginAttempts.delete(attemptKey)
      
      // Generate session token
      const token = crypto.randomBytes(32).toString('hex')
      this.activeSessions.add(token)
      
      console.log('Login successful for:', username)
      return {
        success: true,
        token
      }
    } else {
      // Record failed attempt
      this.recordFailedAttempt(attemptKey)
      
      console.log('Login failed for:', username)
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