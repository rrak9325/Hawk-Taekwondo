import { useState } from 'react'

export default function SimpleImage({ src, alt, className = '', ...props }) {
  const [status, setStatus] = useState('loading')
  const [loadTime, setLoadTime] = useState(null)
  const startTime = Date.now()

  if (!src || src.trim() === '') {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} {...props}>
        <span className="text-gray-500 text-sm">No image URL</span>
      </div>
    )
  }

  const handleLoad = () => {
    const time = Date.now() - startTime
    setLoadTime(time)
    setStatus('loaded')
    console.log(`Image loaded in ${time}ms:`, src)
  }

  const handleError = (e) => {
    setStatus('error')
    console.error('Image failed to load:', src, e)
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className="w-full h-full object-cover"
        {...props}
      />
      
      {/* Debug overlay - remove in production */}
      {import.meta.env.DEV && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {status === 'loading' && '⏳ Loading...'}
          {status === 'loaded' && `✅ ${loadTime}ms`}
          {status === 'error' && '❌ Failed'}
        </div>
      )}
    </div>
  )
}