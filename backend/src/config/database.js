// Database configuration with Cloudinary persistence for production
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import cloudinary from './cloudinary.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const DATA_PATH = path.join(__dirname, '../../../public/mockData.json')
export const UPLOADS_PATH = path.join(__dirname, '../../../public/uploads')
const CLOUDINARY_DATA_FILE = 'hawk-taekwondo/data/mockData.json'

// Ensure directories exist
export function ensureDirectories() {
  if (!fs.existsSync(path.dirname(DATA_PATH))) {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })
  }
  
  if (!fs.existsSync(UPLOADS_PATH)) {
    fs.mkdirSync(UPLOADS_PATH, { recursive: true })
  }
}

// JSON file operations with Cloudinary backup for production
export class JSONDatabase {
  constructor(filePath) {
    this.filePath = filePath
    this.useCloudinary = process.env.NODE_ENV === 'production'
  }

  async read() {
    try {
      // In production, try to read from Cloudinary first
      if (this.useCloudinary) {
        try {
          const result = await cloudinary.api.resource(CLOUDINARY_DATA_FILE, { resource_type: 'raw' })
          const response = await fetch(result.secure_url)
          const data = await response.json()
          
          // Cache locally
          fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2))
          return data
        } catch (cloudError) {
          console.warn('Could not load from Cloudinary:', cloudError.message)
        }
      }
      
      // Fallback to local file
      if (!fs.existsSync(this.filePath)) {
        return null
      }
      const fileData = fs.readFileSync(this.filePath, 'utf8')
      return JSON.parse(fileData)
    } catch (error) {
      console.error('Database read error:', error)
      return null
    }
  }

  async write(data) {
    try {
      // Write to local file first
      const backupPath = `${this.filePath}.bak`
      if (fs.existsSync(this.filePath)) {
        fs.copyFileSync(this.filePath, backupPath)
      }
      
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2))
      
      // In production, also upload to Cloudinary
      if (this.useCloudinary) {
        try {
          await cloudinary.uploader.upload(this.filePath, {
            public_id: CLOUDINARY_DATA_FILE,
            resource_type: 'raw',
            overwrite: true
          })
        } catch (cloudError) {
          console.error('Could not backup to Cloudinary:', cloudError.message)
        }
      }
      
      return true
    } catch (error) {
      console.error('Database write error:', error)
      return false
    }
  }

  exists() {
    return fs.existsSync(this.filePath)
  }
}

export const db = new JSONDatabase(DATA_PATH)