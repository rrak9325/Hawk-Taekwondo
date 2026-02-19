import { useState, useEffect } from 'react'

export function useImagePreloader(imageUrls = []) {
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [failedImages, setFailedImages] = useState(new Set())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!imageUrls.length) return

    setIsLoading(true)
    const promises = imageUrls.map(url => {
      return new Promise((resolve) => {
        const img = new Image()
        
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, url]))
          resolve({ url, success: true })
        }
        
        img.onerror = () => {
          setFailedImages(prev => new Set([...prev, url]))
          resolve({ url, success: false })
        }
        
        img.src = url
      })
    })

    Promise.all(promises).then(() => {
      setIsLoading(false)
    })
  }, [imageUrls])

  return {
    loadedImages,
    failedImages,
    isLoading,
    isImageLoaded: (url) => loadedImages.has(url),
    isImageFailed: (url) => failedImages.has(url)
  }
}

export function useImageWithFallback(src, fallbackSrc = null) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!src) return

    setCurrentSrc(src)
    setIsLoaded(false)
    setHasError(false)

    const img = new Image()
    
    img.onload = () => {
      setIsLoaded(true)
      setHasError(false)
    }
    
    img.onerror = () => {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc)
      } else {
        setHasError(true)
      }
    }
    
    img.src = src
  }, [src, fallbackSrc, currentSrc])

  return {
    src: currentSrc,
    isLoaded,
    hasError
  }
}