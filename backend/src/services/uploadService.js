// Upload Service
// Business logic for file uploads and processing

import uploadModel from '../models/uploadModel.js'
import imageProcessor from '../utils/imageProcessor.js'
import fileValidator from '../utils/fileValidator.js'

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

  async processGenericFile(file) {
    try {
      console.log(`📄 Processing generic file: ${file.name}`)
      const result = await uploadModel.saveVideo(file) // Use video save method for any file
      return {
        success: true,
        data: {
          url: result.url,
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
        error: 'File processing failed'
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
          type: 'video',
          originalSize: file.size,
          filename: result.filename
        }
      }
    } catch (error) {
      console.error('Video processing error:', error)
      return {
        success: false,
        status: 500,
        error: 'Video processing failed'
      }
    }
  }

  async processImage(file) {
    try {
      console.log('🖼️ Starting image processing for:', file.name)
      console.log('📊 Sharp available:', imageProcessor.isAvailable())
      
      // If Sharp is not available, save file directly
      if (!imageProcessor.isAvailable()) {
        console.log('⚠️ Sharp not available, saving file directly')
        const result = await uploadModel.saveVideo(file) // Use video save method for direct file save
        return {
          success: true,
          data: {
            url: result.url,
            type: 'image',
            originalSize: file.size,
            optimizedSize: result.size,
            compressionRatio: '0',
            format: 'original',
            filename: result.filename
          }
        }
      }

      console.log('🔄 Processing with Sharp...')
      // Process with image optimization
      const processedImages = await imageProcessor.process(file)
      
      console.log('💾 Saving processed images...')
      // Save processed images
      const saveResults = await uploadModel.saveProcessedImages(processedImages)
      
      // Return best format (WebP preferred)
      const bestImage = saveResults.find(img => img.format === 'webp') || saveResults[0]
      
      console.log('✅ Image processing complete:', bestImage.filename)
      return {
        success: true,
        data: {
          url: bestImage.url,
          type: 'image',
          originalSize: file.size,
          optimizedSize: bestImage.size,
          compressionRatio: bestImage.compressionRatio,
          format: bestImage.format,
          dimensions: bestImage.dimensions,
          filename: bestImage.filename,
          allFormats: saveResults,
          savings: `${bestImage.compressionRatio}% smaller`
        }
      }
    } catch (error) {
      console.error('💥 Image processing error:', error)
      
      // Fallback: save original file
      try {
        console.log('🔄 Falling back to direct file save')
        const result = await uploadModel.saveVideo(file)
        return {
          success: true,
          data: {
            url: result.url,
            type: 'image',
            originalSize: file.size,
            optimizedSize: result.size,
            compressionRatio: '0',
            format: 'original',
            filename: result.filename
          }
        }
      } catch (fallbackError) {
        console.error('💥 Fallback save failed:', fallbackError)
        return {
          success: false,
          status: 500,
          error: 'Image processing and fallback failed'
        }
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
      const result = await uploadModel.cleanupOrphans()
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Cleanup service error:', error)
      return {
        success: false,
        status: 500,
        error: 'Cleanup failed'
      }
    }
  }
}

export const uploadService = new UploadService()
export default uploadService