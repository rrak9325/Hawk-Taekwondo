import { motion } from 'framer-motion'
import { Zap, Heart, Star } from 'lucide-react'

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div
        className="flex flex-col items-center gap-8 relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Main cute loading animation */}
        <div className="relative">
          {/* Outer rotating ring */}
          <motion.div
            className="w-24 h-24 border-4 border-transparent border-t-primary border-r-secondary rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Inner pulsing heart */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Heart 
              className="w-8 h-8 text-secondary fill-secondary/20" 
              strokeWidth={2}
            />
          </motion.div>

          {/* Orbiting stars */}
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-6 h-6 flex items-center justify-center"
              style={{
                transformOrigin: '48px 48px',
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5,
              }}
              initial={{
                rotate: angle,
              }}
            >
              <motion.div
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  rotate: [-360, 0, -360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              >
                <Star 
                  className="w-4 h-4 text-yellow-500 fill-yellow-400" 
                  strokeWidth={2}
                />
              </motion.div>
            </motion.div>
          ))}

          {/* Pulse rings */}
          <motion.div
            className="absolute inset-[-8px] rounded-full border-2 border-primary/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0.1, 0.6],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute inset-[-16px] rounded-full border-2 border-secondary/20"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.4, 0.05, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </div>

        {/* Cute loading text with bouncing letters */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Zap className="w-6 h-6 text-primary animate-pulse" />
          <div className="flex">
            {['L', 'o', 'a', 'd', 'i', 'n', 'g'].map((letter, i) => (
              <motion.span
                key={i}
                className="font-heading text-2xl md:text-3xl font-bold text-primary"
                animate={{
                  y: [0, -8, 0],
                  color: ['#1A1A1A', '#DC143C', '#1A1A1A'],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              >
                {letter}
              </motion.span>
            ))}
            <motion.span
              className="font-heading text-2xl md:text-3xl font-bold text-primary ml-1"
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ...
            </motion.span>
          </div>
        </motion.div>

        {/* Cute motivational messages */}
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.p
            className="text-gray-600 text-sm font-medium mb-2"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🥋 Preparing your martial arts journey...
          </motion.p>
          
          <motion.div
            className="flex items-center justify-center gap-2 text-xs text-gray-500"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span>✨</span>
            <span>Building strength, discipline & confidence</span>
            <span>✨</span>
          </motion.div>
        </motion.div>

        {/* Progress dots */}
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Loader