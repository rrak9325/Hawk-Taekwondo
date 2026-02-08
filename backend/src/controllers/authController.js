// Authentication Controller
// Handles auth-related HTTP requests

import authService from '../services/authService.js'
import { validateLoginRequest } from '../validators/authValidator.js'

export class AuthController {
  async login(req, res) {
    try {
      // Validate request
      const validation = validateLoginRequest(req.body)
      if (!validation.isValid) {
        return res.status(400).json({ 
          error: 'Invalid request', 
          details: validation.errors 
        })
      }

      // Delegate to service
      const result = await authService.login(req.body, req.ip)
      
      if (result.success) {
        res.json(result)
      } else {
        res.status(result.status || 401).json({ error: result.error })
      }
    } catch (error) {
      console.error('Login controller error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async logout(req, res) {
    try {
      const token = req.headers.authorization
      await authService.logout(token)
      res.json({ success: true })
    } catch (error) {
      console.error('Logout controller error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export const authController = new AuthController()
export default authController