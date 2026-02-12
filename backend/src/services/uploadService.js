// Upload Service
// Business logic for file uploads and processing

import uploadModel from '../models/uploadModel.js'
import imageProcessor from '../utils/imageProcessor.js'
import fileValidator from '../utils/fileValidator.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class UploadService {
  async processUpload(file) {
    try {
      console.log('🚀 Starting upload process...')
      
      // Validate file (now accepts everything)
      const validation = fileValidator.validate(file)
      if (!validation.isValid) {
        console.log('❌ Validation failed:', validation.error)
        return {
          success: false,
          status: 400,
          error: validation.error
        }
      }

      const { name: originalName, size: originalSize, mimetype } = file
      const ext = originalName.toLowerCase().split('.').pop()

      console.log(`📁 Processing file: ${originalName} (${originalSize} bytes, ${mimetype})`)
      console.log(`🔍 Extension: ${ext}`)
      console.log(`🎬 Is video: ${fileValidator.isVideo(ext, mimetype)}`)
      console.log(`🖼️ Is image: ${fileValidator.isImage(ext, mimetype)}`)

      // Handle video files (or any file that looks like video)
      if (fileValidator.isVideo(ext, mimetype)) {
        console.log('➡️ Processing as video')
        return await this.processVideo(file)
      }

      // Handle image files (or any file that looks like image)
      if (fileValidator.isImage(ext, mimetype)) {
        console.log('➡️ Processing as image')
        return await this.processImage(file)
      }

      // Handle any other file type as generic file
      console.log('➡️ Processing as generic file')
      return await this.processGenericFile(file)
    } catch (error) {
      console.error('💥 Upload service error:', error)
      return {
        success: false,
        status: 500,
        error: 'Upload processing failed: ' + error.message
      }
    }
  }

  async processVideo(file) {
    try {
      const result = await uploadModel.saveVideo(file)
      return {
        success: true,
        data: {
          url: result.url,
          publicId: result.publicId,
          type: 'video',
          originalSize: file.size,
          filename: result.filename,
          format: result.format
        }
      }
    } catch (error) {
      console.error('Video processing error:', error)
      return {
        success: false,
        status: 500,
        error: 'Video processing failed: ' + error.message
      }
    }
  }

  async processImage(file) {
    try {
      console.log('🖼️ Uploading image to Cloudinary:', file.name)
      
      const result = await uploadModel.saveImageDirect(file)
      
      return {
        success: true,
        data: {
          url: result.url,
          publicId: result.publicId,
          type: 'image',
          originalSize: file.size,
          filename: result.filename,
          format: result.format,
          width: result.width,
          height: result.height
        }
      }
    } catch (error) {
      console.error('💥 Image upload error:', error)
      return {
        success: false,
        status: 500,
        error: 'Image upload failed: ' + error.message
      }
    }
  }

  async processGenericFile(file) {
    try {
      console.log(`📄 Processing generic file: ${file.name}`)
      const result = await uploadModel.saveVideo(file)
      return {
        success: true,
        data: {
          url: result.url,
          publicId: result.publicId,
          type: 'file',
          originalSize: file.size,
          filename: result.filename,
          mimetype: file.mimetype
        }
      }
    } catch (error) {
      console.error('Generic file processing error:', error)
      return {
        success: false,
        status: 500,
        error: 'File processing failed: ' + error.message
      }
    }
  }

  async deleteFile(filePath) {
    try {
      const result = await uploadModel.deleteFile(filePath)
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Delete file service error:', error)
      return {
        success: false,
        status: 500,
        error: 'File deletion failed'
      }
    }
  }

  async cleanupOrphanFiles() {
    try {
      // Read current mockData.json to get all used URLs
      const mockDataPath = path.join(__dirname, '../../../public/mockData.json')
      
      let mockData = {}
      try {
        const fileContent = fs.readFileSync(mockDataPath, 'utf-8')
        mockData = JSON.parse(fileContent)
      } catch (err) {
        console.warn('Could not read mockData.json:', err.message)
        return {
          success: false,
          status: 500,
          error: 'Could not read mockData.json: ' + err.message
        }
      }
      
      const result = await uploadModel.cleanupOrphans(mockData)
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Cleanup service error:', error)
      return {
        success: false,
        status: 500,
        error: 'Cleanup failed: ' + error.message
      }
    }
  }
}

export const uploadService = new UploadService()
export default uploadService