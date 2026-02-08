import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Shield, Frown } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          animate={{
            rotate: [0, 15, -15, 15, 0],
            scale: [1, 1.1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            repeat: 1,
          }}
          className="inline-block mb-8"
        >
          <Frown className="w-24 h-24 text-red-500 mx-auto" />
          {/* or keep Shield if you want irony → <Shield className="w-24 h-24 text-secondary mx-auto opacity-70" /> */}
        </motion.div>

        <h1 className="font-heading text-7xl md:text-9xl font-black text-primary mb-4 tracking-tight">
          404
        </h1>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
          SKILL ISSUE        </h2>

        <p className="text-gray-700 text-xl md:text-2xl mb-8 leading-relaxed">

          WRONG PAGE
        </p>


        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-10">
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center space-x-3 px-8 py-4 text-lg font-medium"
          >
            <Home className="w-6 h-6" />
            <span>Teleport home ig</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline inline-flex items-center justify-center space-x-3 px-8 py-4 text-lg font-medium"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Rewind the L</span>
          </button>
        </div>

        <div className="mt-12 pt-10 border-t border-gray-200">
          <p className="text-gray-600 text-lg mb-5 font-medium">
            Still lost? Or just bored? Pick your poison:
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-base md:text-lg">
            <Link to="/programs" className="text-secondary hover:underline underline-offset-4">
              Programs
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/schedule" className="text-secondary hover:underline underline-offset-4">
              Schedule
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/about" className="text-secondary hover:underline underline-offset-4">
              About Us
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/contact" className="text-secondary hover:underline underline-offset-4">
              Contact (send help)
            </Link>
          </div>
        </div>

        <p className="mt-16 text-gray-500 italic text-sm">
          Pro tip: ctrl + c → ctrl + v next time. skill issue fr
        </p>
      </motion.div>
    </div>
  )
}

export default NotFound