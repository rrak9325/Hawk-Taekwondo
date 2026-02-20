import { useState, useEffect, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import performanceDetector from '../utils/performanceDetector'
import OptimizedVideo from './OptimizedVideo'

// Use Cloudinary URL instead of local import to reduce bundle size
const logo = 'https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good,w_200/v1771436615/logo1_weejgq.png'

export default function Hero({ 
  titleMain, 
  titleHighlight, 
  subtitle, 
  videoUrl, 
  backgroundImage, 
  height = "min-h-[60vh] md:min-h-[70vh]",
  showScroll = true,
  overlayOpacity = "bg-black/25",
  showHawk = false
}) {
  const [showContent, setShowContent] = useState(false)
  const [titleMoved, setTitleMoved] = useState(false)
  const [useVideo, setUseVideo] = useState(true)
  
  // Get performance config
  const perfConfig = useMemo(() => performanceDetector.getAnimationConfig(), [])
  const shouldAnimate = perfConfig.enabled

  // Detect if device should use video
  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    const isSlow = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
    const isLowEnd = perfConfig.tier === 'minimal' || perfConfig.tier === 'low'
    
    // Disable video on low-end devices or slow connections
    if (isSlow || isLowEnd || !videoUrl) {
      setUseVideo(false)
    }
    
    // Show content immediately
    setShowContent(true)
    
    // Move title after 3.5 seconds
    const titleTimer = setTimeout(() => {
      setTitleMoved(true)
    }, 3500)

    return () => clearTimeout(titleTimer)
  }, [videoUrl, perfConfig.tier])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    })
  }

  // Optimize video URL with Cloudinary transformations
  const optimizedVideoUrl = videoUrl ? videoUrl.replace('/upload/', '/upload/q_auto,f_auto,vc_auto/') : null

  return (
    <section className={`relative w-full ${height} overflow-hidden bg-black`}>
      {/* Decorative Pattern - Only on high-end devices - Now using CSS animations! */}
      {shouldAnimate && perfConfig.complexAnimations && (
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-red-500 rounded-full animate-float" />
          <div className="absolute top-40 right-20 w-24 h-24 border-4 border-white rotate-45 animate-float delay-100" />
          <div className="absolute bottom-32 left-1/4 w-40 h-40 border-4 border-red-500 rounded-full animate-float delay-200" />
        </div>
      )}

      {/* Background Media */}
      <div 
        className="absolute inset-0 w-full h-full transition-opacity duration-1000 overflow-hidden"
        style={{ opacity: showContent ? 1 : 0 }}
      >
        {/* Background Image - Always loads first */}
        {backgroundImage && backgroundImage.trim() !== '' && !useVideo && (
          <img
            src={backgroundImage}
            alt={titleMain || 'Hero background'}
            className="absolute w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            onError={(e) => {
              console.warn('Background image failed to load:', backgroundImage)
              e.target.style.display = 'none'
            }}
          />
        )}
        
        {/* Optimized Video Component - Only on capable devices */}
        {useVideo && optimizedVideoUrl && (
          <OptimizedVideo
            src={optimizedVideoUrl}
            poster={backgroundImage}
            className="absolute w-full h-full object-cover"
            style={{ transform: 'scale(1.15)' }}
          />
        )}
        
        {/* Fallback gradient */}
        {!backgroundImage && !videoUrl && (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        )}
      </div>

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayOpacity} z-10`} />

      {/* Content */}
      <div 
        className={`absolute z-20 px-4 md:px-8 transition-all duration-[1800ms] ease-in-out ${
          titleMoved 
            ? 'bottom-16 md:bottom-20 left-0 text-left' 
            : 'inset-0 flex items-center justify-center text-center'
        }`}
      >
        <div 
          className={`text-white transition-all duration-[1800ms] ease-in-out ${
            titleMoved ? 'max-w-2xl' : 'max-w-5xl'
          }`}
          style={{ animation: 'fadeInUp 0.6s ease-out' }}
        >
          {showHawk && (
            <img 
              src={logo} 
              alt="Hawk Mascot" 
              className={`w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl mb-4 ${shouldAnimate ? 'animate-float' : ''}`}
              loading="lazy"
              decoding="async"
            />
          )}
          
          <h1 
            className={`font-heading font-bold mb-4 md:mb-6 transition-all duration-[1800ms] ease-in-out ${
              titleMoved ? 'text-3xl md:text-5xl' : 'text-5xl md:text-7xl'
            }`}
          >
            {titleMain}{' '}
            {titleHighlight && <span className="text-red-500">{titleHighlight}</span>}
          </h1>

          {subtitle && (
            <p 
              className={`text-white font-medium transition-all duration-[1800ms] ease-in-out ${
                titleMoved ? 'text-base md:text-lg' : 'text-xl md:text-2xl mb-10'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Scroll Down - Now using CSS animations! */}
      {showScroll && titleMoved && (
        <div 
          className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white flex-col items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition animate-fade-in-up"
          onClick={scrollToContent}
        >
          <span className="text-[10px] uppercase tracking-widest font-bold hover:text-red-500 transition-colors">Scroll Down</span>
          <ChevronDown size={35} className="text-red-500 animate-bounce" />
        </div>
      )}
      
      {/* Removed inline keyframes - now using animations.css! */}
    </section>
  )
}
