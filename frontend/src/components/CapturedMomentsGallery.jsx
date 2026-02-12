import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

export default function CapturedMomentsGallery({ gallery }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Handle both array and object formats for gallery.featured
  const rawImages = gallery?.featured || []
  const images = Array.isArray(rawImages) ? rawImages : Object.values(rawImages)
  
  if (!images.length) return null

  // Open lightbox at specific index
  const openLightbox = useCallback((index) => {
    setCurrentIndex(index)
    setIsOpen(true)
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
  }, [])

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }, [])

  // Navigation
  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeLightbox, goToPrev, goToNext])
  
  // Cleanup overflow style on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Touch swipe support for mobile
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const minSwipeDistance = 60

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) goToNext()
    if (isRightSwipe) goToPrev()
  }

  return (
    <>
      {/* Gallery Grid */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 md:mb-16">
            Captured <span className="text-red-600">Moments</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {images.map((item, index) => (
              <div
                key={item.id || index}
                className="group relative aspect-square overflow-hidden rounded-xl shadow-md cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={item.image}
                  alt={item.title || `Moment ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading={index < 6 ? 'eager' : 'lazy'}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-10 h-10 text-white opacity-80" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-screen Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={closeLightbox}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Close button */}
            <button
              className="absolute top-4 md:top-6 right-4 md:right-6 z-30 p-3 bg-black/70 rounded-full text-white hover:bg-black/90 transition shadow-2xl"
              onClick={closeLightbox}
              aria-label="Close"
            >
              <X size={28} />
            </button>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 bg-black/70 rounded-full text-white hover:bg-black/90 transition shadow-2xl"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrev()
                  }}
                  aria-label="Previous"
                >
                  <ChevronLeft size={32} />
                </button>

                <button
                  className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 bg-black/70 rounded-full text-white hover:bg-black/90 transition shadow-2xl"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  aria-label="Next"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Current image */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative w-full h-full flex items-center justify-center p-4 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentIndex].image}
                alt={images[currentIndex].title || `Image ${currentIndex + 1}`}
                className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 bg-black/80 px-5 py-2 rounded-full text-white text-sm font-medium shadow-xl">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}