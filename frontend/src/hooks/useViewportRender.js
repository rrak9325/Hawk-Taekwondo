import { useState, useEffect, useRef } from 'react'

/**
 * VIEWPORT RENDER HOOK
 * Only renders component when in viewport - completely unmounts when not visible
 * Reduces lag by not rendering off-screen components
 * 
 * @param {Object} options
 * @param {number} options.rootMargin - Margin around viewport (default: '200px')
 * @param {number} options.threshold - Visibility threshold (default: 0)
 * @returns {[ref, isVisible]} - Ref to attach to wrapper, visibility state
 */
export function useViewportRender(options = {}) {
  const { rootMargin = '200px', threshold = 0 } = options
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setIsVisible(visible)
        
        // Track if it's been visible at least once
        if (visible && !hasBeenVisible) {
          setHasBeenVisible(true)
        }
      },
      {
        rootMargin,
        threshold
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [rootMargin, threshold, hasBeenVisible])

  return [elementRef, isVisible, hasBeenVisible]
}

export default useViewportRender
