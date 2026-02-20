import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

export default function Toast({ toasts, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-[200] pointer-events-none flex flex-col gap-3 max-w-sm">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              duration: 0.3 
            }}
            className="pointer-events-auto w-full"
          >
            <div className={`
              relative w-full p-4 sm:p-6 rounded-2xl shadow-2xl backdrop-blur-xl border-2
              ${toast.type === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : toast.type === 'info'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
              }
            `}>
              {/* Background blur effect */}
              <div className="absolute inset-0 bg-black/70 rounded-2xl -z-10"></div>
              
              {/* Content */}
              <div className="relative z-10 flex items-start gap-3 sm:gap-4">
                {/* Icon */}
                <div className={`
                  flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                  ${toast.type === 'success' 
                    ? 'bg-green-500/20' 
                    : toast.type === 'info'
                    ? 'bg-blue-500/20'
                    : 'bg-red-500/20'
                  }
                `}>
                  {toast.type === 'success' ? (
                    <CheckCircle size={20} className="text-green-400 sm:w-6 sm:h-6" />
                  ) : toast.type === 'info' ? (
                    <Info size={20} className="text-blue-400 sm:w-6 sm:h-6" />
                  ) : (
                    <AlertCircle size={20} className="text-red-400 sm:w-6 sm:h-6" />
                  )}
                </div>
                
                {/* Message */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-base sm:text-lg mb-1 ${
                    toast.type === 'success' 
                      ? 'text-green-300' 
                      : toast.type === 'info'
                      ? 'text-blue-300'
                      : 'text-red-300'
                  }`}>
                    {toast.type === 'success' ? 'Success!' : toast.type === 'info' ? 'Info' : 'Error!'}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed break-words ${
                    toast.type === 'success' 
                      ? 'text-green-200' 
                      : toast.type === 'info'
                      ? 'text-blue-200'
                      : 'text-red-200'
                  }`}>
                    {toast.text}
                  </p>
                </div>
                
                {/* Close button */}
                <button
                  onClick={() => onClose && onClose(toast.id)}
                  className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
                    toast.type === 'success' 
                      ? 'hover:bg-green-500/20 text-green-400' 
                      : toast.type === 'info'
                      ? 'hover:bg-blue-500/20 text-blue-400'
                      : 'hover:bg-red-500/20 text-red-400'
                  }`}
                  aria-label="Close notification"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Progress bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-1 rounded-b-2xl ${
                  toast.type === 'success' 
                    ? 'bg-green-400' 
                    : toast.type === 'info'
                    ? 'bg-blue-400'
                    : 'bg-red-400'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}