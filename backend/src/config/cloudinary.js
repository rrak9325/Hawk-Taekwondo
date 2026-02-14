// Cloudinary Configuration
// Production-ready setup for Render deployment

import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with credentials from environment variables
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })
}

// Verify configuration
const isConfigured = () => {
  configureCloudinary()
  const config = cloudinary.config()
  return !!(config.cloud_name && config.api_key && config.api_secret)
}

// Only log after a short delay to ensure .env is loaded
setTimeout(() => {
  configureCloudinary()
  if (!isConfigured()) {
    console.error('Cloudinary configuration missing - check environment variables')
  }
}, 100)

export default cloudinary
export { isConfigured }
