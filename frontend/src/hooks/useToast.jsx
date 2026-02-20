import { createContext, useContext, useState, useCallback } from 'react'

/**
 * TOAST NOTIFICATION SYSTEM
 * 
 * Context-based toast notification management.
 * Provides a simple API to show success, error, info, and warning messages.
 * 
 * Usage:
 * const { addToast } = useToast()
 * 
 * addToast('success', 'Changes saved successfully!')
 * addToast('error', 'Failed to save changes', 7000)
 */

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  
  const addToast = useCallback((type, message, duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const newToast = {
      id,
      type, // 'success' | 'error' | 'info' | 'warning'
      message,
      duration,
      timestamp: Date.now()
    }
    
    setToasts((prev) => {
      // Limit to 5 toasts max to prevent UI clutter
      const updated = [...prev, newToast]
      return updated.slice(-5)
    })
    
    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }, [])
  
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])
  
  const value = {
    toasts,
    addToast,
    removeToast
  }
  
  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  
  return context
}

export default useToast
