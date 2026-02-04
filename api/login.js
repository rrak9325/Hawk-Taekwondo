import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, password } = req.body
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }
    
    // Hardcoded credentials for now (your actual credentials)
    const validUsername = 'yaju9325'
    const validPasswordHash = '$2b$10$r.ueC.ssjKhXSg4aqJE8ee0TaDu61nVFIOCvj/euL9a1/FXYe10EC'
    
    if (username !== validUsername) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const isValidPassword = await bcrypt.compare(password, validPasswordHash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Generate simple token
    const token = 'admin-token-' + Date.now()
    
    return res.json({ 
      success: true, 
      token,
      message: 'Login successful' 
    })
    
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Login failed' })
  }
}