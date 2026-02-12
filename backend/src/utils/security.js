// Security Utilities
// Critical security functions for input sanitization and validation

import xss from 'xss'
import Joi from 'joi'

// XSS Sanitization
export function sanitizeInput(input) {
  if (typeof input === 'string') {
    return xss(input)
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }
  return input
}

// File validation schema
export const fileValidationSchema = Joi.object({
  name: Joi.string().required(),
  size: Joi.number().max(50 * 1024 * 1024).required(), // 50MB limit
  mimetype: Joi.string().required(),
  md5: Joi.string().optional()
})

// Allowed file types
export const ALLOWED_FILE_TYPES = {
  images: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ],
  videos: [
    'video/mp4',
    'video/webm',
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
    'video/x-matroska' // .mkv
  ]
}

// Validate file type
export function validateFileType(file) {
  const allowedTypes = [...ALLOWED_FILE_TYPES.images, ...ALLOWED_FILE_TYPES.videos]
  
  if (!allowedTypes.includes(file.mimetype)) {
    return {
      isValid: false,
      error: `File type not allowed: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`
    }
  }
  
  return { isValid: true }
}

// Validate file size
export function validateFileSize(file) {
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: 50MB`
    }
  }
  return { isValid: true }
}

// Comprehensive file validation
export function validateFileUpload(file) {
  // Validate file object exists
  if (!file) {
    return { isValid: false, error: 'No file provided' }
  }

  // Validate required fields
  const { error: validationError } = fileValidationSchema.validate({
    name: file.name,
    size: file.size,
    mimetype: file.mimetype
  })
  
  if (validationError) {
    return { isValid: false, error: validationError.message }
  }

  // Validate file type
  const typeValidation = validateFileType(file)
  if (!typeValidation.isValid) {
    return typeValidation
  }

  // Validate file size
  const sizeValidation = validateFileSize(file)
  if (!sizeValidation.isValid) {
    return sizeValidation
  }

  return { isValid: true }
}