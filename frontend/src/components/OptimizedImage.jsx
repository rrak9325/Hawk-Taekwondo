import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { resolveImageUrl } from '../utils/imageUrlResolver'

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

  // Don't render anything if src is empty or invalid
  if (!src || src.trim() === '') {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-xs">No image</p>
          </div>
        </div>
      </div>
    )
  }

  // Generate optimized image sources
  const generateSources = (originalSrc) => {
    if (!originalSrc) return []
    
    // Resolve the URL first
    const resolvedSrc = resolveImageUrl(originalSrc)
    
    // Check if this is already an optimized image (contains dimensions)
    if (resolvedSrc.includes('-') && /\d+x\d+/.test(resolvedSrc)) {
      return [{
        srcSet: resolvedSrc,
        type: resolvedSrc.endsWith('.webp') ? 'image/webp' : 'image/jpeg'
      }]
    }
    
    // For Cloudinary images, try to generate optimized paths
    if (resolvedSrc.includes('cloudinary.com')) {
      const sources = []
      
      // Try WebP first (best compression)
      sources.push({
        srcSet: resolvedSrc.replace('/upload/', '/upload/f_webp,q_auto:good,w_800,h_600,c_limit/'),
        type: 'image/webp'
      })
      
      // Fallback to optimized JPEG
      sources.push({
        srcSet: resolvedSrc.replace('/upload/', '/upload/f_auto,q_auto:good,w_800,h_600,c_limit/'),
        type: 'image/jpeg'
      })
      
      // Original as final fallback
      sources.push({
        srcSet: resolvedSrc,
        type: 'image/jpeg'
      })
      
      return sources
    }
    
    // For non-Cloudinary images, just return the resolved URL
    return [{
      srcSet: resolvedSrc,
      type: 'image/jpeg'
    }]
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
      if (import.meta.env.DEV) {
        console.log('Optimized image failed, falling back to original:', src)
      }
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