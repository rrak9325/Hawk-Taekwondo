// MongoDB Connection Test Script
// Verifies MongoDB is accessible and ready for migration

import { connectDB, disconnectDB } from '../config/mongodb.js'
import mongoose from 'mongoose'

async function testConnection() {
  console.log('🧪 Testing MongoDB Connection')
  console.log('=' .repeat(60))
  
  try {
    // Test connection
    await connectDB()
    
    // Get connection info
    const db = mongoose.connection.db
    const admin = db.admin()
    const info = await admin.serverInfo()
    
    console.log('✅ Connection successful!')
    console.log(`📍 Database: ${mongoose.connection.name}`)
    console.log(`🏠 Host: ${mongoose.connection.host}`)
    console.log(`🔢 Port: ${mongoose.connection.port}`)
    console.log(`📦 MongoDB Version: ${info.version}`)
    console.log(`💾 Storage Engine: ${info.storageEngine?.name || 'N/A'}`)
    
    // List collections
    const collections = await db.listCollections().toArray()
    console.log(`\n📚 Collections (${collections.length}):`)
    collections.forEach(col => {
      console.log(`   - ${col.name}`)
    })
    
    // Check if schooldata collection exists
    const hasSchoolData = collections.some(col => col.name === 'schooldata')
    if (hasSchoolData) {
      const count = await db.collection('schooldata').countDocuments()
      console.log(`\n✅ School data collection exists with ${count} document(s)`)
    } else {
      console.log(`\n⚠️  School data collection does not exist yet (will be created during migration)`)
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('🎉 MongoDB is ready for migration!')
    console.log('=' .repeat(60))
    console.log('\nNext step: Run migration with:')
    console.log('   npm run migrate')
    
  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message)
    console.error('\n📋 Troubleshooting:')
    console.error('   1. Ensure MongoDB is running:')
    console.error('      - Local: brew services start mongodb-community (macOS)')
    console.error('      - Local: sudo systemctl start mongodb (Linux)')
    console.error('      - Atlas: Check connection string in .env')
    console.error('   2. Verify MONGODB_URI in backend/.env')
    console.error('   3. Check firewall/network settings')
    console.error('   4. For Atlas: Whitelist your IP address')
    process.exit(1)
  } finally {
    await disconnectDB()
  }
}

testConnection()
