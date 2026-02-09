// Cloudinary Upload Utility
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export class CloudinaryUploader {
  async uploadFile(file) {
    try {
      const filePath = file.tempFilePath || file.path

      // Determine resource type
      const isVideo = file.mimetype?.startsWith('video/')
      const resourceType = isVideo ? 'video' : 'image'

      console.log(`☁️ Uploading to Cloudinary as ${resourceType}:`, file.name)

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'hawk-taekwondo',
        resource_type: resourceType,
        transformation: isVideo ? [] : [
          { width: 1200, height: 900, crop: 'limit', quality: 'auto' }
        ]
      })

      // Clean up temp file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      console.log('✅ Cloudinary upload successful:', result.secure_url)

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
        resourceType: result.resource_type
      }
    } catch (error) {
      console.error('❌ Cloudinary upload failed:', error)
      throw error
    }
  }

  async deleteFile(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId)
      return { success: result.result === 'ok' }
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      return { success: false, error: error.message }
    }
  }
}

export const cloudinaryUploader = new CloudinaryUploader()
export default cloudinaryUploader
