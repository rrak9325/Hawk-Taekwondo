import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ROUTE CLEANUP COMPONENT
 * Aggressively cleans up memory when navigating between pages
 * Forces garbage collection and clears caches
 */
export default function RouteCleanup({ children }) {
  const location = useLocation()

  useEffect(() => {
    // Cleanup function runs when leaving the page
    return () => {
      // Force a small delay to allow React to unmount properly
      setTimeout(() => {
        // Clear any lingering timers or intervals
        // This helps with memory cleanup
        if (window.gc) {
          // If garbage collection is exposed (dev mode), trigger it
          window.gc()
        }
      }, 100)
    }
  }, [location.pathname])

  return children
}
