// Cloudinary Configuration
// Production-ready setup for Render deployment

import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dem7arres',
  api_key: process.env.CLOUDINARY_API_KEY || '267337995938546',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'h5bR0Eh5ejZ8MvqCtoND_01hw',
  secure: true
})

// Verify configuration
const isConfigured = () => {
  const config = cloudinary.config()
  return !!(config.cloud_name && config.api_key && config.api_secret)
}

if (isConfigured()) {
  console.log('✅ Cloudinary configured successfully')
  console.log(`📦 Cloud Name: ${cloudinary.config().cloud_name}`)
} else {
  console.error('❌ Cloudinary configuration missing!')
}

export default cloudinary
export { isConfigured }
