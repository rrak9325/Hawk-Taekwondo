import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

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
  overlayOpacity = "bg-black/25"
}) {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    })
  }

  return (
    <div className="hero-container relative w-full">
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
        <div className="max-w-4xl text-center text-white" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            {titleMain}{' '}
            {titleHighlight && <span className="text-red-500">{titleHighlight}</span>}
          </h1>

          {subtitle && (
            <p className="text-xl md:text-2xl text-white font-medium mb-10">
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
      `}</style>
    </div>
  )
}
