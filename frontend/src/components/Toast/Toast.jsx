import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

/**
 * TOAST NOTIFICATION COMPONENT
 * 
 * Individual toast notification with auto-dismiss and manual close.
 * Supports 4 types: success, error, info, warning
 * 
 * Features:
 * - Auto-dismiss timer
 * - Manual close button
 * - Slide in/out animations
 * - Accessible (ARIA labels, keyboard support)
 * - Type-specific colors and icons
 */

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    iconColor: 'text-white'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-600',
    textColor: 'text-white',
    iconColor: 'text-white'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    iconColor: 'text-white'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500',
    textColor: 'text-black',
    iconColor: 'text-black'
  }
}

export default function Toast({ id, type, message, duration, onClose }) {
  const [isExiting, setIsExiting] = useState(false)
  const config = toastConfig[type] || toastConfig.info
  const Icon = config.icon
  
  useEffect(() => {
    // Auto-dismiss timer
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration])
  
  const handleClose = () => {
    setIsExiting(true)
    // Wait for exit animation to complete
    setTimeout(() => {
      onClose(id)
    }, 300)
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClose()
    }
  }
  
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        ${config.bgColor} ${config.textColor}
        rounded-lg shadow-lg
        p-4 pr-12
        flex items-start gap-3
        relative
        w-full max-w-sm
        ${isExiting ? 'toast-exit' : 'toast-enter'}
      `}
    >
      {/* Icon */}
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      
      {/* Message */}
      <p className="flex-1 text-sm font-medium leading-relaxed">
        {message}
      </p>
      
      {/* Close Button */}
      <button
        onClick={handleClose}
        onKeyDown={handleKeyDown}
        aria-label="Close notification"
        className={`
          absolute top-3 right-3
          ${config.textColor}
          hover:opacity-75
          transition-opacity
          focus:outline-none focus:ring-2 focus:ring-white/50 rounded
          p-1
        `}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
