import { useEffect, useRef, useState } from 'react'

/**
 * OPTIMIZED SCROLL REVEAL HOOK
 * 
 * Uses a SINGLE shared IntersectionObserver for all elements on the page.
 * This is way more efficient than creating one observer per component.
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold (0-1), default 0.1
 * @param {boolean} options.triggerOnce - Only trigger once, default true
 * @param {string} options.rootMargin - Root margin for early/late triggers, default '0px'
 * @returns {Object} { ref, isVisible } - Ref to attach to element and visibility state
 */

// Singleton observer instance - shared across ALL components
let observer = null

// WeakMap to store callbacks - prevents memory leaks
const callbacks = new WeakMap()

// Observer configuration
let observerConfig = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
}

/**
 * Get or create the singleton observer
 */
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const callback = callbacks.get(entry.target)
        if (callback) {
          callback(entry.isIntersecting)
        }
      })
    }, observerConfig)
  }
  return observer
}

/**
 * useScrollReveal Hook
 */
export function useScrollReveal(options = {}) {
  const elementRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  
  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = '0px 0px -50px 0px'
  } = options
  
  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    
    // Update observer config if needed
    observerConfig = { threshold, rootMargin }
    
    // Get the singleton observer
    const obs = getObserver()
    
    // Register callback for this element
    callbacks.set(element, (visible) => {
      if (visible) {
        setIsVisible(true)
        
        // If triggerOnce, unobserve after first trigger
        if (triggerOnce) {
          obs.unobserve(element)
          callbacks.delete(element)
        }
      } else if (!triggerOnce) {
        // Allow re-triggering if triggerOnce is false
        setIsVisible(false)
      }
    })
    
    // Start observing
    obs.observe(element)
    
    // Cleanup on unmount
    return () => {
      if (element) {
        obs.unobserve(element)
        callbacks.delete(element)
      }
    }
  }, [threshold, triggerOnce, rootMargin])
  
  return { ref: elementRef, isVisible }
}

export default useScrollReveal
