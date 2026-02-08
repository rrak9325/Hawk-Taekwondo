// Image optimization utility for high-quality images
class ImageOptimizer {
  constructor() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  // Compress image while maintaining quality
  async compressImage(file, options = {}) {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.85,
      format = 'image/jpeg'
    } = options

    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        const { width, height } = this.calculateDimensions(
          img.width, 
          img.height, 
          maxWidth, 
          maxHeight
        )

        // Set canvas size
        this.canvas.width = width
        this.canvas.height = height

        // Enable image smoothing for better quality
        this.ctx.imageSmoothingEnabled = true
        this.ctx.imageSmoothingQuality = 'high'

        // Draw and compress
        this.ctx.drawImage(img, 0, 0, width, height)
        
        this.canvas.toBlob(resolve, format, quality)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  // Create multiple sizes for responsive images
  async createResponsiveImages(file) {
    const sizes = [
      { name: 'thumbnail', maxWidth: 300, maxHeight: 300, quality: 0.8 },
      { name: 'medium', maxWidth: 800, maxHeight: 600, quality: 0.85 },
      { name: 'large', maxWidth: 1920, maxHeight: 1080, quality: 0.9 },
      { name: 'original', maxWidth: 3840, maxHeight: 2160, quality: 0.95 }
    ]

    const results = {}
    
    for (const size of sizes) {
      const compressed = await this.compressImage(file, size)
      results[size.name] = compressed
    }

    return results
  }

  // Calculate dimensions maintaining aspect ratio
  calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
    let { width, height } = { width: originalWidth, height: originalHeight }

    // Scale down if larger than max dimensions
    if (width > maxWidth) {
      height = (height * maxWidth) / width
      width = maxWidth
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height
      height = maxHeight
    }

    return { width: Math.round(width), height: Math.round(height) }
  }

  // Optimize video thumbnail
  async createVideoThumbnail(videoFile, timeInSeconds = 1) {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      video.onloadedmetadata = () => {
        canvas.width = Math.min(video.videoWidth, 1920)
        canvas.height = Math.min(video.videoHeight, 1080)
        
        video.currentTime = timeInSeconds
      }

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(resolve, 'image/jpeg', 0.85)
      }

      video.src = URL.createObjectURL(videoFile)
    })
  }

  // Check if file needs optimization
  needsOptimization(file) {
    const maxSize = 2 * 1024 * 1024 // 2MB
    return file.size > maxSize
  }

  // Get file size in human readable format
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

export default new ImageOptimizer()