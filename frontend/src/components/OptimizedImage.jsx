import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  priority = false,
  placeholder = 'blur',
  onLoad,
  onError,
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState('')
  const imgRef = useRef(null)

  // Generate optimized image sources
  const generateSources = (originalSrc) => {
    if (!originalSrc) return []
    
    // Check if this is already an optimized image (contains dimensions)
    if (originalSrc.includes('-') && /\d+x\d+/.test(originalSrc)) {
      return [{
        srcSet: originalSrc,
        type: originalSrc.endsWith('.webp') ? 'image/webp' : 'image/jpeg'
      }]
    }
    
    // For non-optimized images, try to generate optimized paths
    const basePath = originalSrc.replace(/\.[^/.]+$/, '')
    const sources = []
    
    // Try WebP first (best compression) - but fallback gracefully
    sources.push({
      srcSet: `${basePath}-800x600.webp`,
      type: 'image/webp'
    })
    
    // Fallback to JPEG
    sources.push({
      srcSet: `${basePath}-800x600.jpg`,
      type: 'image/jpeg'
    })
    
    // Original as final fallback
    sources.push({
      srcSet: originalSrc,
      type: 'image/jpeg'
    })
    
    return sources
  }

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!src || priority) {
      setCurrentSrc(src)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSrc(src)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '50px' // Start loading 50px before image comes into view
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [src, priority])

  const handleLoad = () => {
    setIsLoaded(true)
    setIsError(false)
    if (onLoad) onLoad()
  }

  const handleError = () => {
    setIsError(true)
    if (onError) onError()
    
    // If optimized image fails, try loading the original
    if (currentSrc !== src && src) {
      console.log('Optimized image failed, falling back to original:', src)
      setCurrentSrc(src)
      setIsError(false) // Reset error state for fallback attempt
    }
  }

  const sources = generateSources(currentSrc)

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder/Loading state */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-xs">Failed to load</p>
          </div>
        </div>
      )}

      {/* Optimized image with multiple sources */}
      {currentSrc && (
        <picture>
          {sources.map((source, index) => (
            <source
              key={index}
              srcSet={source.srcSet}
              type={source.type}
            />
          ))}
          <motion.img
            src={currentSrc}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            {...props}
          />
        </picture>
      )}

      {/* Loading animation overlay */}
      {!isLoaded && !isError && currentSrc && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gray-100 flex items-center justify-center"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      )}
    </div>
  )
}

// Shimmer animation CSS (add to your CSS file)
const shimmerCSS = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`

// Export CSS for injection
export { shimmerCSS }