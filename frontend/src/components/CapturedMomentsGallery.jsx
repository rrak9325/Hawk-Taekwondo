import { useState, useEffect, useCallback, useMemo } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import RobustImage from './RobustImage'

export default function CapturedMomentsGallery({ gallery }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })

  // Handle both array and object formats for gallery.featured
  const rawImages = gallery?.featured || []
  const images = Array.isArray(rawImages) ? rawImages : Object.values(rawImages)
  
  if (!images.length) return null

  // Virtualization: Only render images in viewport + buffer
  const visibleImages = useMemo(() => {
    return images.slice(visibleRange.start, visibleRange.end)
  }, [images, visibleRange])

  // Intersection Observer for infinite scroll/lazy loading
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const pageHeight = document.documentElement.scrollHeight
      
      // Load more images when near bottom
      if (scrollPosition > pageHeight - 1000 && visibleRange.end < images.length) {
        setVisibleRange(prev => ({
          start: prev.start,
          end: Math.min(prev.end + 20, images.length)
        }))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [visibleRange, images.length])

  // Open lightbox at specific index
  const openLightbox = useCallback((index) => {
    setCurrentIndex(index)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
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
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Captured <span className="text-red-600">Moments</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Witness the journey of our students as they master the art of Taekwondo
            </p>
          </div>

          {/* Masonry Grid Layout - Pinterest Style */}
          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4 lg:gap-6 space-y-3 sm:space-y-4 lg:space-y-6">
            {visibleImages.map((item, index) => {
              const actualIndex = visibleRange.start + index
              // Randomly vary heights for masonry effect
              const heightClass = index % 5 === 0 ? 'aspect-[3/4]' : 
                                 index % 7 === 0 ? 'aspect-[4/5]' : 
                                 index % 3 === 0 ? 'aspect-square' : 
                                 'aspect-[4/3]'
              
              return (
                <div
                  key={item.id || actualIndex}
                  className="break-inside-avoid mb-3 sm:mb-4 lg:mb-6"
                >
                  <div
                    className={`group relative ${heightClass} overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gray-200 transform hover:-translate-y-1`}
                    onClick={() => openLightbox(actualIndex)}
                    style={{ 
                      willChange: 'transform',
                      transform: 'translateZ(0)'
                    }}
                  >
                    <RobustImage
                      src={item.image}
                      alt={item.title || `Moment ${actualIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      width={window.innerWidth < 640 ? 200 : 300}
                      height={window.innerWidth < 640 ? 200 : 300}
                      optimize={true}
                      retryCount={2}
                    />
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center justify-between text-white">
                          <span className="text-sm font-medium">View Full Size</span>
                          <ZoomIn className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Subtle border glow effect */}
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-red-500/0 group-hover:ring-red-500/50 transition-all duration-300"></div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Loading indicator for more images */}
          {visibleRange.end < images.length && (
            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg">
                <div className="w-5 h-5 border-3 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-700 font-medium">Loading more memories...</p>
              </div>
            </div>
          )}
          
          {/* Show total count */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            Showing {visibleRange.end} of {images.length} moments
          </div>
        </div>
      </section>

      {/* Full-screen Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          style={{ animation: 'fadeIn 0.2s' }}
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

          {/* Current image with preloading */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center px-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <RobustImage
              src={images[currentIndex].image}
              alt={images[currentIndex].title || `Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              width={1920}
              height={1080}
              optimize={true}
              retryCount={3}
            />
          </div>

          {/* Preload next and previous images for smooth navigation */}
          <div className="hidden">
            {currentIndex > 0 && (
              <img src={images[currentIndex - 1].image} alt="preload" />
            )}
            {currentIndex < images.length - 1 && (
              <img src={images[currentIndex + 1].image} alt="preload" />
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 bg-black/80 px-5 py-2 rounded-full text-white text-sm font-medium shadow-xl">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}
