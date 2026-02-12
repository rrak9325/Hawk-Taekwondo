// One-time Migration Script: JSON to MongoDB
// Safely migrates all data from mockData.json to MongoDB
// Preserves all Cloudinary URLs, relationships, and data structure

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB, disconnectDB } from '../config/mongodb.js'
import SchoolData from '../models/SchoolData.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Helper to convert object with numeric keys to array
function objectToArray(obj) {
  if (!obj) return []
  if (Array.isArray(obj)) return obj
  if (typeof obj !== 'object') return []
  
  // Check if it's an object with numeric keys (0, 1, 2, etc.)
  const keys = Object.keys(obj)
  if (keys.length === 0) return []
  
  const isNumericKeys = keys.every(key => /^\d+$/.test(key))
  
  if (isNumericKeys) {
    // Convert to array, preserving order
    const arr = keys
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(key => obj[key])
      .filter(item => item !== null && item !== undefined)
    return arr
  }
  
  // If not numeric keys, return empty array (don't convert arbitrary objects)
  return []
}

// Normalize data structure from JSON format to MongoDB format
function normalizeData(jsonData) {
  const normalized = { ...jsonData }
  
  // Helper to clean array - remove nulls and ensure valid objects
  const cleanArray = (arr) => {
    if (!arr) return []
    const arrayData = objectToArray(arr)
    return arrayData.filter(item => item !== null && item !== undefined && typeof item === 'object')
  }
  
  // Normalize schoolInfo.hours
  if (normalized.schoolInfo?.hours) {
    normalized.schoolInfo.hours = cleanArray(normalized.schoolInfo.hours)
  }
  
  // Normalize home.features
  if (normalized.home?.features) {
    normalized.home.features = cleanArray(normalized.home.features)
  }
  
  // Normalize about.stats
  if (normalized.about?.stats) {
    normalized.about.stats = cleanArray(normalized.about.stats)
  }
  
  // Normalize about.values
  if (normalized.about?.values) {
    normalized.about.values = cleanArray(normalized.about.values)
  }
  
  // Normalize programs
  if (normalized.programs) {
    const programsArray = cleanArray(normalized.programs)
    normalized.programs = programsArray.map(program => ({
      ...program,
      benefits: cleanArray(program.benefits || {})
    }))
  }
  
  // Normalize instructors
  if (normalized.instructors) {
    normalized.instructors = cleanArray(normalized.instructors)
  }
  
  // Normalize testimonials
  if (normalized.testimonials) {
    normalized.testimonials = cleanArray(normalized.testimonials)
  }
  
  // Normalize classSchedule
  if (normalized.classSchedule) {
    // Normalize batches
    if (normalized.classSchedule.batches) {
      const batchesArray = cleanArray(normalized.classSchedule.batches)
      normalized.classSchedule.batches = batchesArray.map(batch => ({
        ...batch,
        days: cleanArray(batch.days || {})
      }))
    }
    
    // Normalize dailySchedule
    if (normalized.classSchedule.dailySchedule) {
      const dailyScheduleArray = cleanArray(normalized.classSchedule.dailySchedule)
      normalized.classSchedule.dailySchedule = dailyScheduleArray.map(day => ({
        ...day,
        classes: cleanArray(day.classes || {})
      }))
    }
  }
  
  // Normalize gallery
  if (normalized.gallery?.featured) {
    normalized.gallery.featured = cleanArray(normalized.gallery.featured)
  }
  
  // Normalize videos
  if (normalized.videos) {
    normalized.videos = cleanArray(normalized.videos)
  }
  
  return normalized
}

async function migrate() {
  console.log('🚀 Starting MongoDB Migration')
  console.log('=' .repeat(60))
  
  try {
    // Step 1: Connect to MongoDB
    await connectDB()
    
    // Step 2: Read JSON data
    const jsonPath = path.join(__dirname, '../../../public/mockData.json')
    console.log(`📖 Reading JSON data from: ${jsonPath}`)
    
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`JSON file not found at: ${jsonPath}`)
    }
    
    const jsonContent = fs.readFileSync(jsonPath, 'utf8')
    const jsonData = JSON.parse(jsonContent)
    console.log('✅ JSON data loaded successfully')
    console.log(`📊 Data size: ${(jsonContent.length / 1024).toFixed(2)} KB`)
    
    // Step 3: Normalize data structure
    console.log('🔄 Normalizing data structure...')
    const normalizedData = normalizeData(jsonData)
    console.log('✅ Data normalized')
    
    // Remove MongoDB metadata fields if they exist
    delete normalizedData._id
    delete normalizedData.__v
    delete normalizedData.createdAt
    delete normalizedData.updatedAt
    
    // Log what we're migrating
    console.log('\n📦 Migration Summary:')
    console.log(`   - School Info: ${normalizedData.schoolInfo?.name || 'N/A'}`)
    console.log(`   - Programs: ${normalizedData.programs?.length || 0} items`)
    console.log(`   - Instructors: ${normalizedData.instructors?.length || 0} items`)
    console.log(`   - Testimonials: ${normalizedData.testimonials?.length || 0} items`)
    console.log(`   - Schedule Batches: ${normalizedData.classSchedule?.batches?.length || 0} items`)
    console.log(`   - Gallery Items: ${normalizedData.gallery?.featured?.length || 0} items`)
    console.log(`   - Videos: ${normalizedData.videos?.length || 0} items`)
    console.log(`   - Cloudinary URLs: Preserved as-is`)
    
    // Step 4: Check if data already exists
    const existingData = await SchoolData.findOne()
    
    if (existingData) {
      console.log('\n⚠️  WARNING: Data already exists in MongoDB')
      console.log('   Existing document ID:', existingData._id)
      console.log('   Created at:', existingData.createdAt)
      console.log('   Last updated:', existingData.updatedAt)
      
      // Delete and recreate to avoid version conflicts
      console.log('\n🗑️  Deleting existing document...')
      await SchoolData.deleteOne({ _id: existingData._id })
      console.log('✅ Existing document deleted')
      
      console.log('\n💾 Creating fresh document...')
      const newDoc = await SchoolData.create(normalizedData)
      console.log('✅ Document created successfully')
      console.log(`   Document ID: ${newDoc._id}`)
    } else {
      // Step 5: Create new document
      console.log('\n💾 Creating new MongoDB document...')
      const newDoc = await SchoolData.create(normalizedData)
      console.log('✅ Document created successfully')
      console.log(`   Document ID: ${newDoc._id}`)
    }
    
    // Step 6: Verify migration
    console.log('\n🔍 Verifying migration...')
    const verifyDoc = await SchoolData.findOne()
    
    if (!verifyDoc) {
      throw new Error('Verification failed: Document not found after migration')
    }
    
    console.log('✅ Verification passed')
    console.log(`   Programs in DB: ${verifyDoc.programs?.length || 0}`)
    console.log(`   Instructors in DB: ${verifyDoc.instructors?.length || 0}`)
    console.log(`   Testimonials in DB: ${verifyDoc.testimonials?.length || 0}`)
    console.log(`   Gallery items in DB: ${verifyDoc.gallery?.featured?.length || 0}`)
    
    // Step 7: Create backup of JSON file
    const backupPath = jsonPath + '.pre-migration-backup'
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(jsonPath, backupPath)
      console.log(`\n💾 Backup created: ${backupPath}`)
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!')
    console.log('=' .repeat(60))
    console.log('\n📋 Next Steps:')
    console.log('   1. Update backend services to use MongoDB')
    console.log('   2. Test admin panel operations')
    console.log('   3. Verify frontend data display')
    console.log('   4. Remove JSON database dependencies')
    console.log('\n⚠️  Keep the backup file until migration is fully verified')
    
  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  } finally {
    await disconnectDB()
  }
}

// Run migration
migrate()
