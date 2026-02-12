// Startup Script
// Ensures data migration and system health before starting

import dotenv from 'dotenv'
import { connectDB, disconnectDB } from '../config/mongodb.js'
import SchoolData from '../models/SchoolData.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from backend/.env
const envPath = path.join(__dirname, '../../.env')
dotenv.config({ path: envPath })

console.log('🚀 Startup script loaded')
console.log('📍 ENV file:', envPath)
console.log('🔗 MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set')

// Helper to convert object with numeric keys to array
function objectToArray(obj) {
  if (!obj) return []
  if (Array.isArray(obj)) return obj
  if (typeof obj !== 'object') return []
  
  const keys = Object.keys(obj)
  if (keys.length === 0) return []
  
  const isNumericKeys = keys.every(key => /^\d+$/.test(key))
  
  if (isNumericKeys) {
    return keys
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(key => obj[key])
      .filter(item => item !== null && item !== undefined)
  }
  
  return []
}

// Normalize data structure from JSON format to MongoDB format
function normalizeData(jsonData) {
  const normalized = { ...jsonData }
  
  const cleanArray = (arr, requiredFields = []) => {
    if (!arr) return []
    const arrayData = objectToArray(arr)
    return arrayData.filter(item => {
      if (!item || typeof item !== 'object') return false
      return requiredFields.length === 0 || requiredFields.every(field => item[field])
    })
  }
  
  // Normalize all array fields
  if (normalized.schoolInfo?.hours) {
    normalized.schoolInfo.hours = cleanArray(normalized.schoolInfo.hours)
  }
  
  if (normalized.home?.features) {
    normalized.home.features = cleanArray(normalized.home.features, ['icon', 'title'])
  }
  
  if (normalized.about?.stats) {
    normalized.about.stats = cleanArray(normalized.about.stats, ['number', 'label'])
  }
  
  if (normalized.about?.values) {
    normalized.about.values = cleanArray(normalized.about.values, ['icon', 'title'])
  }
  
  if (normalized.programs) {
    const programsArray = cleanArray(normalized.programs, ['name'])
    normalized.programs = programsArray.map(program => ({
      ...program,
      benefits: cleanArray(program.benefits || {})
    }))
  }
  
  if (normalized.instructors) {
    normalized.instructors = cleanArray(normalized.instructors, ['name'])
  }
  
  if (normalized.testimonials) {
    normalized.testimonials = cleanArray(normalized.testimonials, ['name', 'comment'])
  }
  
  if (normalized.classSchedule) {
    if (normalized.classSchedule.batches) {
      const batchesArray = cleanArray(normalized.classSchedule.batches, ['name'])
      normalized.classSchedule.batches = batchesArray.map(batch => ({
        ...batch,
        days: cleanArray(batch.days || {})
      }))
    }
    
    if (normalized.classSchedule.dailySchedule) {
      const dailyScheduleArray = cleanArray(normalized.classSchedule.dailySchedule, ['day'])
      normalized.classSchedule.dailySchedule = dailyScheduleArray.map(day => ({
        ...day,
        classes: cleanArray(day.classes || {})
      }))
    }
  }
  
  if (normalized.gallery?.featured) {
    normalized.gallery.featured = cleanArray(normalized.gallery.featured)
  }
  
  if (normalized.videos) {
    normalized.videos = cleanArray(normalized.videos)
  }
  
  return normalized
}

async function ensureDataMigration() {
  console.log('\n🔍 Checking MongoDB data status...')
  
  try {
    console.log('🔄 Connecting to MongoDB...')
    await connectDB()
    console.log('✅ MongoDB connected')
    
    const existingData = await SchoolData.findOne()
    
    if (existingData) {
      console.log('✅ MongoDB already has data')
      console.log(`   Document ID: ${existingData._id}`)
      console.log(`   Programs: ${existingData.programs?.length || 0}`)
      console.log(`   Instructors: ${existingData.instructors?.length || 0}`)
      console.log(`   Testimonials: ${existingData.testimonials?.length || 0}`)
      console.log(`   Gallery Items: ${existingData.gallery?.featured?.length || 0}`)
      console.log(`   Videos: ${existingData.videos?.length || 0}`)
      console.log(`   Last Updated: ${existingData.updatedAt}`)
      return true
    }
    
    console.log('📦 MongoDB is empty - running initial migration...')
    
    const mockDataPath = path.join(__dirname, '../../../public/mockData.json')
    
    if (!fs.existsSync(mockDataPath)) {
      console.warn('⚠️  mockData.json not found - creating empty document')
      await SchoolData.create({
        schoolInfo: {
          name: 'Hawk Taekwondo Training Centre',
          tagline: 'Find your strength. Build your confidence.',
          hours: []
        },
        home: { hero: {}, features: [] },
        about: { hero: {}, stats: [], values: [], cta: {} },
        programs: [],
        programsPage: { hero: {} },
        schedulePage: { hero: {} },
        contactPage: { hero: {} },
        facultyPage: { hero: {} },
        instructors: [],
        testimonials: [],
        classSchedule: { batches: [], dailySchedule: [] },
        gallery: { featured: [] },
        videos: []
      })
      console.log('✅ Empty document created')
      return true
    }
    
    console.log(`📖 Reading mockData.json from: ${mockDataPath}`)
    const jsonContent = fs.readFileSync(mockDataPath, 'utf8')
    const jsonData = JSON.parse(jsonContent)
    console.log('✅ JSON data loaded')
    
    console.log('🔄 Normalizing data structure...')
    const normalizedData = normalizeData(jsonData)
    console.log('✅ Data normalized')
    
    console.log('💾 Creating MongoDB document...')
    const newDoc = await SchoolData.create(normalizedData)
    
    console.log('✅ Initial data migrated successfully')
    console.log(`   Document ID: ${newDoc._id}`)
    console.log(`   Programs: ${newDoc.programs?.length || 0}`)
    console.log(`   Instructors: ${newDoc.instructors?.length || 0}`)
    console.log(`   Testimonials: ${newDoc.testimonials?.length || 0}`)
    console.log(`   Gallery Items: ${newDoc.gallery?.featured?.length || 0}`)
    console.log(`   Videos: ${newDoc.videos?.length || 0}`)
    
    return true
    
  } catch (error) {
    console.error('❌ Migration check failed:', error.message)
    console.error('Stack trace:', error.stack)
    return false
  } finally {
    console.log('🔄 Disconnecting from MongoDB...')
    await disconnectDB()
    console.log('✅ MongoDB disconnected')
  }
}

async function runStartup() {
  console.log('=' .repeat(60))
  console.log('🚀 STARTUP CHECK - Hawk Taekwondo System')
  console.log('=' .repeat(60))
  
  const migrationSuccess = await ensureDataMigration()
  
  console.log('\n' + '='.repeat(60))
  if (migrationSuccess) {
    console.log('✅ STARTUP CHECK PASSED - Ready to start server')
  } else {
    console.log('❌ STARTUP CHECK FAILED - Cannot start server')
  }
  console.log('=' .repeat(60))
  
  return migrationSuccess
}

// Run if called directly
const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
console.log('🔍 Is main module:', isMainModule)
console.log('   import.meta.url:', import.meta.url)
console.log('   process.argv[1]:', process.argv[1])

if (isMainModule) {
  console.log('▶️  Running startup check...\n')
  runStartup()
    .then(success => {
      console.log('\n👋 Exiting with code:', success ? 0 : 1)
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
} else {
  console.log('📦 Loaded as module (not running)')
}

export default runStartup
