// Upload Controller
// Handles file upload HTTP requests

import uploadService from '../services/uploadService.js'
import { validateFileUpload } from '../utils/security.js'

export class UploadController {
  async uploadFile(req, res) {
    try {
      if (!req.files || !req.files.file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const file = req.files.file
      
      // Validate file before processing
      const validation = validateFileUpload(file)
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error })
      }

      console.log(`📤 Uploading: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)

      const result = await uploadService.processUpload(file)
      
      if (result.success) {
        console.log(`✅ Upload complete: ${file.name}`)
        res.json(result.data)
      } else {
        res.status(result.status || 500).json({ error: result.error })
      }
    } catch (error) {
      console.error('Upload controller error:', error)
      res.status(500).json({ error: 'Upload failed: ' + error.message })
    }
  }

  async deleteFile(req, res) {
    try {
      const { filePath, url, publicId } = req.body
      
      // Accept either filePath, url, or publicId
      const identifier = publicId || url || filePath
      
      if (!identifier) {
        return res.status(400).json({ error: 'File identifier required (url, publicId, or filePath)' })
      }

      console.log('🗑️ Delete request for:', identifier)
      const result = await uploadService.deleteFile(identifier)
      
      if (result.success) {
        console.log('✅ File deleted successfully')
        res.json(result.data)
      } else {
        res.status(result.status || 500).json({ error: result.error })
      }
    } catch (error) {
      console.error('Delete file controller error:', error)
      res.status(500).json({ error: 'Delete failed: ' + error.message })
    }
  }

  async cleanupFiles(req, res) {
    try {
      const result = await uploadService.cleanupOrphanFiles()
      
      if (result.success) {
        res.json(result.data)
      } else {
        res.status(result.status || 500).json({ error: result.error })
      }
    } catch (error) {
      console.error('Cleanup controller error:', error)
      res.status(500).json({ error: 'Cleanup failed: ' + error.message })
    }
  }
}

export const uploadController = new UploadController()
export default uploadController