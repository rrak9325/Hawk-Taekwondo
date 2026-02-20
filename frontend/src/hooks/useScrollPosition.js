import { useState, useEffect } from 'react'

/**
 * USE SCROLL POSITION HOOK
 * 
 * Tracks the current scroll position with throttling for performance.
 * Returns scroll position and direction for UI elements that need to
 * respond to scrolling (like Back to Top buttons, sticky headers, etc.)
 * 
 * @param {number} throttleMs - Throttle delay in milliseconds (default: 100)
 * @returns {Object} { scrollY, scrollDirection, isScrollingDown }
 * 
 * Usage:
 * const { scrollY, isScrollingDown } = useScrollPosition()
 * 
 * if (scrollY > 300) {
 *   // Show back to top button
 * }
 */
export function useScrollPosition(throttleMs = 100) {
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState('up')
  const [lastScrollY, setLastScrollY] = useState(0)
  
  useEffect(() => {
    let timeoutId = null
    let lastKnownScrollY = window.scrollY
    
    const handleScroll = () => {
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      // Throttle the scroll event
      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY
        
        // Determine scroll direction
        if (currentScrollY > lastKnownScrollY) {
          setScrollDirection('down')
        } else if (currentScrollY < lastKnownScrollY) {
          setScrollDirection('up')
        }
        
        // Update state
        setScrollY(currentScrollY)
        setLastScrollY(lastKnownScrollY)
        lastKnownScrollY = currentScrollY
      }, throttleMs)
    }
    
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Set initial scroll position
    setScrollY(window.scrollY)
    
    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [throttleMs])
  
  return {
    scrollY,
    scrollDirection,
    isScrollingDown: scrollDirection === 'down',
    lastScrollY
  }
}

export default useScrollPosition
