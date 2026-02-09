// Upload Model
// Handles file storage operations with Cloudinary

import cloudinary from '../config/cloudinary.js'
import fs from 'fs'

export class UploadModel {
  async saveVideo(file) {
    try {
      console.log('📤 Uploading video to Cloudinary:', file.name)
      
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: 'video',
        folder: 'hawk-taekwondo/videos',
        use_filename: true,
        unique_filename: true
      })

      // Clean up temp file
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

  async saveProcessedImages(processedImages) {
    try {
      const results = []
      
      for (const img of processedImages) {
        console.log(`📤 Uploading ${img.format} image to Cloudinary`)
        
        // Upload buffer to Cloudinary
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

  async deleteFile(publicId) {
    try {
      console.log('🗑️ Deleting from Cloudinary:', publicId)
      
      // Try as image first
      let result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image'
      })
      
      // If not found, try as video
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
    // Cloudinary handles cleanup automatically
    return { message: 'Cloudinary manages storage automatically' }
  }
}

export const uploadModel = new UploadModel()
export default uploadModel
