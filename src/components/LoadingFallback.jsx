import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'

export default function LoadingFallback({ message = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-5"
      >
        <div className="relative">
          {/* Cute spinning heart */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Heart 
              className="w-12 h-12 text-secondary fill-secondary/30" 
              strokeWidth={2}
            />
          </motion.div>

          {/* Orbiting sparkles */}
          {[0, 90, 180, 270].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 flex items-center justify-center"
              style={{
                transformOrigin: '24px 24px',
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.25,
              }}
              initial={{ rotate: angle }}
            >
              <Sparkles 
                className="w-3 h-3 text-yellow-500 fill-yellow-400" 
                strokeWidth={2}
              />
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-primary font-medium text-lg tracking-wide"
          animate={{
            opacity: [0.7, 1, 0.7],
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
    <div className="flex items-center justify-center py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        {/* Mini cute loader */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Heart 
              className="w-8 h-8 text-secondary fill-secondary/20" 
              strokeWidth={2}
            />
          </motion.div>
          
          {/* Mini sparkles */}
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-400" />
          </motion.div>
        </div>

        <motion.p
          className="text-gray-600 text-sm font-medium"
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Loading content...
        </motion.p>
      </motion.div>
    </div>
  )
}
