import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import logo from '../assets/logo1.png'

export default function Hero({ 
  titleMain, 
  titleHighlight, 
  subtitle, 
  videoUrl, 
  backgroundImage, 
  primaryButton, 
  secondaryButton,
  height = "min-h-[60vh] md:min-h-[70vh]",
  showScroll = true,
  overlayOpacity = "bg-black/25",
  showHawk = false
}) {
  const [showVideo, setShowVideo] = useState(false)
  const [titleMoved, setTitleMoved] = useState(false)

  useEffect(() => {
    // Show video after 2 seconds
    const videoTimer = setTimeout(() => {
      setShowVideo(true)
    }, 2000)

    // Move title after 3.5 seconds
    const titleTimer = setTimeout(() => {
      setTitleMoved(true)
    }, 3500)

    return () => {
      clearTimeout(videoTimer)
      clearTimeout(titleTimer)
    }
  }, [])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    })
  }

  return (
    <section className={`relative w-full ${height} overflow-hidden bg-black`}>
      {/* Decorative Pattern - Behind everything */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-red-500 rounded-full" style={{ animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute top-40 right-20 w-24 h-24 border-4 border-white rotate-45" style={{ animation: 'float 8s ease-in-out infinite 1s' }} />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border-4 border-red-500 rounded-full" style={{ animation: 'float 7s ease-in-out infinite 2s' }} />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 border-4 border-white rotate-12" style={{ animation: 'float 9s ease-in-out infinite 1.5s' }} />
        <div className="absolute top-1/3 left-1/2 w-36 h-36 border-4 border-red-500 rotate-45" style={{ animation: 'float 10s ease-in-out infinite 0.5s' }} />
      </div>

      {/* Background Media - Fades in */}
      <div 
        className="absolute inset-0 w-full h-full transition-opacity duration-1000"
        style={{ 
          opacity: showVideo ? 1 : 0,
          willChange: showVideo ? 'auto' : 'opacity'
        }}
      >
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{ willChange: 'auto' }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : backgroundImage ? (
          <img
            src={backgroundImage}
            alt={titleMain || 'Hero background'}
            className="w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            style={{ willChange: 'auto' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        )}
      </div>

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayOpacity} z-10`} />

      {/* Content - Moves from center to bottom-left */}
      <div 
        className={`absolute z-20 px-4 md:px-8 transition-all duration-[1800ms] ease-in-out ${
          titleMoved 
            ? 'bottom-16 md:bottom-20 left-0 text-left' 
            : 'inset-0 flex items-center justify-center text-center'
        }`}
        style={{ willChange: titleMoved ? 'auto' : 'transform, opacity' }}
      >
        <div 
          className={`text-white transition-all duration-[1800ms] ease-in-out ${
            titleMoved ? 'max-w-2xl' : 'max-w-5xl'
          }`}
          style={{ 
            animation: 'fadeInUp 0.6s ease-out',
            willChange: titleMoved ? 'auto' : 'transform'
          }}
        >
          {showHawk && (
            <img 
              src={logo} 
              alt="Hawk Mascot" 
              className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl mb-4"
              style={{ animation: 'hawkFloat 5s ease-in-out infinite' }}
            />
          )}
          
          <h1 
            className={`font-heading font-bold mb-4 md:mb-6 transition-all duration-[1800ms] ease-in-out ${
              titleMoved 
                ? 'text-3xl md:text-5xl' 
                : 'text-5xl md:text-7xl'
            }`}
            style={{ willChange: titleMoved ? 'auto' : 'font-size' }}
          >
            {titleMain}{' '}
            {titleHighlight && <span className="text-red-500">{titleHighlight}</span>}
          </h1>

          {subtitle && (
            <p 
              className={`text-white font-medium transition-all duration-[1800ms] ease-in-out ${
                titleMoved 
                  ? 'text-base md:text-lg' 
                  : 'text-xl md:text-2xl mb-10'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Scroll Down Symbol - Desktop only - Always centered */}
      {showScroll && titleMoved && (
        <div 
          className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white flex-col items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition"
          onClick={scrollToContent}
          style={{ animation: 'fadeIn 1s 1s both' }}
        >
          <span className="text-[10px] uppercase tracking-widest font-bold hover:text-red-500 transition-colors">Scroll Down</span>
          <ChevronDown size={35} className="text-red-500" style={{ animation: 'bounce 2s infinite' }} />
        </div>
      )}
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(12px); }
        }
        @keyframes hawkFloat {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
          }
          50% { 
            transform: translateY(-10px) rotate(0deg); 
          }
        }
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(10deg); 
          }
        }
      `}</style>
    </section>
  )
}
