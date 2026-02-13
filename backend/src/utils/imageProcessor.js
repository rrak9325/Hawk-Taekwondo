// Image Processor
// Handles image optimization and processing

import fs from 'fs'
import path from 'path'
import { UPLOADS_PATH } from '../config/database.js'

// Dynamic Sharp import
let sharp
try {
  const sharpModule = await import('sharp')
  sharp = sharpModule.default
  console.log('✅ Sharp loaded successfully!')
} catch (error) {
  console.error('❌ Failed to load Sharp:', error.message)
  console.log('📸 Image optimization will be disabled')
}

export class ImageProcessor {
  constructor() {
    this.configs = {
      hero: {
        width: 1920,
        height: 1080,
        quality: 85,
        formats: ['webp', 'jpg']
      },
      gallery: {
        width: 800,
        height: 600,
        quality: 80,
        formats: ['webp', 'jpg']
      },
      thumbnail: {
        width: 400,
        height: 300,
        quality: 75,
        formats: ['webp', 'jpg']
      },
      profile: {
        width: 400,
        height: 400,
        quality: 80,
        formats: ['webp', 'jpg']
      }
    }
  }

  isAvailable() {
    return !!sharp
  }

  async process(file) {
    if (!sharp) {
      throw new Error('Image processing not available - Sharp not loaded')
    }

    // Read file buffer
    let fileBuffer
    if (file.tempFilePath) {
      fileBuffer = fs.readFileSync(file.tempFilePath)
    } else if (file.path) {
      // express-fileupload uses file.path for temporary file location
      fileBuffer = fs.readFileSync(file.path)
    } else {
      fileBuffer = file.data
    }

    // Detect image type
    const imageType = this.detectImageType(file.name, file.size)
    const config = this.configs[imageType]

    console.log(`🎯 Processing ${file.name} as ${imageType}`)

    // Process image
    const results = await this.processWithConfig(fileBuffer, config, file.name)

    // Cleanup temp file
    if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
      fs.unlinkSync(file.tempFilePath)
    } else if (file.path && fs.existsSync(file.path)) {
      // Also cleanup express-fileupload temp file
      fs.unlinkSync(file.path)
    }

    return results
  }

  async processWithConfig(inputBuffer, config, filename) {
    const results = []
    const baseFilename = path.parse(filename).name

    try {
      const metadata = await sharp(inputBuffer).metadata()
      console.log(`🖼️ Processing: ${filename} (${metadata.width}x${metadata.height})`)

      for (const format of config.formats) {
        let pipeline = sharp(inputBuffer)
          .resize(config.width, config.height, {
            fit: 'cover',
            position: 'center',
            withoutEnlargement: false
          })
          .sharpen()

        // Apply format-specific optimizations
        if (format === 'webp') {
          pipeline = pipeline.webp({
            quality: config.quality,
            effort: 6,
            smartSubsample: true
          })
        } else if (format === 'jpg' || format === 'jpeg') {
          pipeline = pipeline.jpeg({
            quality: config.quality,
            progressive: true,
            mozjpeg: true
          })
        }

        const outputFilename = `${Date.now()}-${baseFilename}-${config.width}x${config.height}.${format}`
        const outputPath = path.join(UPLOADS_PATH, outputFilename)

        await pipeline.toFile(outputPath)

        const stats = fs.statSync(outputPath)
        const compressionRatio = ((inputBuffer.length - stats.size) / inputBuffer.length * 100).toFixed(1)

        console.log(`✅ Created ${outputFilename} - ${stats.size} bytes (${compressionRatio}% smaller)`)

        results.push({
          format,
          filename: outputFilename,
          url: `/uploads/${outputFilename}`,
          size: stats.size,
          dimensions: `${config.width}x${config.height}`,
          compressionRatio
        })
      }

      return results
    } catch (error) {
      console.error('Image processing error:', error)
      throw error
    }
  }

  detectImageType(filename, size) {
    const name = filename.toLowerCase()

    if (name.includes('hero') || name.includes('banner') || name.includes('background')) {
      return 'hero'
    }

    if (name.includes('profile') || name.includes('avatar') || name.includes('instructor') || name.includes('staff')) {
      return 'profile'
    }

    if (size > 2 * 1024 * 1024) { // > 2MB
      return 'gallery'
    }

    return 'thumbnail'
  }
}

export const imageProcessor = new ImageProcessor()
export default imageProcessor