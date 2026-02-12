// File Validator
// Validates uploaded files

import path from 'path'

export class FileValidator {
  constructor() {
    // Accept all file types - no restrictions
    this.imageExts = [] // Will accept any extension
    this.videoExts = [] // Will accept any extension
    this.maxVideoSize = Infinity // No size limit
    this.maxImageSize = Infinity // No size limit
  }

  validate(file) {
    if (!file || !file.name) {
      return { isValid: false, error: 'No file provided' }
    }

    // Accept all file types and sizes
    console.log(`✅ Accepting file: ${file.name} (${file.size} bytes)`)
    return { isValid: true }
  }

  isImage(ext, mimetype = null) {
    // Accept common image formats and more
    const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.svg', '.ico', '.heic', '.heif', '.raw', '.cr2', '.nef', '.arw', '.dng']
    return imageExts.includes(ext.toLowerCase()) || (mimetype && mimetype.startsWith('image/'))
  }

  isVideo(ext, mimetype = null) {
    // Accept common video formats and more
    const videoExts = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v', '.3gp', '.ogv', '.ts', '.mts', '.m2ts']
    return videoExts.includes(ext.toLowerCase()) || (mimetype && mimetype.startsWith('video/'))
  }

  getExtension(filename) {
    return path.extname(filename).toLowerCase()
  }
}

export const fileValidator = new FileValidator()
export default fileValidator