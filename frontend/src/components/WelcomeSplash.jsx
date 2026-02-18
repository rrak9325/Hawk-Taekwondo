import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WelcomeSplash() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = sessionStorage.getItem('hasVisitedHTTC')
    
    if (hasVisited) {
      setIsVisible(false)
      return
    }

    // Hide splash after 4.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem('hasVisitedHTTC', 'true')
    }, 4500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-hidden"
        >
          {/* Premium Background Elements */}
          <div className="absolute inset-0">
            {/* Sophisticated Gradient Mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-red-50/20"></div>
            
            {/* Luxury Shimmer Effect */}
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
            
            {/* Elegant Floating Orbs */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 300 + 100,
                  height: Math.random() * 300 + 100,
                  background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(220, 38, 38, 0.03)' : 'rgba(156, 163, 175, 0.03)'}, transparent)`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  filter: 'blur(40px)'
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
              />
            ))}
            
            {/* Premium Corner Frames */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              {/* Top Left */}
              <div className="absolute top-8 left-8 w-24 h-24">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
                <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-gray-300 to-transparent"></div>
              </div>
              
              {/* Top Right */}
              <div className="absolute top-8 right-8 w-24 h-24">
                <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-gray-300 to-transparent"></div>
                <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-gray-300 to-transparent"></div>
              </div>
              
              {/* Bottom Left */}
              <div className="absolute bottom-8 left-8 w-24 h-24">
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-0.5 h-full bg-gradient-to-t from-gray-300 to-transparent"></div>
              </div>
              
              {/* Bottom Right */}
              <div className="absolute bottom-8 right-8 w-24 h-24">
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-gray-300 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-0.5 h-full bg-gradient-to-t from-gray-300 to-transparent"></div>
              </div>
            </motion.div>
            
            {/* Subtle Particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: i % 3 === 0 ? 'rgba(220, 38, 38, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 0.6, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-3xl">
            {/* Logo with Premium Effects */}
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
                {/* Glow Effect Behind Logo */}
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
                    background: 'radial-gradient(circle, rgba(220, 38, 38, 0.4), transparent)',
                    willChange: 'transform, opacity'
                  }}
                />
                
                {/* Your Eagle Logo */}
                <motion.div
                  className="relative"
                  animate={{
                    y: [0, -8, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  style={{ willChange: 'transform' }}
                >
                  <img
                    src="https://res.cloudinary.com/dem7arres/image/upload/v1771347376/eagle-modified_n3g8to.png"
                    alt="Hawk Taekwondo Logo"
                    className="w-48 h-48 object-contain drop-shadow-2xl"
                    style={{ willChange: 'auto' }}
                  />
                </motion.div>
                
                {/* Multiple Pulsing Rings */}
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
              </div>
            </motion.div>

            {/* Welcome Text with Luxury Typography */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <motion.h1 
                className="text-6xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight"
                style={{
                  textShadow: '0 2px 20px rgba(0,0,0,0.05)'
                }}
              >
                Welcome to{' '}
                <motion.span 
                  className="text-red-600"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(220, 38, 38, 0.3)',
                      '0 0 30px rgba(220, 38, 38, 0.5)',
                      '0 0 20px rgba(220, 38, 38, 0.3)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  HTTC
                </motion.span>
              </motion.h1>
              
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

            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              className="mt-10"
            >
              <motion.div
                className="inline-block px-8 py-3 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-full shadow-lg"
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    '0 4px 20px rgba(0,0,0,0.05)',
                    '0 8px 30px rgba(220,38,38,0.1)',
                    '0 4px 20px rgba(0,0,0,0.05)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <span className="text-gray-700 text-sm md:text-base font-bold tracking-widest flex items-center gap-2">
                  <span className="text-red-600">✦</span>
                  Building Champions Since 1985
                  <span className="text-red-600">✦</span>
                </span>
              </motion.div>
            </motion.div>

            {/* Elegant Loading Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 0.6 }}
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
