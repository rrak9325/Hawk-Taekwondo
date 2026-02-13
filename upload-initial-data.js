#!/usr/bin/env node
// Script to upload initial mockData.json to Cloudinary
// Run this before deploying to Render

import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from backend/.env
const envPath = path.join(__dirname, 'backend', '.env')
dotenv.config({ path: envPath })

console.log('=' .repeat(60))
console.log('📤 UPLOAD INITIAL DATA TO CLOUDINARY')
console.log('=' .repeat(60))

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

// Verify configuration
if (!cloudinary.config().cloud_name || !cloudinary.config().api_key || !cloudinary.config().api_secret) {
  console.error('❌ Cloudinary credentials not found!')
  console.error('💡 Make sure backend/.env file exists with:')
  console.error('   CLOUDINARY_CLOUD_NAME=your_cloud_name')
  console.error('   CLOUDINARY_API_KEY=your_api_key')
  console.error('   CLOUDINARY_API_SECRET=your_api_secret')
  process.exit(1)
}

console.log('✅ Cloudinary configured')
console.log(`📦 Cloud Name: ${cloudinary.config().cloud_name}`)

// Upload mockData.json
const mockDataPath = path.join(__dirname, 'public', 'mockData.json')

if (!fs.existsSync(mockDataPath)) {
  console.error('❌ mockData.json not found at:', mockDataPath)
  process.exit(1)
}

console.log('\n📄 Found mockData.json')
console.log('📊 Size:', (fs.statSync(mockDataPath).size / 1024).toFixed(2), 'KB')

console.log('\n⏳ Uploading to Cloudinary...')

cloudinary.uploader.upload(mockDataPath, {
  public_id: 'hawk-taekwondo/data/mockData.json',
  resource_type: 'raw',
  overwrite: true
})
  .then(result => {
    console.log('\n✅ Upload successful!')
    console.log('🔗 URL:', result.secure_url)
    console.log('📦 Public ID:', result.public_id)
    console.log('📊 Size:', (result.bytes / 1024).toFixed(2), 'KB')
    console.log('\n' + '='.repeat(60))
    console.log('🎉 READY FOR DEPLOYMENT')
    console.log('=' .repeat(60))
    console.log('\nNext steps:')
    console.log('1. Push code to GitHub')
    console.log('2. Deploy to Render')
    console.log('3. Add environment variables in Render Dashboard')
    console.log('4. Your data will persist across restarts!')
  })
  .catch(error => {
    console.error('\n❌ Upload failed:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Check your Cloudinary credentials')
    console.error('2. Verify your account is active')
    console.error('3. Check your internet connection')
    process.exit(1)
  })
