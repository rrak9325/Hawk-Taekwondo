// File Validator
// Validates uploaded files

import path from 'path'
import fs from 'fs'

const MAX_IMAGE_SIZE = 50 * 1024 * 1024 // 50MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024 // 200MB

export class FileValidator {
  constructor() {
    this.imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.svg']
    this.videoExts = ['.mp4', '.webm', '.mov', '.avi', '.mkv']
    this.imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml']
    this.videoMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
  }

  // Remove debug logging in production
  validate(file) {
    if (!file || !file.name) {
      return { isValid: false, error: 'No file provided' }
    }

    const ext = this.getExtension(file.name)
    const mimetype = file.mimetype
    
    // Debug logging only in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('File validation debug:', {
        fileName: file.name,
        extractedExt: ext,
        mimetype: mimetype
      })
    }

    // Check if file type is allowed
    const isImage = this.isImage(ext, mimetype)
    const isVideo = this.isVideo(ext, mimetype)

    if (!isImage && !isVideo) {
      return { 
        isValid: false, 
        error: `File type not allowed. Allowed: images (${this.imageExts.join(', ')}) and videos (${this.videoExts.join(', ')})` 
      }
    }

    // Check file size
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return { 
        isValid: false, 
        error: `Image too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: ${MAX_IMAGE_SIZE / 1024 / 1024}MB` 
      }
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return { 
        isValid: false, 
        error: `Video too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: ${MAX_VIDEO_SIZE / 1024 / 1024}MB` 
      }
    }

    // Validate magic numbers for security
    if (file.path || file.tempFilePath) {
      const magicValidation = this.validateMagicNumbers(file.path || file.tempFilePath, ext)
      if (!magicValidation.isValid) {
        return magicValidation
      }
    }

    return { isValid: true }
  }

  validateMagicNumbers(filePath, ext) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Magic number validation for:', { filePath, ext })
      }
      
      const buffer = Buffer.alloc(16) // Read more bytes for better detection
      const fd = fs.openSync(filePath, 'r')
      fs.readSync(fd, buffer, 0, 16, 0)
      fs.closeSync(fd)

      const hex = buffer.toString('hex').toUpperCase()
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('File hex signature:', hex.substring(0, 24))
      }

      // Improved magic number signatures
      const signatures = {
        '.jpg': ['FFD8FF'],
        '.jpeg': ['FFD8FF'],
        '.png': ['89504E47'],
        '.gif': ['474946383761', '474946383961'], // GIF87a, GIF89a
        '.webp': ['52494646'], // RIFF
        '.bmp': ['424D'],
        '.svg': ['3C3F786D6C', '3C737667', '3C21444F43'], // <?xml, <svg, <!DOC
        '.mp4': ['00000018667479706D703432', '00000020667479706D703432', '667479706D703432'],
        '.webm': ['1A45DFA3'],
        '.mov': ['6674797071742020', '6674797066726565'], // ftypqt  , ftypfree
        '.avi': ['52494646']
      }

      const expectedSignatures = signatures[ext.toLowerCase()] || []
      
      // If no signatures defined for this extension, allow it (less strict)
      if (expectedSignatures.length === 0) {
        console.warn(`No magic number validation for extension: ${ext}`)
        return { isValid: true }
      }
      
      const isValid = expectedSignatures.some(sig => hex.startsWith(sig))

      if (!isValid) {
        console.warn(`Magic number mismatch for ${ext}:`, {
          expected: expectedSignatures,
          actual: hex.substring(0, 24)
        })
        return { 
          isValid: false, 
          error: `File content does not match extension ${ext}. Possible file type mismatch or corrupted file.` 
        }
      }

      return { isValid: true }
    } catch (error) {
      // If we can't read the file, allow it but log warning
      console.warn('Could not validate magic numbers:', error.message)
      return { isValid: true }
    }
  }

  isImage(ext, mimetype = null) {
    return this.imageExts.includes(ext.toLowerCase()) || 
           (mimetype && this.imageMimeTypes.includes(mimetype.toLowerCase()))
  }

  isVideo(ext, mimetype = null) {
    return this.videoExts.includes(ext.toLowerCase()) || 
           (mimetype && this.videoMimeTypes.includes(mimetype.toLowerCase()))
  }

  getExtension(filename) {
    const ext = path.extname(filename).toLowerCase()
    // Handle edge case where filename might have multiple extensions
    if (!ext && filename.includes('.')) {
      // Fallback: get the last part after the last dot
      const parts = filename.toLowerCase().split('.')
      return '.' + parts[parts.length - 1]
    }
    return ext
  }
}

export const fileValidator = new FileValidator()
export default fileValidator