// Health Check Script
// Verifies backend, API, database, and data synchronization

import dotenv from 'dotenv'
import { connectDB, disconnectDB } from '../config/mongodb.js'
import SchoolData from '../models/SchoolData.js'
import fetch from 'node-fetch'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from backend/.env
const envPath = path.join(__dirname, '../../.env')
dotenv.config({ path: envPath })

const API_URL = process.env.API_URL || 'http://localhost:3001'

async function checkMongoDB() {
  console.log('\n🔍 Checking MongoDB Connection...')
  try {
    await connectDB()
    console.log('✅ MongoDB connected')
    
    const doc = await SchoolData.findOne()
    if (!doc) {
      console.log('⚠️  MongoDB is empty - no data found')
      return { success: false, message: 'No data in MongoDB' }
    }
    
    console.log('✅ MongoDB has data')
    console.log(`   Document ID: ${doc._id}`)
    console.log(`   Programs: ${doc.programs?.length || 0}`)
    console.log(`   Instructors: ${doc.instructors?.length || 0}`)
    console.log(`   Testimonials: ${doc.testimonials?.length || 0}`)
    console.log(`   Gallery Items: ${doc.gallery?.featured?.length || 0}`)
    console.log(`   Videos: ${doc.videos?.length || 0}`)
    console.log(`   Last Updated: ${doc.updatedAt}`)
    
    return { success: true, data: doc }
  } catch (error) {
    console.error('❌ MongoDB check failed:', error.message)
    return { success: false, message: error.message }
  }
}

async function checkAPI() {
  console.log('\n🔍 Checking API Endpoint...')
  try {
    const response = await fetch(`${API_URL}/api/data`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!response.ok) {
      console.error(`❌ API returned status ${response.status}`)
      return { success: false, message: `API status ${response.status}` }
    }
    
    const data = await response.json()
    console.log('✅ API is responding')
    console.log(`   Programs: ${data.programs?.length || 0}`)
    console.log(`   Instructors: ${data.instructors?.length || 0}`)
    console.log(`   Testimonials: ${data.testimonials?.length || 0}`)
    console.log(`   Gallery Items: ${data.gallery?.featured?.length || 0}`)
    console.log(`   Videos: ${data.videos?.length || 0}`)
    
    return { success: true, data }
  } catch (error) {
    console.error('❌ API check failed:', error.message)
    return { success: false, message: error.message }
  }
}

async function checkDataSync(mongoData, apiData) {
  console.log('\n🔍 Checking Data Synchronization...')
  
  if (!mongoData || !apiData) {
    console.error('❌ Cannot check sync - missing data')
    return { success: false, message: 'Missing data for comparison' }
  }
  
  const issues = []
  
  // Check programs
  if ((mongoData.programs?.length || 0) !== (apiData.programs?.length || 0)) {
    issues.push(`Programs count mismatch: MongoDB=${mongoData.programs?.length || 0}, API=${apiData.programs?.length || 0}`)
  }
  
  // Check instructors
  if ((mongoData.instructors?.length || 0) !== (apiData.instructors?.length || 0)) {
    issues.push(`Instructors count mismatch: MongoDB=${mongoData.instructors?.length || 0}, API=${apiData.instructors?.length || 0}`)
  }
  
  // Check testimonials
  if ((mongoData.testimonials?.length || 0) !== (apiData.testimonials?.length || 0)) {
    issues.push(`Testimonials count mismatch: MongoDB=${mongoData.testimonials?.length || 0}, API=${apiData.testimonials?.length || 0}`)
  }
  
  // Check gallery
  if ((mongoData.gallery?.featured?.length || 0) !== (apiData.gallery?.featured?.length || 0)) {
    issues.push(`Gallery count mismatch: MongoDB=${mongoData.gallery?.featured?.length || 0}, API=${apiData.gallery?.featured?.length || 0}`)
  }
  
  // Check videos
  if ((mongoData.videos?.length || 0) !== (apiData.videos?.length || 0)) {
    issues.push(`Videos count mismatch: MongoDB=${mongoData.videos?.length || 0}, API=${apiData.videos?.length || 0}`)
  }
  
  if (issues.length > 0) {
    console.error('❌ Data synchronization issues found:')
    issues.forEach(issue => console.error(`   - ${issue}`))
    return { success: false, issues }
  }
  
  console.log('✅ Data is synchronized between MongoDB and API')
  return { success: true }
}

async function runHealthCheck() {
  console.log('=' .repeat(60))
  console.log('🏥 HEALTH CHECK - Hawk Taekwondo System')
  console.log('=' .repeat(60))
  
  const results = {
    mongodb: null,
    api: null,
    sync: null,
    overall: false
  }
  
  try {
    // Check MongoDB
    results.mongodb = await checkMongoDB()
    
    // Check API
    results.api = await checkAPI()
    
    // Check Sync
    if (results.mongodb.success && results.api.success) {
      results.sync = await checkDataSync(results.mongodb.data, results.api.data)
    }
    
    // Overall status
    results.overall = results.mongodb.success && results.api.success && results.sync?.success
    
    console.log('\n' + '='.repeat(60))
    if (results.overall) {
      console.log('✅ HEALTH CHECK PASSED - All systems operational')
    } else {
      console.log('❌ HEALTH CHECK FAILED - Issues detected')
      if (!results.mongodb.success) console.log('   - MongoDB: FAILED')
      if (!results.api.success) console.log('   - API: FAILED')
      if (!results.sync?.success) console.log('   - Data Sync: FAILED')
    }
    console.log('=' .repeat(60))
    
    return results.overall
    
  } catch (error) {
    console.error('\n❌ Health check error:', error.message)
    return false
  } finally {
    await disconnectDB()
  }
}

// Run if called directly
const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]

if (isMainModule) {
  runHealthCheck()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export default runHealthCheck
