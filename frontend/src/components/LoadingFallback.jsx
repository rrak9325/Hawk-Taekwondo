import { motion } from 'framer-motion'
import { shouldUseInfiniteLoops } from '../utils/devicePerformance.js'
import { SkeletonFeatureCard } from './LoadingSkeleton'

export default function LoadingFallback({ message = "Loading..." }) {
  // Use CSS-only spinner on low-end devices
  if (!shouldUseInfiniteLoops()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-secondary rounded-lg animate-spin" />
            {[0, 90, 180, 270].map((angle, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-primary rounded animate-pulse"
                style={{
                  top: '50%',
                  left: '50%',
                  marginTop: '-8px',
                  marginLeft: '-8px',
                  animationDelay: `${i * 150}ms`
                }}
              />
            ))}
          </div>
          <p className="text-primary font-semibold text-lg tracking-wide animate-pulse">
            {message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Martial arts blocks animation */}
        <div className="relative w-20 h-20">
          {/* Center block */}
          <motion.div
            className="absolute inset-0 bg-secondary rounded-lg"
            animate={{
              scale: [1, 0.8, 1],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Orbiting blocks */}
          {[0, 90, 180, 270].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-primary rounded"
              style={{
                top: '50%',
                left: '50%',
                marginTop: '-8px',
                marginLeft: '-8px',
              }}
              animate={{
                x: [0, Math.cos((angle * Math.PI) / 180) * 35],
                y: [0, Math.sin((angle * Math.PI) / 180) * 35],
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}
        </div>

        <motion.p
          className="text-primary font-semibold text-lg tracking-wide"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  )
}

export function PageLoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonFeatureCard count={4} />
      </div>
    </div>
  )
}
