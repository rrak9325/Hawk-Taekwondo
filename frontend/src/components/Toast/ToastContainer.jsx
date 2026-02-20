import { useToast } from '../../hooks/useToast'
import Toast from './Toast'

/**
 * TOAST CONTAINER
 * 
 * Manages the positioning and stacking of toast notifications.
 * Renders all active toasts in the top-right corner.
 * 
 * Features:
 * - Fixed position top-right
 * - Vertical stacking with spacing
 * - Responsive (full-width on mobile)
 * - Accessible (aria-live region)
 */
export default function ToastContainer() {
  const { toasts, removeToast } = useToast()
  
  if (toasts.length === 0) {
    return null
  }
  
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="
        fixed top-4 right-4 z-50
        flex flex-col gap-2
        max-w-sm w-full
        pointer-events-none
      "
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  )
}
