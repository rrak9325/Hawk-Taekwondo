// Shared API Constants
// Used by both frontend and backend

export const API_ENDPOINTS = {
  LOGIN: '/api/login',
  LOGOUT: '/api/logout',
  DATA: '/api/data',
  UPLOAD: '/api/upload',
  DELETE_FILE: '/api/file',
  CLEANUP: '/api/cleanup',
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

export const FILE_LIMITS = {
  MAX_IMAGE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_VIDEO_SIZE: 200 * 1024 * 1024, // 200MB
  SUPPORTED_IMAGE_FORMATS: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'],
  SUPPORTED_VIDEO_FORMATS: ['.mp4', '.webm', '.mov', '.avi'],
}