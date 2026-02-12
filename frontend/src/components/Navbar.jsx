import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Trophy, Flame, Zap } from 'lucide-react'
import logo from '../assets/logo1.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    const isScrolled = window.scrollY > 5
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled)
    }
  }, [scrolled])

  useEffect(() => {
    let ticking = false
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', throttledScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [handleScroll])

  const navLinks = [
    { path: '/', label: 'Home', icon: <Flame className="w-4 h-4" /> },
    { path: '/about', label: 'About', icon: <Trophy className="w-4 h-4" /> },
    { path: '/programs', label: 'Programs', icon: <Zap className="w-4 h-4" /> },
    { path: '/faculty', label: 'Faculty', icon: <Trophy className="w-4 h-4" /> },
    { path: '/schedule', label: 'Schedule', icon: <Flame className="w-4 h-4" /> },
    { path: '/contact', label: 'Contact', icon: <Trophy className="w-4 h-4" /> },
  ]

  // Calculate menu height when open (approximate)
  const menuHeight = isOpen ? 'h-auto pb-4' : 'h-16 md:h-20'

  return (
    <div className="w-full">
      <div className={`fixed top-0 w-full z-50 transition-all duration-500 ${menuHeight}`}>
        <nav className={`w-full transition-all duration-500 ${scrolled ? 'bg-primary/95 backdrop-blur-xl shadow-2xl' : 'bg-primary'} text-white`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              
              <motion.div 
                className="flex items-center gap-2 md:gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Link to="/" className="flex items-center gap-2 md:gap-3">
                  <div className="relative">
                    <motion.img 
                      src={logo} 
                      alt="Hawk Taekwondo Logo" 
                      className="h-10 w-auto md:h-14 md:w-24 object-contain" 
                      loading="eager"
                      whileHover={{ rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                    {/* Simplified pulsing dot - less intensive */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-secondary rounded-full opacity-80" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg md:text-3xl font-black tracking-tighter text-white">
                      HAWK 
                    </span>
                    <span className="text-[0.5rem] md:text-xs font-bold text-secondary/80 tracking-widest uppercase">
                      MASTER YOUR STRIKE
                    </span>
                  </div>
                </Link>
              </motion.div>

              <div className="hidden md:flex items-center gap-2">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.path
                  return (
                    <Link 
                      key={link.path} 
                      to={link.path}
                      className={`px-4 lg:px-5 py-3 rounded-xl flex items-center gap-2 font-bold transition-all duration-300 transform ${
                        isActive
                          ? 'bg-secondary/20 text-secondary shadow-lg scale-105 ring-2 ring-secondary/30' 
                          : 'text-white/90 hover:text-white hover:bg-white/10 hover:shadow-md hover:scale-102'
                      }`}
                    >
                      <div className={`transition-all duration-300 ${isActive ? 'text-secondary' : 'text-white/80'}`}>
                        {link.icon}
                      </div>
                      <span className="text-sm">{link.label}</span>
                    </Link>
                  )
                })}
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-all active:scale-95"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6">
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </div>
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="md:hidden w-full  bg-black border-t border-white/10 shadow-2xl"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.path
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -30, opacity: 0 }}
                      transition={{ 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 300
                      }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-4 px-4 py-4 rounded-xl font-bold transition-all ${
                          isActive
                            ? 'bg-secondary text-white shadow-lg ring-2 ring-secondary/30' 
                            : 'hover:bg-white/10 text-white/90 hover:text-white hover:shadow-md'
                        }`}
                      >
                        <div className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/80'}`}>
                          {link.icon}
                        </div>
                        <span className="text-lg">{link.label}</span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Spacer div to push content down when menu is open */}
      <div className={`transition-all duration-500 ${isOpen ? 'h-80 md:h-20' : 'h-16 md:h-20'}`}></div>
    </div>
  )
}

export default Navbar