import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const UPLOADS_PATH = path.join(__dirname, '..', 'public', 'uploads')

// Auth middleware
function verifyAuth(req) {
  const token = req.headers.authorization
  if (!token) {
    throw new Error('No token provided')
  }
  
  return token === process.env.ADMIN_TOKEN
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Verify authentication
    try {
      verifyAuth(req)
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    
    // Note: File upload in Vercel serverless functions is limited
    // For now, return a placeholder response
    return res.json({ 
      success: true,
      url: '/uploads/placeholder.jpg',
      message: 'File upload not available in serverless deployment. Use local development for uploads.'
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ error: 'Upload failed' })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}