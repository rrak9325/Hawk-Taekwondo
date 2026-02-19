// Upload Controller
// Handles file upload HTTP requests

import uploadService from '../services/uploadService.js'
import { validateFileUpload } from '../utils/security.js'

export class UploadController {
  async uploadFile(req, res) {
    try {
      console.log('Upload request received:', {
        hasFiles: !!req.files,
        fileKeys: req.files ? Object.keys(req.files) : [],
        file: req.files?.file ? {
          name: req.files.file.name,
          mimetype: req.files.file.mimetype,
          size: req.files.file.size
        } : null
      })
      
      if (!req.files || !req.files.file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const file = req.files.file
      
      // Validate file before processing
      const validation = validateFileUpload(file)
      if (!validation.isValid) {
        console.log('File validation failed:', validation.error)
        return res.status(400).json({ error: validation.error })
      }

      const result = await uploadService.processUpload(file)
      
      if (result.success) {
        res.json(result.data)
      } else {
        console.log('Upload processing failed:', result.error)
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

      const result = await uploadService.deleteFile(identifier)
      
      if (result.success) {
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