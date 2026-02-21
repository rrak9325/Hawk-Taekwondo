import { useState, useEffect } from 'react'
import { shouldUseInfiniteLoops } from '../utils/devicePerformance.js'

export default function WelcomeSplash() {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = sessionStorage.getItem('hasVisitedHTTC')
    
    if (hasVisited) {
      setIsVisible(false)
      return
    }

    // Progress bar animation (faster)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5 // Faster progress (100 / 20 steps = 5% per 100ms)
      })
    }, 100)

    // Hide splash after 2 seconds
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        setIsVisible(false)
        sessionStorage.setItem('hasVisitedHTTC', 'true')
      }, 800) // Wait for exit animation
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [])

  if (!isVisible) return null

  // Full animated splash for all devices
  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden ${isExiting ? 'splash-exit' : ''}`}>
      {/* Modern White Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-red-50"></div>
      
      {/* Animated Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-30 gradient-pulse"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1), transparent 70%)'
        }}
      />

      {/* Floating Particles */}
      {shouldUseInfiniteLoops() && (
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-300/30 rounded-full particle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Glassmorphism Container */}
      <div className="relative z-10 text-center px-8 py-12 max-w-2xl backdrop-blur-xl bg-white/60 rounded-3xl border border-gray-200/50 shadow-2xl container-enter">
        {/* Logo with Modern Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Glow Effect */}
            <div
              className="absolute inset-0 blur-3xl opacity-30 glow-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(220, 38, 38, 0.4), transparent)'
              }}
            />
            
            <img
              src="https://res.cloudinary.com/dem7arres/image/upload/v1771347376/eagle-modified_n3g8to.png"
              alt="Hawk Taekwondo Logo"
              className="relative w-40 h-40 object-contain drop-shadow-2xl logo-spin"
            />
          </div>
        </div>

        {/* Text - All fade in together */}
        <div className="space-y-4 text-fade-in">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
            Welcome to <span className="text-red-600">HTTC</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 font-semibold">
            Hawk Taekwondo Training Centre
          </p>
          
          <p className="text-base md:text-lg text-gray-500 italic">
            A Korean martial arts club for Taekwondo Lovers
          </p>
        </div>

        {/* Modern Progress Bar */}
        <div className="mt-10 progress-fade-in">
          <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            {/* Glow on progress bar */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-400 to-red-500 rounded-full blur-sm opacity-50 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-3 font-medium">
            Loading experience... {Math.round(progress)}%
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeOut {
          to { opacity: 0; }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes spinIn {
          from {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradientPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.3;
          }
        }
        
        @keyframes glowPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
        
        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-30px);
            opacity: 0;
          }
        }
        
        .splash-exit {
          animation: fadeOut 0.8s ease-out forwards;
        }
        
        .container-enter {
          animation: scaleIn 0.6s ease-out;
        }
        
        .logo-spin {
          animation: spinIn 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .text-fade-in {
          animation: fadeInUp 0.8s ease-out 0.4s backwards;
        }
        
        .progress-fade-in {
          animation: fadeInUp 0.6s ease-out 0.8s backwards;
        }
        
        .gradient-pulse {
          animation: gradientPulse 4s ease-in-out infinite;
        }
        
        .glow-pulse {
          animation: glowPulse 2s ease-in-out infinite;
        }
        
        .particle-float {
          animation: particleFloat 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
