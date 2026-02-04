import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'

export default function CapturedMomentsGallery({ gallery }) {
  const [maximizedIndex, setMaximizedIndex] = useState(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640

  const handleImageClick = (e, index) => {
    e.stopPropagation()
    if (!isMobile) return // desktop uses modal already
    setMaximizedIndex(maximizedIndex === index ? null : index)
  }

  const closeMaximized = useCallback(() => {
    setMaximizedIndex(null)
  }, [])

  if (!gallery?.featured?.length) return null

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* subtle bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary text-center mb-10">
          Captured <span className="text-secondary">Moments</span>
        </h2>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {gallery.featured.slice(0, 12).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="group cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 aspect-square relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={(e) => handleImageClick(e, index)}
              >
                <img
                  src={item.image}
                  alt={item.title || `Moment ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={index < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                />

                {/* hover overlay (desktop) */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hidden sm:flex">
                  <ZoomIn className="w-10 h-10 text-white drop-shadow-lg" />
                </div>

                {/* mobile tap hint */}
                {isMobile && (
                  <div className="absolute bottom-3 right-3 w-7 h-7 bg-black/50 backdrop-blur rounded-full flex items-center justify-center sm:hidden">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Center Zoom Popup */}
      <AnimatePresence>
        {maximizedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center touch-none"
            onClick={closeMaximized}
          >
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.75, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-[95vw] max-h-[90vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery.featured[maximizedIndex].image}
                alt={gallery.featured[maximizedIndex].title || 'Maximized moment'}
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl mx-auto touch-auto"
                style={{ maxWidth: '95vw' }}
              />

              {/* close hint */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
                Tap anywhere to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}