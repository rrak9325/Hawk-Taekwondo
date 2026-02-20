import { useState, useEffect } from 'react'

/**
 * USE REDUCED MOTION HOOK
 * 
 * Detects if the user has requested reduced motion in their system preferences.
 * Respects accessibility preferences for users with vestibular disorders or
 * motion sensitivity.
 * 
 * @returns {boolean} - True if user prefers reduced motion
 * 
 * Usage:
 * const prefersReducedMotion = useReducedMotion()
 * 
 * if (!prefersReducedMotion) {
 *   // Apply animations
 * }
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    // Check if matchMedia is supported
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }
    
    // Create media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)
    
    // Listen for changes
    const handler = (event) => {
      setPrefersReducedMotion(event.matches)
    }
    
    // Add listener (use deprecated method for older browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
    } else {
      mediaQuery.addListener(handler)
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler)
      } else {
        mediaQuery.removeListener(handler)
      }
    }
  }, [])
  
  return prefersReducedMotion
}

export default useReducedMotion
