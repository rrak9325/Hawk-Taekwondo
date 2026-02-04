import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_PATH = path.join(__dirname, '..', 'public', 'mockData.json')

// Auth middleware
function verifyAuth(req) {
  const token = req.headers.authorization
  if (!token) {
    throw new Error('No token provided')
  }
  
  // Simple token validation (in production, use proper JWT)
  const validTokens = new Set()
  return validTokens.has(token) || token === process.env.ADMIN_TOKEN
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      // Get data
      if (!fs.existsSync(DATA_PATH)) {
        return res.status(404).json({ error: 'Data not found' })
      }
      
      const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))
      return res.json(data)
    }
    
    if (req.method === 'POST') {
      // Save data (requires auth)
      try {
        verifyAuth(req)
      } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      
      const newData = req.body
      if (!newData || typeof newData !== 'object') {
        return res.status(400).json({ error: 'Invalid data' })
      }
      
      // Backup existing data
      const backupPath = `${DATA_PATH}.bak`
      if (fs.existsSync(DATA_PATH)) {
        fs.copyFileSync(DATA_PATH, backupPath)
      }
      
      // Save new data
      fs.writeFileSync(DATA_PATH, JSON.stringify(newData, null, 2))
      return res.json({ success: true })
    }
    
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: error.message })
  }
}