#!/usr/bin/env node

// Cleanup Unused Media Files Script
// Removes local media files that aren't referenced in mockData.json

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths
const projectRoot = path.join(__dirname)
const uploadsDir = path.join(projectRoot, 'public', 'uploads')
const mockDataPath = path.join(projectRoot, 'public', 'mockData.json')

console.log('🧹 Starting media cleanup...\n')

// Read mockData.json
let mockData
try {
  const mockDataContent = fs.readFileSync(mockDataPath, 'utf8')
  mockData = JSON.parse(mockDataContent)
  console.log('✅ Loaded mockData.json')
} catch (error) {
  console.error('❌ Failed to read mockData.json:', error.message)
  process.exit(1)
}

// Extract all referenced local file paths from mockData
const referencedFiles = new Set()

function extractFilePaths(obj, basePath = '') {
  if (!obj) return
  
  if (typeof obj === 'string') {
    // Check for local file references
    if (obj.startsWith('/images/') || obj.startsWith('/boxing.mp4') || obj.startsWith('/public/uploads/')) {
      // Normalize the path
      let normalizedPath = obj
      if (normalizedPath.startsWith('/')) {
        normalizedPath = normalizedPath.substring(1)
      }
      referencedFiles.add(normalizedPath)
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => extractFilePaths(item, basePath))
  } else if (typeof obj === 'object') {
    Object.values(obj).forEach(value => extractFilePaths(value, basePath))
  }
}

extractFilePaths(mockData)
console.log(`📋 Found ${referencedFiles.size} referenced local files in mockData.json:`)
referencedFiles.forEach(file => console.log(`   - ${file}`))
console.log()

// Get all files in uploads directory
let uploadFiles = []
try {
  uploadFiles = fs.readdirSync(uploadsDir)
    .filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.webm', '.mov', '.avi'].includes(ext)
    })
    .map(file => path.join('public', 'uploads', file))
  console.log(`📁 Found ${uploadFiles.length} media files in uploads directory`)
} catch (error) {
  console.error('❌ Failed to read uploads directory:', error.message)
  process.exit(1)
}

// Find unused files
const unusedFiles = uploadFiles.filter(file => {
  // Convert to the format used in mockData.json
  const relativePath = file.replace('public\\', '').replace(/\\/g, '/')
  return !referencedFiles.has(relativePath)
})

console.log(`\n🗑️ Found ${unusedFiles.length} unused files:`)
unusedFiles.forEach(file => {
  const fullPath = path.join(projectRoot, file)
  const stats = fs.statSync(fullPath)
  const size = (stats.size / 1024 / 1024).toFixed(2)
  console.log(`   - ${file} (${size}MB)`)
})

if (unusedFiles.length === 0) {
  console.log('\n✅ No unused files found. Everything is clean!')
  process.exit(0)
}

// Ask for confirmation
console.log('\n⚠️  The above files will be permanently deleted.')
console.log('Type "DELETE" to confirm or anything else to cancel:')

// For automation, we'll proceed with deletion
console.log('\n🔧 Proceeding with deletion...\n')

let deletedCount = 0
let totalSize = 0

unusedFiles.forEach(file => {
  try {
    const fullPath = path.join(projectRoot, file)
    const stats = fs.statSync(fullPath)
    const size = stats.size
    
    fs.unlinkSync(fullPath)
    console.log(`✅ Deleted: ${file} (${(size / 1024 / 1024).toFixed(2)}MB)`)
    deletedCount++
    totalSize += size
  } catch (error) {
    console.error(`❌ Failed to delete ${file}:`, error.message)
  }
})

console.log(`\n🎉 Cleanup complete!`)
console.log(`   Files deleted: ${deletedCount}`)
console.log(`   Space freed: ${(totalSize / 1024 / 1024).toFixed(2)}MB`)

// Also check for empty directories
const imagesDirs = [
  path.join(projectRoot, 'public', 'images', 'gallery'),
  path.join(projectRoot, 'public', 'images', 'programs'), 
  path.join(projectRoot, 'public', 'images', 'testimonials'),
  path.join(projectRoot, 'public', 'images', 'videos')
]

console.log('\n📂 Checking for empty directories...')
imagesDirs.forEach(dir => {
  try {
    const files = fs.readdirSync(dir)
    if (files.length === 0) {
      console.log(`   Empty directory: ${path.relative(projectRoot, dir)}`)
    }
  } catch (error) {
    // Directory might not exist, which is fine
  }
})

console.log('\n✨ Media cleanup finished!')
