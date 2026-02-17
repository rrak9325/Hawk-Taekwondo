import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Frown } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-5 sm:px-6 lg:px-8">
      {/* Subtle red glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(220,38,38,0.12),transparent_60%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl relative z-10"
      >
        {/* Big sarcastic frown as focal point */}
        <motion.div
          initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
          animate={{
            scale: 1,
            rotate: [0, -8, 8, -4, 0],
            opacity: 1,
          }}
          transition={{
            scale: { duration: 0.7, ease: 'backOut' },
            rotate: { duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
          }}
          className="mb-8 md:mb-12"
        >
          <Frown className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 mx-auto text-red-600 drop-shadow-[0_0_40px_rgba(220,38,38,0.6)]" />
        </motion.div>

        {/* 404 with red accent */}
       

        {/* Sarcastic headline */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mb-10 md:mb-14"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white">
            Really bro?
          </h2>
          <p className="mt-3 text-xl sm:text-2xl text-red-400 font-medium">
            Skill issue detected
          </p>
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 md:mb-16 leading-relaxed"
        >
          This page saw your navigation skills and decided to <span className="text-red-500 font-bold">log out of existence</span>.<br />
          <span className="text-base md:text-lg text-gray-500 mt-2 block italic">
            (can't blame it tbh)
          </span>
        </motion.p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
          <Link
            to="/"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xl rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:shadow-[0_0_45px_rgba(220,38,38,0.8)] transition-all duration-300 min-w-[220px]"
          >
            <Home className="w-7 h-7" />
            Back to Safety
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-transparent border-2 border-red-600/70 hover:border-red-500 text-red-400 hover:text-red-300 font-bold text-xl rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] min-w-[220px]"
          >
            <ArrowLeft className="w-7 h-7 group-hover:-translate-x-1.5 transition-transform" />
            Undo My Life Choices
          </button>
        </div>

        {/* Quick navigation */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-lg md:text-xl">
          <Link to="/programs" className="text-red-400 hover:text-red-300 transition-colors underline underline-offset-4 decoration-red-700/50 hover:decoration-red-500">
            Programs
          </Link>
          <Link to="/schedule" className="text-red-400 hover:text-red-300 transition-colors underline underline-offset-4 decoration-red-700/50 hover:decoration-red-500">
            Schedule
          </Link>
          <Link to="/about" className="text-red-400 hover:text-red-300 transition-colors underline underline-offset-4 decoration-red-700/50 hover:decoration-red-500">
            About
          </Link>
          <Link to="/contact" className="text-red-400 hover:text-red-300 transition-colors underline underline-offset-4 decoration-red-700/50 hover:decoration-red-500">
            Contact (send help)
          </Link>
        </div>

        {/* Final sarcastic one-liner */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-16 text-gray-500 text-base md:text-lg italic"
        >
          "404 — even your page has standards higher than your aim."
        </motion.p>
      </motion.div>
    </div>
  )
}

export default NotFound