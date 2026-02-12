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
        console.warn('⚠️  Data file not found:', this.filePath)
        return null
      }
      
      const data = fs.readFileSync(this.filePath, 'utf8')
      
      // Validate JSON before parsing
      if (!data || data.trim().length === 0) {
        console.error('❌ Empty data file')
        return null
      }
      
      try {
        const parsed = JSON.parse(data)
        return parsed
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError.message)
        console.error('   File:', this.filePath)
        console.error('   Position:', parseError.message.match(/position (\d+)/)?.[1] || 'unknown')
        
        // Attempt to restore from backup
        const backupPath = `${this.filePath}.bak`
        if (fs.existsSync(backupPath)) {
          console.log('🔄 Attempting to restore from backup...')
          try {
            const backupData = fs.readFileSync(backupPath, 'utf8')
            const backupParsed = JSON.parse(backupData)
            console.log('✅ Successfully restored from backup')
            // Restore the main file
            fs.copyFileSync(backupPath, this.filePath)
            return backupParsed
          } catch (backupError) {
            console.error('❌ Backup file also corrupted:', backupError.message)
          }
        }
        
        return null
      }
    } catch (error) {
      console.error('❌ Database read error:', error)
      return null
    }
  }

  write(data) {
    try {
      // Validate data before writing
      if (!data || typeof data !== 'object') {
        console.error('❌ Invalid data: must be an object')
        return false
      }
      
      // Test JSON serialization before writing
      let jsonString
      try {
        jsonString = JSON.stringify(data, null, 2)
      } catch (stringifyError) {
        console.error('❌ JSON Stringify Error:', stringifyError.message)
        console.error('   Data contains circular references or non-serializable values')
        return false
      }
      
      // Validate JSON string
      if (!jsonString || jsonString.trim().length === 0) {
        console.error('❌ Empty JSON string generated')
        return false
      }
      
      // Create backup before writing
      const backupPath = `${this.filePath}.bak`
      if (fs.existsSync(this.filePath)) {
        try {
          fs.copyFileSync(this.filePath, backupPath)
          console.log('✅ Backup created:', backupPath)
        } catch (backupError) {
          console.warn('⚠️  Failed to create backup:', backupError.message)
          // Continue anyway - backup failure shouldn't block writes
        }
      }
      
      // Write to temporary file first (atomic write pattern)
      const tempPath = `${this.filePath}.tmp`
      fs.writeFileSync(tempPath, jsonString, 'utf8')
      
      // Verify the written file is valid JSON
      try {
        const verifyData = fs.readFileSync(tempPath, 'utf8')
        JSON.parse(verifyData)
      } catch (verifyError) {
        console.error('❌ Verification failed: written file is not valid JSON')
        fs.unlinkSync(tempPath)
        return false
      }
      
      // Atomic rename (replaces old file)
      fs.renameSync(tempPath, this.filePath)
      console.log('✅ Data written successfully')
      
      return true
    } catch (error) {
      console.error('❌ Database write error:', error)
      
      // Clean up temp file if it exists
      const tempPath = `${this.filePath}.tmp`
      if (fs.existsSync(tempPath)) {
        try {
          fs.unlinkSync(tempPath)
        } catch (cleanupError) {
          console.error('⚠️  Failed to clean up temp file:', cleanupError.message)
        }
      }
      
      return false
    }
  }

  exists() {
    return fs.existsSync(this.filePath)
  }
}

export const db = new JSONDatabase(DATA_PATH)