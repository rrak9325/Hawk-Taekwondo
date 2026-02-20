import { ChevronUp } from 'lucide-react'
import useScrollPosition from '../hooks/useScrollPosition'
import useReducedMotion from '../hooks/useReducedMotion'

/**
 * BACK TO TOP BUTTON
 * 
 * A fixed-position button that appears after scrolling down 300px
 * and smoothly scrolls the page back to the top when clicked.
 * 
 * Features:
 * - Appears/disappears based on scroll position
 * - Smooth scroll animation
 * - Respects reduced motion preferences
 * - Fully accessible (keyboard + screen reader)
 * - Martial arts themed styling
 */
export default function BackToTopButton() {
  const { scrollY } = useScrollPosition(100)
  const prefersReducedMotion = useReducedMotion()
  
  // Show button when scrolled down more than 300px
  const isVisible = scrollY > 300
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    })
  }
  
  const handleKeyDown = (e) => {
    // Activate on Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      scrollToTop()
    }
  }
  
  return (
    <button
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      aria-label="Scroll to top"
      className={`
        fixed bottom-6 right-6 z-40
        w-12 h-12 md:w-14 md:h-14
        bg-red-600 hover:bg-red-700
        text-white
        rounded-full
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300
        focus:outline-none focus:ring-4 focus:ring-red-600/50
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(1rem)'
      }}
    >
      <ChevronUp className="w-6 h-6 md:w-7 md:h-7" />
    </button>
  )
}
