// API Constants
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

export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  MAX_FILE_SIZE: 200 * 1024 * 1024, // 200MB
}