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
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    })
  }

  return (
    <div className="hero-container relative w-full overflow-hidden">
      {/* Decorative Pattern - Behind everything */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-red-500 rounded-full" style={{ animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute top-40 right-20 w-24 h-24 border-4 border-white rotate-45" style={{ animation: 'float 8s ease-in-out infinite 1s' }} />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border-4 border-red-500 rounded-full" style={{ animation: 'float 7s ease-in-out infinite 2s' }} />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 border-4 border-white rotate-12" style={{ animation: 'float 9s ease-in-out infinite 1.5s' }} />
        <div className="absolute top-1/3 left-1/2 w-36 h-36 border-4 border-red-500 rotate-45" style={{ animation: 'float 10s ease-in-out infinite 0.5s' }} />
      </div>

      <div className="hero-background-wrapper">
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            preload="auto"
            poster={backgroundImage}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
            width="1920"
            height="1080"
            style={{ willChange: 'auto' }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : backgroundImage ? (
          <img
            src={backgroundImage}
            alt={titleMain || 'Hero background'}
            className="hero-bg-image absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
            width="1920"
            height="1080"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        )}
      </div>

      {/* Overlay */}
      <div className={`absolute top-0 left-0 w-full h-full ${overlayOpacity} z-10`} />

      {/* Content */}
      <div className="absolute top-0 left-0 w-full h-full z-20 flex items-center justify-center px-4">
        <div className="max-w-5xl text-center text-white relative" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          {/* Hawk positioned absolutely to float from above title to subtitle */}
          {showHawk && (
            <img 
              src={logo} 
              alt="Hawk Mascot" 
              className="absolute left-1/2 w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl"
              style={{ animation: 'hawkFloat 5s ease-in-out infinite', top: '0px' }}
            />
          )}
          
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            {titleMain}{' '}
            {titleHighlight && <span className="text-red-500">{titleHighlight}</span>}
          </h1>

          {subtitle && (
            <p className="text-xl md:text-2xl text-white font-medium mb-10 relative">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Scroll Down Symbol - Desktop only */}
      {showScroll && (
        <div 
          className="hidden md:flex absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 text-white flex-col items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition"
          onClick={scrollToContent}
          style={{ animation: 'fadeIn 1s 1.5s both' }}
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
            transform: translate(-50%, -60px) rotate(0deg); 
          }
          50% { 
            transform: translate(-50%, 100px) rotate(0deg); 
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
    </div>
  )
}
