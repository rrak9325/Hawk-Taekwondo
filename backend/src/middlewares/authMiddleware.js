// Auth Middleware
// Handles authentication for protected routes

import authService from '../services/authService.js'

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization
  
  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' })
  }
  
  if (!authService.isValidSession(token)) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
  
  next()
}

export default authMiddleware