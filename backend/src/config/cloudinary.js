// Cloudinary Configuration
// Production-ready setup for Render deployment

import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
  console.error('💡 Make sure backend/.env file exists with:')
  console.error('   CLOUDINARY_CLOUD_NAME=your_cloud_name')
  console.error('   CLOUDINARY_API_KEY=your_api_key')
  console.error('   CLOUDINARY_API_SECRET=your_api_secret')
}

export default cloudinary
export { isConfigured }
