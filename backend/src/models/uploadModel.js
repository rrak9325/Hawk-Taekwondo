// Upload Model
// Data access for file operations

import fs from 'fs'
import path from 'path'
import { UPLOADS_PATH } from '../config/database.js'
import dataModel from './dataModel.js'

export class UploadModel {
  async saveVideo(file) {
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase()}`
    const uploadPath = path.join(UPLOADS_PATH, safeName)
    
    await file.mv(uploadPath)
    
    return {
      filename: safeName,
      url: `/uploads/${safeName}`,
      size: file.size
    }
  }

  async saveProcessedImages(processedImages) {
    // Images are already saved by imageProcessor
    // This method would handle database records if needed
    return processedImages
  }

  async deleteFile(filePath) {
    try {
      const fileName = path.basename(filePath)
      const baseName = path.parse(fileName).name
      const fullPath = path.join(UPLOADS_PATH, fileName)
      
      let deletedFiles = []
      
      // Delete main file
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
        deletedFiles.push(fileName)
      }
      
      // Delete related optimized versions
      const files = fs.readdirSync(UPLOADS_PATH)
      const relatedFiles = files.filter(file => {
        const fileBaseName = path.parse(file).name
        return fileBaseName.startsWith(baseName.split('-')[0]) && file !== fileName
      })
      
      relatedFiles.forEach(relatedFile => {
        const relatedPath = path.join(UPLOADS_PATH, relatedFile)
        if (fs.existsSync(relatedPath)) {
          fs.unlinkSync(relatedPath)
          deletedFiles.push(relatedFile)
        }
      })
      
      console.log('Deleted files:', deletedFiles)
      
      return {
        success: true,
        deletedFiles,
        message: `Deleted ${deletedFiles.length} file(s)`
      }
    } catch (error) {
      console.error('Delete file model error:', error)
      throw error
    }
  }

  async cleanupOrphans() {
    try {
      const data = dataModel.read()
      if (!data) {
        throw new Error('No data file found')
      }
      
      const dataStr = JSON.stringify(data)
      const files = fs.readdirSync(UPLOADS_PATH)
      
      const usedFiles = new Set()
      const regex = /\/uploads\/([^"'\s]+)/g
      let match
      
      while ((match = regex.exec(dataStr)) !== null) {
        usedFiles.add(match[1])
      }
      
      let deletedCount = 0
      for (const file of files) {
        if (!usedFiles.has(file)) {
          fs.unlinkSync(path.join(UPLOADS_PATH, file))
          deletedCount++
        }
      }
      
      return {
        success: true,
        deletedCount
      }
    } catch (error) {
      console.error('Cleanup model error:', error)
      throw error
    }
  }
}

export const uploadModel = new UploadModel()
export default uploadModel