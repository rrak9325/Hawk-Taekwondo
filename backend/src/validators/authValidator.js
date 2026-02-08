// Auth Validator
// Validates authentication requests

export function validateLoginRequest(body) {
  const errors = []

  if (!body) {
    errors.push('Request body is required')
    return { isValid: false, errors }
  }

  if (!body.username || typeof body.username !== 'string') {
    errors.push('Username is required and must be a string')
  }

  if (!body.password || typeof body.password !== 'string') {
    errors.push('Password is required and must be a string')
  }

  if (body.username && body.username.length > 100) {
    errors.push('Username too long')
  }

  if (body.password && body.password.length > 200) {
    errors.push('Password too long')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}