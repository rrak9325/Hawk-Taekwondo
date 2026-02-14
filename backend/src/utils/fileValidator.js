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

  validate(file) {
    if (!file || !file.name) {
      return { isValid: false, error: 'No file provided' }
    }

    const ext = this.getExtension(file.name)
    const mimetype = file.mimetype

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
      const buffer = Buffer.alloc(12)
      const fd = fs.openSync(filePath, 'r')
      fs.readSync(fd, buffer, 0, 12, 0)
      fs.closeSync(fd)

      const hex = buffer.toString('hex').toUpperCase()

      // Magic number signatures
      const signatures = {
        '.jpg': ['FFD8FF'],
        '.jpeg': ['FFD8FF'],
        '.png': ['89504E47'],
        '.gif': ['474946383761', '474946383961'],
        '.webp': ['52494646'],
        '.bmp': ['424D'],
        '.mp4': ['00000018667479706D703432', '00000020667479706D703432', '667479706D703432'],
        '.webm': ['1A45DFA3'],
        '.mov': ['6674797071742020'],
        '.avi': ['52494646']
      }

      const expectedSignatures = signatures[ext.toLowerCase()] || []
      const isValid = expectedSignatures.some(sig => hex.startsWith(sig))

      if (!isValid) {
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
    return path.extname(filename).toLowerCase()
  }
}

export const fileValidator = new FileValidator()
export default fileValidator