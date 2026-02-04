import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  try {
    const { path: filePath } = req.query
    const fullPath = Array.isArray(filePath) ? filePath.join('/') : filePath
    
    // Construct the file path
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    const requestedFile = path.join(uploadsDir, fullPath)
    
    // Security check - make sure the file is within uploads directory
    if (!requestedFile.startsWith(uploadsDir)) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    // Check if file exists
    if (!fs.existsSync(requestedFile)) {
      return res.status(404).json({ error: 'File not found' })
    }
    
    // Get file stats
    const stats = fs.statSync(requestedFile)
    if (!stats.isFile()) {
      return res.status(404).json({ error: 'Not a file' })
    }
    
    // Determine content type
    const ext = path.extname(requestedFile).toLowerCase()
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mov': 'video/quicktime'
    }
    
    const contentType = contentTypes[ext] || 'application/octet-stream'
    
    // Set headers
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=31536000') // 1 year cache
    
    // Stream the file
    const fileBuffer = fs.readFileSync(requestedFile)
    return res.send(fileBuffer)
    
  } catch (error) {
    console.error('File serve error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}