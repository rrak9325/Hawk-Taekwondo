// Upload Controller
// Handles file upload HTTP requests

import uploadService from '../services/uploadService.js'

export class UploadController {
  async uploadFile(req, res) {
    try {
      console.log('📤 Upload request received')
      console.log('📋 Headers:', req.headers)
      console.log('📁 Files:', req.files ? Object.keys(req.files) : 'No files')
      console.log('🔐 Auth:', req.headers.authorization ? 'Present' : 'Missing')

      if (!req.files || !req.files.file) {
        console.log('❌ No file in request')
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const file = req.files.file
      console.log('📄 File details:', {
        name: file.name,
        size: file.size,
        mimetype: file.mimetype,
        tempFilePath: file.tempFilePath
      })

      const result = await uploadService.processUpload(file)
      
      if (result.success) {
        console.log('✅ Upload successful:', result.data)
        res.json(result.data)
      } else {
        console.log('❌ Upload failed:', result.error)
        res.status(result.status || 500).json({ error: result.error })
      }
    } catch (error) {
      console.error('💥 Upload controller error:', error)
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