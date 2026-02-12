import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Testimonials({ testimonials = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  
  // Convert object to array if testimonials is an object
  const testimonialsArray = Array.isArray(testimonials) ? testimonials : Object.values(testimonials || {})
  
  if (!testimonialsArray || testimonialsArray.length === 0) {
    return null
  }

  // Auto-advance slider every 6.5 seconds (with proper cleanup)
  useEffect(() => {
    if (isPaused || testimonialsArray.length <= 1) {
      return
    }
    
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % testimonialsArray.length)
    }, 6500)
    
    // Cleanup function to prevent memory leaks
    return () => {
      clearInterval(timer)
    }
  }, [testimonialsArray.length, isPaused])
  
  // Pause auto-advance on user interaction
  const handleUserInteraction = () => {
    setIsPaused(true)
    // Resume after 10 seconds of no interaction
    setTimeout(() => setIsPaused(false), 10000)
  }

  const handleNext = () => {
    handleUserInteraction()
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonialsArray.length)
  }

  const handlePrev = () => {
    handleUserInteraction()
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonialsArray.length) % testimonialsArray.length)
  }

  const handleDotClick = (index) => {
    handleUserInteraction()
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const currentTestimonial = testimonialsArray[currentIndex]

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8
    })
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-red-600 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            What Our <span className="text-secondary">Students Say</span>
          </h2>
          <p className="text-gray-600 text-base lg:text-lg">
            Hear from our community of dedicated martial artists
          </p>
        </motion.div>

        {/* Slider Container */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative min-h-[400px] md:min-h-[350px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 }
                }}
                className="absolute inset-0 flex items-center justify-center px-4"
              >
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 max-w-4xl w-full">
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="mb-6">
                      {currentTestimonial.image ? (
                        <img
                          src={currentTestimonial.image}
                          alt={currentTestimonial.name}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-red-100 shadow-lg"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center border-4 border-red-100 shadow-lg">
                          <span className="text-white font-bold text-3xl md:text-4xl">
                            {currentTestimonial.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < currentTestimonial.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <blockquote className="text-xl md:text-2xl text-gray-700 italic mb-8 leading-relaxed max-w-3xl">
                      "{currentTestimonial.comment}"
                    </blockquote>

                    {/* Name and Program */}
                    <div>
                      <h4 className="text-2xl font-bold text-primary mb-1">
                        {currentTestimonial.name}
                      </h4>
                      <p className="text-lg text-gray-500 font-medium">
                        {currentTestimonial.program}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white hover:bg-gray-50 text-gray-700 p-3 md:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all z-20 group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white hover:bg-gray-50 text-gray-700 p-3 md:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all z-20 group"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
          </button>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonialsArray.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-10 bg-red-600'
                    : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}