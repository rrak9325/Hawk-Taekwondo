import { motion } from 'framer-motion'

export default function LoadingFallback({ message = "Loading..." }) {
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
    <div className="flex items-center justify-center py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        {/* Mini blocks loader */}
        <div className="relative w-12 h-12">
          <motion.div
            className="absolute inset-0 bg-secondary rounded-md"
            animate={{
              scale: [1, 0.8, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-primary rounded-sm"
              style={{
                top: '50%',
                left: '50%',
                marginTop: '-6px',
                marginLeft: '-6px',
              }}
              animate={{
                x: [0, Math.cos((angle * Math.PI) / 180) * 20],
                y: [0, Math.sin((angle * Math.PI) / 180) * 20],
                rotate: 360,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <motion.p
          className="text-gray-600 text-sm font-medium"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
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
