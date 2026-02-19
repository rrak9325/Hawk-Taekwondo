// Image URL resolver to handle different image sources
const API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || 'https://hawktaekwondo.com') 
  : 'http://localhost:3000' // Your backend port

export const resolveImageUrl = (url) => {
  if (!url || url.trim() === '') return ''
  
  // If it's already a full URL (Cloudinary, etc.), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // If it's a local path, prepend the backend URL
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`
    return `${API_BASE_URL}${cleanPath}`
  }
  
  // For any other relative path
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`
  }
  
  return url
}

// Enhanced image component that resolves URLs
export const ResolvedImage = ({ src, alt, className = '', onLoad, onError, ...props }) => {
  const resolvedSrc = resolveImageUrl(src)
  
  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onLoad={onLoad}
      onError={(e) => {
        console.warn('Image failed to load:', resolvedSrc)
        if (onError) onError(e)
      }}
      {...props}
    />
  )
}