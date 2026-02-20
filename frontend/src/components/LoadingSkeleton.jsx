import useReducedMotion from '../hooks/useReducedMotion'

/**
 * LOADING SKELETON COMPONENTS
 * 
 * Placeholder UI components that match actual content layout
 * while data is loading. Provides better perceived performance
 * than spinners.
 * 
 * Features:
 * - Shimmer animation effect
 * - Matches actual content dimensions
 * - Respects reduced motion preferences
 * - Prevents layout shift
 */

/**
 * Base Skeleton Card
 * Generic card skeleton for custom layouts
 */
export function SkeletonCard({ className = '', animate = true }) {
  const prefersReducedMotion = useReducedMotion()
  const shouldAnimate = animate && !prefersReducedMotion
  
  return (
    <div 
      className={`${shouldAnimate ? 'skeleton-shimmer' : 'skeleton'} ${className}`}
      aria-label="Loading..."
      role="status"
    />
  )
}

/**
 * Skeleton Text Lines
 * For text content placeholders
 */
export function SkeletonText({ lines = 1, className = '' }) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton-text ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`}
          style={{ width: i === lines - 1 ? '80%' : '100%' }}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton Program Card
 * Matches the layout of program cards
 */
export function SkeletonProgramCard({ count = 3 }) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
          {/* Image placeholder */}
          <div className={`aspect-video bg-gray-200 ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
          
          {/* Content placeholder */}
          <div className="p-6">
            {/* Title */}
            <div className={`h-6 bg-gray-200 rounded mb-3 ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
            
            {/* Description */}
            <div className={`h-4 bg-gray-200 rounded mb-2 ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
            <div className={`h-4 bg-gray-200 rounded mb-4 w-4/5 ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
            
            {/* Benefits */}
            <div className="space-y-2 mb-6">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex gap-2">
                  <div className={`w-4 h-4 bg-gray-200 rounded-full mt-0.5 flex-shrink-0 ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
                  <div className={`h-4 bg-gray-200 rounded flex-1 ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
                </div>
              ))}
            </div>
            
            {/* Button */}
            <div className={`h-12 bg-gray-200 rounded-xl ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
          </div>
        </div>
      ))}
    </>
  )
}

/**
 * Skeleton Instructor Card
 * Matches the layout of instructor cards
 */
export function SkeletonInstructorCard({ count = 4 }) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg border-t-4 border-red-600">
          {/* Image placeholder */}
          <div className={`aspect-square bg-gray-200 ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
          
          {/* Content placeholder */}
          <div className="p-6 text-center">
            {/* Name */}
            <div className={`h-6 bg-gray-200 rounded mb-2 mx-auto w-3/4 ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
            
            {/* Rank */}
            <div className={`h-4 bg-gray-200 rounded mb-3 mx-auto w-1/2 ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
            
            {/* Bio */}
            <div className={`h-3 bg-gray-200 rounded mb-2 ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
            <div className={`h-3 bg-gray-200 rounded w-4/5 mx-auto ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
          </div>
        </div>
      ))}
    </>
  )
}

/**
 * Skeleton Feature Card
 * Matches the layout of feature cards on home page
 */
export function SkeletonFeatureCard({ count = 4 }) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-md">
          {/* Icon placeholder */}
          <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gray-200 rounded-2xl mx-auto mb-4 lg:mb-6 ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
          
          {/* Title */}
          <div className={`h-6 bg-gray-200 rounded mb-2 mx-auto w-3/4 ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
          
          {/* Description */}
          <div className={`h-4 bg-gray-200 rounded mb-1 ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
          <div className={`h-4 bg-gray-200 rounded w-4/5 mx-auto ${!prefersReducedMotion ? 'skeleton-shimmer' : ''}`} />
        </div>
      ))}
    </>
  )
}

// Export all skeleton components
export default {
  Card: SkeletonCard,
  Text: SkeletonText,
  ProgramCard: SkeletonProgramCard,
  InstructorCard: SkeletonInstructorCard,
  FeatureCard: SkeletonFeatureCard
}
