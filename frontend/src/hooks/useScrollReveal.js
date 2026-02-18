import { useEffect, useRef } from 'react'

/**
 * Hook for scroll-triggered reveal animations
 * Elements fade in smoothly as they enter viewport
 */
export function useScrollReveal(options = {}) {
  const elementRef = useRef(null)
  
  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    
    const {
      threshold = 0.1,
      rootMargin = '0px 0px -50px 0px',
      triggerOnce = true
    } = options
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            if (triggerOnce) {
              observer.unobserve(entry.target)
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove('revealed')
          }
        })
      },
      { threshold, rootMargin }
    )
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin, options.triggerOnce])
  
  return elementRef
}

export default useScrollReveal
