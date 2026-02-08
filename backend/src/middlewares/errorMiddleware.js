// Error Middleware
// Global error handling

export function errorMiddleware(err, req, res, next) {
  console.error('[ERROR]', err)
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  res.status(500).json({
    error: 'Internal server error',
    ...(isDevelopment && { details: err.message, stack: err.stack })
  })
}

export default errorMiddleware