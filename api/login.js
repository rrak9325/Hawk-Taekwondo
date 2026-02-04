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
    
    // Check credentials
    const validUsername = process.env.ADMIN_USER
    const validPasswordHash = process.env.ADMIN_PASS_HASH
    
    if (!validUsername || !validPasswordHash) {
      return res.status(500).json({ error: 'Server configuration error' })
    }
    
    if (username !== validUsername) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const isValidPassword = await bcrypt.compare(password, validPasswordHash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Generate simple token (in production, use proper JWT)
    const token = crypto.randomBytes(32).toString('hex')
    
    // Store token in environment (in production, use proper session storage)
    process.env.ADMIN_TOKEN = token
    
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