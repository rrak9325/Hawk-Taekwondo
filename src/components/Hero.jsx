import { motion } from 'framer-motion'
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
    <section className={`relative h-[80vh] w-full overflow-hidden text-white flex items-center justify-center`}>
      {/* Background Media Container */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            preload="auto"
            poster={backgroundImage}
            className="w-full h-full object-cover object-center"

          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : backgroundImage ? (
          <img 
            src={backgroundImage} 
            alt={titleMain} 
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary" />
        )}
      </div>

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayOpacity} z-10 transition-colors duration-700`} />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl text-center"
        >
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 text-shadow">
            {titleMain}{' '}
            {titleHighlight && <span className="text-secondary">{titleHighlight}</span>}
          </h1>

          {subtitle && (
            <p className="text-xl md:text-2xl text-white font-medium mb-10 text-shadow-lg drop-shadow-md">
              {subtitle}
            </p>
          )}

          {(primaryButton || secondaryButton) && (
            <div className="flex gap-4 justify-center flex-wrap">
              {/* {primaryButton && (
                <Link to={primaryButton.link} className="btn-secondary px-8 py-4 text-lg font-semibold shadow-xl">
                  {primaryButton.label}
                </Link>
              )} */}

              {/* {secondaryButton && (
                <Link to={secondaryButton.link} className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-100 transition">
                  {secondaryButton.label}
                </Link>
              )} */}
            </div>
          )}
        </motion.div>
      </div>

      {/* Scroll Down Symbol */}
      {showScroll && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white"
          onClick={scrollToContent}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition group"
          >
            <span className="text-[10px] uppercase tracking-widest font-bold group-hover:text-secondary transition-colors">Scroll Down</span>
            <ChevronDown size={35} className="text-secondary" />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
