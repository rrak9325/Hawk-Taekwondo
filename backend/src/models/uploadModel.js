// Upload Model
// Handles file storage operations (local for dev, Cloudinary for production)

import cloudinary from '../config/cloudinary.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const UPLOADS_PATH = path.join(__dirname, '../../../public/uploads')

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_PATH)) {
  fs.mkdirSync(UPLOADS_PATH, { recursive: true })
}

const USE_CLOUDINARY = process.env.NODE_ENV === 'production' && 
                       process.env.CLOUDINARY_CLOUD_NAME

export class UploadModel {
  async saveVideo(file) {
    if (USE_CLOUDINARY) {
      return this.saveVideoCloudinary(file)
    }
    return this.saveVideoLocal(file)
  }

  async saveImageDirect(file) {
    if (USE_CLOUDINARY) {
      return this.saveImageCloudinary(file)
    }
    return this.saveImageLocal(file)
  }

  // LOCAL STORAGE METHODS
  async saveVideoLocal(file) {
    try {
      const timestamp = Date.now()
      const ext = file.name.split('.').pop()
      const filename = `${timestamp}-${file.name}`
      const filepath = path.join(UPLOADS_PATH, filename)

      await file.mv(filepath)

      return {
        url: `/uploads/${filename}`,
        filename: filename,
        size: file.size
      }
    } catch (error) {
      console.error('Local video save error:', error)
      throw error
    }
  }

  async saveImageLocal(file) {
    try {
      const timestamp = Date.now()
      const ext = file.name.split('.').pop()
      const filename = `${timestamp}-${file.name}`
      const filepath = path.join(UPLOADS_PATH, filename)

      await file.mv(filepath)

      return {
        url: `/uploads/${filename}`,
        filename: filename,
        size: file.size
      }
    } catch (error) {
      console.error('Local image save error:', error)
      throw error
    }
  }

  async saveProcessedImages(processedImages) {
    if (USE_CLOUDINARY) {
      return this.saveProcessedImagesCloudinary(processedImages)
    }
    return this.saveProcessedImagesLocal(processedImages)
  }

  async saveProcessedImagesLocal(processedImages) {
    try {
      const results = []
      
      for (const img of processedImages) {
        const timestamp = Date.now()
        const filename = `${timestamp}-${img.originalName}-${img.dimensions.width}x${img.dimensions.height}.${img.format}`
        const filepath = path.join(UPLOADS_PATH, filename)

        fs.writeFileSync(filepath, img.buffer)

        results.push({
          url: `/uploads/${filename}`,
          format: img.format,
          size: img.size,
          dimensions: img.dimensions,
          compressionRatio: img.compressionRatio,
          filename: filename
        })
      }

      return results
    } catch (error) {
      console.error('Local processed images save error:', error)
      throw error
    }
  }

  // CLOUDINARY METHODS
  async saveVideoCloudinary(file) {
    try {
      console.log('📤 Uploading video to Cloudinary:', file.name)
      
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: 'video',
        folder: 'hawk-taekwondo/videos',
        use_filename: true,
        unique_filename: true
      })

      if (fs.existsSync(file.tempFilePath)) {
        fs.unlinkSync(file.tempFilePath)
      }

      console.log('✅ Video uploaded to Cloudinary:', result.secure_url)
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        filename: result.original_filename,
        size: result.bytes
      }
    } catch (error) {
      console.error('Cloudinary video upload error:', error)
      throw error
    }
  }

  async saveImageCloudinary(file) {
    try {
      console.log('📤 Uploading image to Cloudinary:', file.name)
      
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: 'image',
        folder: 'hawk-taekwondo/images',
        use_filename: true,
        unique_filename: true
      })

      if (fs.existsSync(file.tempFilePath)) {
        fs.unlinkSync(file.tempFilePath)
      }

      console.log('✅ Image uploaded to Cloudinary:', result.secure_url)
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        filename: result.original_filename,
        size: result.bytes
      }
    } catch (error) {
      console.error('Cloudinary image upload error:', error)
      throw error
    }
  }

  async saveProcessedImagesCloudinary(processedImages) {
    try {
      const results = []
      
      for (const img of processedImages) {
        console.log(`📤 Uploading ${img.format} image to Cloudinary`)
        
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'hawk-taekwondo/images',
              format: img.format,
              use_filename: true,
              unique_filename: true
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          )
          
          uploadStream.end(img.buffer)
        })

        results.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          format: img.format,
          size: img.size,
          dimensions: img.dimensions,
          compressionRatio: img.compressionRatio,
          filename: uploadResult.original_filename
        })
        
        console.log(`✅ ${img.format} uploaded:`, uploadResult.secure_url)
      }

      return results
    } catch (error) {
      console.error('Cloudinary image upload error:', error)
      throw error
    }
  }

  async deleteFile(filePath) {
    if (USE_CLOUDINARY) {
      return this.deleteFileCloudinary(filePath)
    }
    return this.deleteFileLocal(filePath)
  }

  async deleteFileLocal(filePath) {
    try {
      const fullPath = path.join(UPLOADS_PATH, path.basename(filePath))
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
        return { deleted: true }
      }
      return { deleted: false }
    } catch (error) {
      console.error('Local delete error:', error)
      throw error
    }
  }

  async deleteFileCloudinary(publicId) {
    try {
      console.log('🗑️ Deleting from Cloudinary:', publicId)
      
      let result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image'
      })
      
      if (result.result === 'not found') {
        result = await cloudinary.uploader.destroy(publicId, {
          resource_type: 'video'
        })
      }

      console.log('✅ Deleted from Cloudinary:', result)
      return { deleted: result.result === 'ok' }
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      throw error
    }
  }

  async cleanupOrphans() {
    if (USE_CLOUDINARY) {
      return { message: 'Cloudinary manages storage automatically' }
    }
    return { message: 'Local cleanup not implemented' }
  }
}

export const uploadModel = new UploadModel()
export default uploadModel
