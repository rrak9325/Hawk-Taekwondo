// Database configuration (currently using JSON file storage)
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const DATA_PATH = path.join(__dirname, '../../../public/mockData.json')
export const UPLOADS_PATH = path.join(__dirname, '../../../public/uploads')

// Ensure directories exist
export function ensureDirectories() {
  if (!fs.existsSync(path.dirname(DATA_PATH))) {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })
  }
  
  if (!fs.existsSync(UPLOADS_PATH)) {
    fs.mkdirSync(UPLOADS_PATH, { recursive: true })
  }
}

// JSON file operations
export class JSONDatabase {
  constructor(filePath) {
    this.filePath = filePath
  }

  read() {
    try {
      if (!fs.existsSync(this.filePath)) {
        return null
      }
      const data = fs.readFileSync(this.filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Database read error:', error)
      return null
    }
  }

  write(data) {
    try {
      // Create backup
      const backupPath = `${this.filePath}.bak`
      if (fs.existsSync(this.filePath)) {
        fs.copyFileSync(this.filePath, backupPath)
      }
      
      // Write new data
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2))
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