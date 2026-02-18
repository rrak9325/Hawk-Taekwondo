import { useViewportRender } from '../hooks/useViewportRender'

/**
 * LAZY SECTION WRAPPER
 * Only renders children when in viewport
 * Completely unmounts when not visible to save memory
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render
 * @param {string} props.className - CSS classes
 * @param {number} props.rootMargin - Viewport margin (default: '200px')
 * @param {boolean} props.keepMounted - Keep mounted after first render (default: false)
 */
export default function LazySection({ 
  children, 
  className = '', 
  rootMargin = '200px',
  keepMounted = false,
  ...props 
}) {
  const [ref, isVisible, hasBeenVisible] = useViewportRender({ rootMargin })

  // Render logic:
  // - If keepMounted: render after first visibility
  // - Otherwise: only render when visible
  const shouldRender = keepMounted ? hasBeenVisible : isVisible

  return (
    <div ref={ref} className={className} {...props}>
      {shouldRender ? children : null}
    </div>
  )
}
