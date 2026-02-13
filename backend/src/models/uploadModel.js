// Upload Model
// Handles file storage operations - CLOUDINARY ONLY (production-ready)

import cloudinary, { isConfigured } from '../config/cloudinary.js'

// Ensure Cloudinary is configured
isConfigured()
import fs from 'fs'

export class UploadModel {
  /**
   * Upload video to Cloudinary
   * @param {Object} file - Express-fileupload file object
   * @returns {Promise<Object>} Upload result with URL and publicId
   */
  async saveVideo(file) {
    try {
      console.log('📤 Uploading video to Cloudinary:', file.name)
      
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: 'video',
        folder: 'hawk-taekwondo/videos',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        quality: 'auto:best',  // Best quality for videos
        video_codec: 'auto'     // Auto codec selection
      })

      // Clean up temp file
      this.cleanupTempFile(file.tempFilePath)

      console.log('✅ Video uploaded:', result.secure_url)
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        filename: result.original_filename || file.name,
        size: result.bytes,
        format: result.format,
        resourceType: 'video'
      }
    } catch (error) {
      this.cleanupTempFile(file.tempFilePath)
      console.error('❌ Cloudinary video upload error:', error)
      throw new Error(`Video upload failed: ${error.message}`)
    }
  }

  /**
   * Upload image to Cloudinary
   * @param {Object} file - Express-fileupload file object
   * @returns {Promise<Object>} Upload result with URL and publicId
   */
  async saveImageDirect(file) {
    try {
      console.log('📤 Uploading image to Cloudinary:', file.name)
      
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: 'image',
        folder: 'hawk-taekwondo/images',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        quality: 'auto:best',  // Best quality
        fetch_format: 'auto',   // Auto format selection
        flags: 'preserve_transparency'  // Preserve transparency for PNGs
      })

      // Clean up temp file
      this.cleanupTempFile(file.tempFilePath)

      console.log('✅ Image uploaded:', result.secure_url)
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        filename: result.original_filename || file.name,
        size: result.bytes,
        format: result.format,
        width: result.width,
        height: result.height,
        resourceType: 'image'
      }
    } catch (error) {
      this.cleanupTempFile(file.tempFilePath)
      console.error('❌ Cloudinary image upload error:', error)
      throw new Error(`Image upload failed: ${error.message}`)
    }
  }

  /**
   * Delete file from Cloudinary
   * @param {string} urlOrPublicId - Cloudinary URL or public_id
   * @returns {Promise<Object>} Deletion result
   */
  async deleteFile(urlOrPublicId) {
    try {
      // Extract public_id from URL if full URL is provided
      const publicId = this.extractPublicId(urlOrPublicId)
      
      if (!publicId) {
        throw new Error('Invalid Cloudinary URL or public_id')
      }

      console.log('🗑️ Deleting from Cloudinary:', publicId)
      
      // Try deleting as image first
      let result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        invalidate: true
      })
      
      // If not found as image, try as video
      if (result.result === 'not found') {
        result = await cloudinary.uploader.destroy(publicId, {
          resource_type: 'video',
          invalidate: true
        })
      }

      const deleted = result.result === 'ok'
      console.log(deleted ? '✅ Deleted from Cloudinary' : '⚠️ File not found in Cloudinary')
      
      return { 
        deleted,
        publicId,
        result: result.result
      }
    } catch (error) {
      console.error('❌ Cloudinary delete error:', error)
      throw new Error(`Delete failed: ${error.message}`)
    }
  }

  /**
   * Extract public_id from Cloudinary URL
   * @param {string} urlOrPublicId - Cloudinary URL or public_id
   * @returns {string|null} Extracted public_id
   */
  extractPublicId(urlOrPublicId) {
    if (!urlOrPublicId) return null

    // If it's already a public_id (contains folder structure)
    if (urlOrPublicId.includes('hawk-taekwondo/')) {
      return urlOrPublicId
    }

    // If it's a Cloudinary URL
    if (urlOrPublicId.includes('cloudinary.com')) {
      try {
        // Extract public_id from URL
        // Format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
        const urlParts = urlOrPublicId.split('/')
        const uploadIndex = urlParts.findIndex(part => part === 'upload')
        
        if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
          // Get everything after 'upload/v{version}/'
          const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/')
          // Remove file extension
          const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '')
          return publicId
        }
      } catch (error) {
        console.error('Error extracting public_id from URL:', error)
      }
    }

    // Return as-is if it looks like a public_id
    return urlOrPublicId
  }

  /**
   * Clean up temporary file
   * @param {string} tempFilePath - Path to temp file
   */
  cleanupTempFile(tempFilePath) {
    try {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath)
        console.log('🧹 Cleaned up temp file')
      }
    } catch (error) {
      console.warn('⚠️ Failed to cleanup temp file:', error.message)
    }
  }

  /**
   * Get Cloudinary resource info
   * @param {string} publicId - Cloudinary public_id
   * @param {string} resourceType - 'image' or 'video'
   * @returns {Promise<Object>} Resource details
   */
  async getResourceInfo(publicId, resourceType = 'image') {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: resourceType
      })
      return result
    } catch (error) {
      console.error('Error fetching resource info:', error)
      throw error
    }
  }

  /**
   * Get all files from Cloudinary folders
   * @returns {Promise<Array>} List of all files with publicId and URL
   */
  async getAllCloudinaryFiles() {
    try {
      const allFiles = []
      
      console.log('📡 Fetching images from Cloudinary...')
      // Get images from hawk-taekwondo/images folder
      try {
        let imageResult = await cloudinary.api.resources({
          type: 'upload',
          prefix: 'hawk-taekwondo/images',
          resource_type: 'image',
          max_results: 500
        })
        
        allFiles.push(...imageResult.resources.map(r => ({
          publicId: r.public_id,
          url: r.secure_url,
          type: 'image'
        })))
        console.log(`✅ Found ${imageResult.resources.length} images`)
      } catch (err) {
        console.warn('⚠️ Error fetching images:', err.message)
      }
      
      console.log('📡 Fetching videos from Cloudinary...')
      // Get videos from hawk-taekwondo/videos folder
      try {
        let videoResult = await cloudinary.api.resources({
          type: 'upload',
          prefix: 'hawk-taekwondo/videos',
          resource_type: 'video',
          max_results: 500
        })
        
        allFiles.push(...videoResult.resources.map(r => ({
          publicId: r.public_id,
          url: r.secure_url,
          type: 'video'
        })))
        console.log(`✅ Found ${videoResult.resources.length} videos`)
      } catch (err) {
        console.warn('⚠️ Error fetching videos:', err.message)
      }
      
      console.log(`📊 Total files in Cloudinary: ${allFiles.length}`)
      return allFiles
    } catch (error) {
      console.error('❌ Error fetching Cloudinary files:', error)
      throw new Error(`Failed to fetch Cloudinary files: ${error.message}`)
    }
  }

  /**
   * Clean up orphaned files (files in Cloudinary not used in mockData.json)
   * @param {Object} mockData - The current mockData.json content
   * @returns {Promise<Object>} Cleanup result
   */
  async cleanupOrphans(mockData) {
    try {
      console.log('🧹 Starting orphan cleanup...')
      
      // Get all files from Cloudinary
      const cloudinaryFiles = await this.getAllCloudinaryFiles()
      
      // Extract all URLs from mockData
      const usedUrls = new Set()
      const extractUrls = (obj) => {
        if (!obj) return
        
        if (typeof obj === 'string' && obj.includes('cloudinary.com')) {
          usedUrls.add(obj)
        } else if (Array.isArray(obj)) {
          obj.forEach(item => extractUrls(item))
        } else if (typeof obj === 'object') {
          Object.values(obj).forEach(value => extractUrls(value))
        }
      }
      
      extractUrls(mockData)
      console.log(`📋 Found ${usedUrls.size} URLs in mockData.json`)
      
      // Find orphaned files (in Cloudinary but not in mockData)
      const orphanedFiles = cloudinaryFiles.filter(file => !usedUrls.has(file.url))
      
      console.log(`🗑️ Found ${orphanedFiles.length} orphaned files`)
      
      if (orphanedFiles.length === 0) {
        return {
          deletedCount: 0,
          deletedFiles: [],
          message: 'No orphaned files found'
        }
      }
      
      // Delete orphaned files
      const deletedFiles = []
      for (const file of orphanedFiles) {
        try {
          const result = await cloudinary.uploader.destroy(file.publicId, {
            resource_type: file.type,
            invalidate: true
          })
          
          if (result.result === 'ok') {
            deletedFiles.push(file.publicId)
            console.log(`✅ Deleted: ${file.publicId}`)
          }
        } catch (err) {
          console.warn(`⚠️ Failed to delete ${file.publicId}:`, err.message)
        }
      }
      
      console.log(`🎉 Cleanup complete: ${deletedFiles.length} files deleted`)
      
      return {
        deletedCount: deletedFiles.length,
        deletedFiles,
        totalOrphans: orphanedFiles.length,
        message: `Deleted ${deletedFiles.length} orphaned files`
      }
    } catch (error) {
      console.error('❌ Cleanup error:', error)
      throw new Error(`Cleanup failed: ${error.message}`)
    }
  }
}

export const uploadModel = new UploadModel()
export default uploadModel
