import { useState, useEffect, useRef } from 'react'

// Optimize Cloudinary URLs for better performance
const optimizeCloudinaryUrl = (url, width = 800, height = 600) => {
  if (!url || !url.includes('cloudinary')) return url
  
  // Add Cloudinary transformations for optimization
  return url.replace(
    '/upload/', 
    `/upload/w_${width},h_${height},c_fill,f_auto,q_auto,dpr_auto/`
  )
}

export default function RobustImage({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = null,
  onLoad,
  onError,
  retryCount = 2,
  width = 800,
  height = 600,
  optimize = true,
  ...props 
}) {
  // Optimize the source URL if it's from Cloudinary
  const optimizedSrc = optimize ? optimizeCloudinaryUrl(src, width, height) : src
  
  const [currentSrc, setCurrentSrc] = useState(optimizedSrc)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const imgRef = useRef(null)

  // Reset state when src changes
  useEffect(() => {
    const newOptimizedSrc = optimize ? optimizeCloudinaryUrl(src, width, height) : src
    setCurrentSrc(newOptimizedSrc)
    setIsLoaded(false)
    setIsError(false)
    setAttempts(0)
  }, [src, width, height, optimize])

  const handleLoad = () => {
    setIsLoaded(true)
    setIsError(false)
    if (onLoad) onLoad()
  }

  const handleError = () => {
    if (attempts < retryCount) {
      // First retry with original URL (no optimization)
      if (attempts === 0 && optimize && currentSrc !== src) {
        setCurrentSrc(src)
        setAttempts(prev => prev + 1)
        return
      }
      
      // Retry with cache busting
      const cacheBuster = `?retry=${attempts + 1}&t=${Date.now()}`
      setCurrentSrc(src + cacheBuster)
      setAttempts(prev => prev + 1)
      return
    }

    // Try fallback if available
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setAttempts(0)
      return
    }

    // Final error state
    setIsError(true)
    if (onError) onError()
  }

  if (isError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} {...props}>
        <div className="text-gray-400 text-center p-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <p className="text-xs">Image unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} {...props}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  )
}