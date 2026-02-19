import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { shouldUseInfiniteLoops, isLowEndDevice } from '../utils/devicePerformance.js'

export default function WelcomeSplash() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = sessionStorage.getItem('hasVisitedHTTC')
    
    if (hasVisited) {
      setIsVisible(false)
      return
    }

    // Hide splash after 2.5 seconds (reduced for low-end devices)
    const timer = setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem('hasVisitedHTTC', 'true')
    }, isLowEndDevice ? 2000 : 3000)

    return () => clearTimeout(timer)
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
                className="w-32 h-32 mx-auto mb-6 object-contain"
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

  // High-end device: full experience
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-red-50/20"></div>
            
            {/* Shimmer Effect - Only on high-end */}
            {shouldUseInfiniteLoops() && (
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)',
                  backgroundSize: '200% 200%'
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
            )}
            
            {/* Corner Frames */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <div className="absolute top-8 left-8 w-24 h-24">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
                <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-gray-300 to-transparent"></div>
              </div>
              <div className="absolute top-8 right-8 w-24 h-24">
                <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-gray-300 to-transparent"></div>
                <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-gray-300 to-transparent"></div>
              </div>
              <div className="absolute bottom-8 left-8 w-24 h-24">
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-0.5 h-full bg-gradient-to-t from-gray-300 to-transparent"></div>
              </div>
              <div className="absolute bottom-8 right-8 w-24 h-24">
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-gray-300 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-0.5 h-full bg-gradient-to-t from-gray-300 to-transparent"></div>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-3xl">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 120, 
                damping: 20,
                duration: 1.2 
              }}
              className="mb-10 flex justify-center"
            >
              <div className="relative">
                {/* Glow Effect - Only on high-end */}
                {shouldUseInfiniteLoops() && (
                  <motion.div
                    className="absolute inset-0 blur-2xl opacity-20"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    style={{
                      background: 'radial-gradient(circle, rgba(220, 38, 38, 0.4), transparent)'
                    }}
                  />
                )}
                
                <img
                  src="https://res.cloudinary.com/dem7arres/image/upload/v1771347376/eagle-modified_n3g8to.png"
                  alt="Hawk Taekwondo Logo"
                  className="w-48 h-48 object-contain drop-shadow-2xl"
                />
                
                {/* Pulsing Rings - Only on high-end */}
                {shouldUseInfiniteLoops() && (
                  <>
                    <motion.div
                      className="absolute inset-0 border border-gray-200 rounded-full"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 border border-red-200 rounded-full"
                      animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0.3, 0, 0.3]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                  </>
                )}
              </div>
            </motion.div>

            {/* Welcome Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
                Welcome to <span className="text-red-600">HTTC</span>
              </h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 1 }}
                className="space-y-3"
              >
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-semibold tracking-wide">
                  Hawk Taekwondo Training Centre
                </p>
                
                <motion.div
                  className="flex items-center justify-center gap-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                >
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300"></div>
                  <p className="text-base md:text-lg text-gray-500 italic font-light">
                    A Korean martial arts club for Taekwondo Lovers
                  </p>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300"></div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Loading Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.6 }}
              className="mt-14"
            >
              <div className="flex justify-center items-center gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-gray-400 to-red-400"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
