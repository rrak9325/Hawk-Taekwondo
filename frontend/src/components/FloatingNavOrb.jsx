import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, ChevronRight } from 'lucide-react'

const NAV_PAGES = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/programs', label: 'Programs' },
  { path: '/faculty', label: 'Faculty' },
  { path: '/schedule', label: 'Schedule' },
  { path: '/contact', label: 'Contact' }
]

export default function FloatingNavOrb() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      {/* Floating Orb - Mobile Only */}
      <div className="md:hidden fixed bottom-6 left-6 z-40">
        {/* Menu Items - shown when open */}
        {isOpen && (
          <div className="absolute bottom-20 left-0 flex flex-col gap-3 animate-scale-in">
            {NAV_PAGES.map((page, index) => {
              const isActive = location.pathname === page.path
              return (
                <Link
                  key={page.path}
                  to={page.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-full font-bold transition-all whitespace-nowrap shadow-lg ${
                    isActive
                      ? 'bg-secondary text-white scale-110'
                      : 'bg-white/95 text-primary hover:bg-white hover:shadow-xl'
                  }`}
                  style={{
                    animation: `slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                    animationDelay: `${index * 40}ms`,
                    opacity: 0
                  }}
                >
                  <span className="text-sm">{page.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              )
            })}
          </div>
        )}

        {/* Main Orb Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-16 h-16 rounded-full shadow-2xl transition-all active:scale-95 flex items-center justify-center font-bold text-white text-2xl ${
            isOpen
              ? 'bg-red-600 hover:bg-red-700 rotate-45'
              : 'bg-gradient-to-br from-secondary to-red-700 hover:shadow-secondary/50 hover:shadow-2xl animate-pulse-float'
          }`}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <span>✦</span>}
        </button>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulseFloat {
          0%, 100% {
            transform: translateY(0px);
            box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4), 0 0 20px rgba(251, 191, 36, 0.3);
          }
          50% {
            transform: translateY(-8px);
            box-shadow: 0 12px 32px rgba(239, 68, 68, 0.5), 0 0 28px rgba(251, 191, 36, 0.4);
          }
        }

        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-pulse-float {
          animation: pulseFloat 3s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
