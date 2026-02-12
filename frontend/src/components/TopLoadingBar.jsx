import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const TopLoadingBar = () => {
  const [loading, setLoading] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [location])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] z-[9999] bg-gradient-to-r from-red-600 via-secondary to-red-600"
          initial={{ width: "0%", opacity: 1 }}
          animate={{ 
            width: ["0%", "30%", "70%", "95%"],
            transition: { duration: 2, ease: "easeOut" }
          }}
          exit={{ 
            width: "100%", 
            opacity: 0,
            transition: { duration: 0.3 }
          }}
        />
      )}
    </AnimatePresence>
  )
}

export default TopLoadingBar
