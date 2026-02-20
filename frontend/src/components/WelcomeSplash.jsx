import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { shouldUseInfiniteLoops, isLowEndDevice } from '../utils/devicePerformance.js'

export default function WelcomeSplash() {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = sessionStorage.getItem('hasVisitedHTTC')
    
    if (hasVisited) {
      setIsVisible(false)
      return
    }

    // Progress bar animation (faster)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5 // Faster progress (100 / 20 steps = 5% per 100ms)
      })
    }, 100)

    // Hide splash after 2 seconds (reduced from 4)
    const timer = setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem('hasVisitedHTTC', 'true')
    }, isLowEndDevice ? 1500 : 2000)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [])

  // Low-end device: minimal splash
  if (isLowEndDevice) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
          >
            <div className="text-center px-6">
              <img
                src="https://res.cloudinary.com/dem7arres/image/upload/v1771347376/eagle-modified_n3g8to.png"
                alt="Hawk Taekwondo Logo"
                className="w-32 h-32 mx-auto mb-6 object-contain drop-shadow-2xl"
              />
              <h1 className="text-4xl font-black text-gray-900 mb-3">
                Welcome to <span className="text-red-600">HTTC</span>
              </h1>
              <p className="text-lg text-gray-600">Hawk Taekwondo Training Centre</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // High-end device: modern white experience
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        >
          {/* Modern White Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-red-50"></div>
          
          {/* Animated Gradient Overlay */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1), transparent 70%)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 4,
              ease: 'easeInOut'
            }}
          />

          {/* Floating Particles */}
          {shouldUseInfiniteLoops() && (
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-red-300/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </div>
          )}

          {/* Glassmorphism Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative z-10 text-center px-8 py-12 max-w-2xl backdrop-blur-xl bg-white/60 rounded-3xl border border-gray-200/50 shadow-2xl"
          >
            {/* Logo with Modern Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                duration: 1
              }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 blur-3xl opacity-30"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  style={{
                    background: 'radial-gradient(circle, rgba(220, 38, 38, 0.4), transparent)'
                  }}
                />
                
                <img
                  src="https://res.cloudinary.com/dem7arres/image/upload/v1771347376/eagle-modified_n3g8to.png"
                  alt="Hawk Taekwondo Logo"
                  className="relative w-40 h-40 object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Text - All fade in together */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
                Welcome to <span className="text-red-600">HTTC</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 font-semibold">
                Hawk Taekwondo Training Centre
              </p>
              
              <p className="text-base md:text-lg text-gray-500 italic">
                A Korean martial arts club for Taekwondo Lovers
              </p>
            </motion.div>

            {/* Modern Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-10"
            >
              <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
                {/* Glow on progress bar */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-400 to-red-500 rounded-full blur-sm opacity-50"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-3 font-medium">
                Loading experience... {Math.round(progress)}%
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
