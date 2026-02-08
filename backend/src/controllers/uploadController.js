// Upload Controller
// Handles file upload HTTP requests

import uploadService from '../services/uploadService.js'

export class UploadController {
  async uploadFile(req, res) {
    try {
      if (!req.files || !req.files.file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const file = req.files.file
      const result = await uploadService.processUpload(file)
      
      if (result.success) {
        console.log(`📤 File uploaded - Name: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Type: ${file.mimetype}`)
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
      const { filePath } = req.body
      
      if (!filePath) {
        return res.status(400).json({ error: 'filePath required' })
      }

      const result = await uploadService.deleteFile(filePath)
      
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