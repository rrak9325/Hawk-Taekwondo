import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Trophy, Flame, Zap } from 'lucide-react'

// Use Cloudinary URL instead of local import to reduce bundle size
const logo = 'https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good,w_200/v1771436615/logo1_weejgq.png'

// Move navLinks outside component to prevent recreation on every render
const NAV_LINKS = [
  { path: '/', label: 'Home', icon: Flame },
  { path: '/about', label: 'About', icon: Trophy },
  { path: '/programs', label: 'Programs', icon: Zap },
  { path: '/faculty', label: 'Faculty', icon: Trophy },
  { path: '/schedule', label: 'Schedule', icon: Flame },
  { path: '/contact', label: 'Contact', icon: Trophy },
]

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

  // Calculate menu height when open (approximate)
  const menuHeight = useMemo(() => isOpen ? 'h-auto pb-4' : 'h-16 md:h-20', [isOpen])

  return (
    <div className="w-full">
      <div className={`fixed top-0 w-full z-50 transition-all duration-500`}>
        <nav className={`w-full transition-all duration-500 ${scrolled ? 'bg-primary/95 backdrop-blur-xl shadow-2xl' : 'bg-transparent'} text-white`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              
              <div 
                className="flex items-center gap-2 md:gap-3 transition-transform duration-300 hover:scale-105"
              >
                <Link to="/" className="flex items-center gap-2 md:gap-3">
                  <div className="relative">
                    <img 
                      src={logo} 
                      alt="Hawk Taekwondo Logo" 
                      className="h-10 w-auto md:h-14 md:w-24 object-contain transition-transform duration-300 hover:rotate-6" 
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex flex-col relative overflow-visible">
                    {/* Eagle resting on top of the "H" */}
                    <img 
                      src="https://res.cloudinary.com/dem7arres/image/upload/v1771347376/eagle-modified_n3g8to.png"
                      alt="Eagle"
                      className="absolute -top-3 md:-top-4 left-0 h-6 w-6 md:h-10 md:w-10 object-contain navbar-eagle"
                      style={{ 
                        filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 1)) drop-shadow(0 0 12px rgba(255, 255, 255, 0.8)) brightness(1.3)',
                        zIndex: 10
                      }}
                    />
                    <span className="text-lg md:text-3xl font-black tracking-tighter text-white drop-shadow-lg">
                      HAWK 
                    </span>
                    <span className="text-[0.5rem] md:text-xs font-bold text-secondary/80 tracking-widest uppercase drop-shadow-md">
                      MASTER YOUR STRIKE
                    </span>
                  </div>
                </Link>
              </div>

              <div className="hidden md:flex items-center gap-2">
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.path
                  const Icon = link.icon
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
                      <Icon className={`w-4 h-4 transition-all duration-300 ${isActive ? 'text-secondary' : 'text-white/80'}`} />
                      <span className="text-sm">{link.label}</span>
                    </Link>
                  )
                })}
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-3 rounded-xl hover:bg-white/20 transition-all active:scale-95 animate-pulse-custom relative group"
                aria-label="Toggle menu"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-6 h-6 relative z-10 text-secondary">
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </div>
                {!isOpen && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                )}
              </button>
            </div>
          </div>
        </nav>

        {isOpen && (
          <div
            className="md:hidden w-full bg-black/95 backdrop-blur-md border-t-2 border-secondary/50 shadow-2xl overflow-hidden mobile-menu-enter"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {NAV_LINKS.map((link, index) => {
                const isActive = location.pathname === link.path
                const Icon = link.icon
                return (
                  <div
                    key={link.path}
                    className="mobile-menu-item"
                    style={{ animationDelay: `${index * 50}ms` }}
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
                      <Icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/80'}`} />
                      <span className="text-lg">{link.label}</span>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes slideDown {
          from {
            max-height: 0;
            opacity: 0;
          }
          to {
            max-height: 500px;
            opacity: 1;
          }
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-30px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes pulse-custom {
          0%, 100% {
            box-shadow: 0 0 8px rgba(251, 191, 36, 0.6), inset 0 0 8px rgba(251, 191, 36, 0.2);
          }
          50% {
            box-shadow: 0 0 16px rgba(251, 191, 36, 0.8), inset 0 0 12px rgba(251, 191, 36, 0.4);
          }
        }
        
        .animate-pulse-custom {
          animation: pulse-custom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .mobile-menu-enter {
          animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .mobile-menu-item {
          animation: slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}

export default Navbar