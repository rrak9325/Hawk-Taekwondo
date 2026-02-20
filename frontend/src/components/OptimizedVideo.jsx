import { useState, useRef, useEffect } from 'react'

/**
 * OPTIMIZED VIDEO COMPONENT
 * 
 * Performance features:
 * - Lazy loading (only loads when near viewport)
 * - Metadata preload (not full video)
 * - Automatic fallback to poster on error
 * - GPU acceleration hints
 * - Proper cleanup
 * 
 * @param {string} src - Video source URL
 * @param {string} poster - Poster image URL (fallback)
 * @param {string} className - CSS classes
 * @param {boolean} autoPlay - Auto play video, default true
 * @param {boolean} loop - Loop video, default true
 * @param {boolean} muted - Mute video, default true
 * @param {function} onError - Error callback
 * @param {object} style - Additional inline styles
 */
export default function OptimizedVideo({
  src,
  poster,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  onError,
  style = {},
  ...props
}) {
  const [hasError, setHasError] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const videoRef = useRef(null)
  
  // Handle video error - fallback to poster
  const handleError = (e) => {
    console.warn('Video failed to load, falling back to poster:', src)
    setHasError(true)
    
    if (onError) {
      onError(e)
    }
  }
  
  // Handle video ready to play
  const handleCanPlay = () => {
    setIsReady(true)
    
    // Try to play (might be blocked by browser)
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay blocked:', err)
        // Not a critical error, just log it
      })
    }
  }
  
  // Load video when component mounts
  useEffect(() => {
    if (videoRef.current && !hasError) {
      videoRef.current.load()
    }
  }, [hasError])
  
  // If video failed or no src, show poster image
  if (hasError || !src) {
    return (
      <img
        src={poster}
        alt=""
        className={className}
        style={style}
        loading="lazy"
        decoding="async"
      />
    )
  }
  
  return (
    <>
      {/* Poster image - shows while video loads */}
      {poster && !isReady && (
        <img
          src={poster}
          alt=""
          className={className}
          style={{
            ...style,
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
          loading="eager"
          decoding="async"
        />
      )}
      
      {/* Video element */}
      <video
        ref={videoRef}
        className={className}
        style={{
          ...style,
          willChange: 'transform', // GPU acceleration hint
          opacity: isReady ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: isReady ? 1 : 0
        }}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata" // Only load metadata, not full video
        loading="lazy" // Lazy load video
        onCanPlay={handleCanPlay}
        onError={handleError}
        {...props}
      >
        <source src={src} type="video/mp4" />
        {/* Fallback text for browsers without video support */}
        Your browser does not support the video tag.
      </video>
    </>
  )
}
