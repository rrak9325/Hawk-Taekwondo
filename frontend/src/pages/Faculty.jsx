import { useState, useEffect, memo } from 'react'
import { Award, Star, Users, Heart } from 'lucide-react'
import Hero from '../components/Hero'
import { useSchoolData } from '../hooks/useSchoolData.js'
import { PageLoadingFallback } from '../components/LoadingFallback'

// Memoized Instructor Card
const InstructorCard = memo(({ instructor, index, isActive }) => {
  return (
    <div
      className="instructor-card-wrapper"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Animated gradient border */}
      <div className={`instructor-gradient-border ${isActive ? 'active' : ''}`}></div>
      
      {/* Card content */}
      <div className={`instructor-card ${isActive ? 'active' : ''}`}>
        <div className="md:flex">
          <div className="md:w-2/5 p-6 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
            {instructor.image ? (
              <div className="relative">
                <img
                  src={instructor.image} 
                  alt={instructor.name}
                  className={`instructor-photo ${isActive ? 'active' : ''}`}
                  style={{ objectPosition: 'center top' }}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchpriority={index < 2 ? 'high' : 'low'}
                  width="192"
                  height="192"
                />
                <div className={`instructor-photo-overlay ${isActive ? 'active' : ''}`}></div>
              </div>
            ) : (
              <div className="w-48 h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-10 h-10 text-primary" />
                </div>
              </div>
            )}
          </div>
          
          <div className="md:w-3/5 p-6 md:p-8">
            <div className="mb-4">
              <h3 className="font-heading text-2xl font-bold text-primary mb-1">
                {instructor.name}
              </h3>
              <p className="text-secondary font-semibold">{instructor.rank}</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  {instructor.specialization}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  {instructor.experience} experience
                </span>
              </div>
              
              {instructor.instagram && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <a 
                    href={`https://www.instagram.com/${instructor.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    {instructor.instagram}
                  </a>
                </div>
              )}
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {instructor.bio}
            </p>
            
            <div className="flex gap-2">
              <a 
                href="/contact" 
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white text-center py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02]"
              >
                Contact Instructor
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .instructor-card-wrapper {
          position: relative;
          padding: 1px;
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .instructor-gradient-border {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          background: linear-gradient(to right, #dc2626, #f59e0b, #eab308, #dc2626);
          background-size: 200% 200%;
          opacity: 0;
          transition: opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .instructor-gradient-border.active {
          opacity: 1;
          animation: gradientShift 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        .instructor-card {
          position: relative;
          background: linear-gradient(to bottom right, white, #f9fafb);
          border-radius: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: box-shadow 1000ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .instructor-card.active {
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
        }
        
        .instructor-photo {
          width: 12rem;
          height: 12rem;
          object-fit: cover;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transition: transform 1000ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .instructor-photo.active {
          transform: scale(1.1);
        }
        
        .instructor-photo-overlay {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(to top, rgba(17, 24, 39, 0.1), transparent);
          opacity: 0;
          transition: opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .instructor-photo-overlay.active {
          opacity: 1;
        }
        
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
        
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
})

InstructorCard.displayName = 'InstructorCard'

// Memoized Why Choose Card
const WhyChooseCard = memo(({ icon: Icon, title, description, color, index }) => {
  return (
    <div
      className="why-choose-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`why-icon-wrapper ${color}`}>
        <Icon className="why-icon" />
      </div>
      <h3 className="why-title">{title}</h3>
      <p className="why-description">{description}</p>
      
      <style>{`
        .why-choose-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid #f3f4f6;
          transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          position: relative;
          z-index: 10;
        }
        
        .why-choose-card:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
        }
        
        .why-icon-wrapper {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .why-icon-wrapper.primary {
          background: rgba(17, 24, 39, 0.1);
        }
        
        .why-icon-wrapper.secondary {
          background: rgba(220, 38, 38, 0.1);
        }
        
        .why-choose-card:hover .why-icon-wrapper {
          transform: scale(1.15) rotate(5deg);
        }
        
        .why-icon {
          width: 2rem;
          height: 2rem;
        }
        
        .why-icon-wrapper.primary .why-icon {
          color: #111827;
        }
        
        .why-icon-wrapper.secondary .why-icon {
          color: #dc2626;
        }
        
        .why-title {
          font-weight: 700;
          font-size: 1.125rem;
          color: #111827;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        
        .why-description {
          color: #6b7280;
          text-align: center;
          font-size: 0.875rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  )
})

WhyChooseCard.displayName = 'WhyChooseCard'

export default function Faculty() {
  const { data, loading, error } = useSchoolData()
  const [ready, setReady] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (data) {
      setTimeout(() => setReady(true), 150)
    }
  }, [data])

  // Cycle through instructors every 4 seconds
  useEffect(() => {
    if (!data) return
    
    const instructors = Object.values(data.instructors || {})
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % instructors.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [data])

  if (loading) return <PageLoadingFallback />
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load content: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { instructors: instructorsData, facultyPage } = data

  // Convert instructors object to array
  const instructors = Object.values(instructorsData || {})

  return (
    <div
      className="bg-white"
      style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <Hero 
        {...facultyPage.hero}
        height="h-[70vh]"
        overlayOpacity="bg-black/40"
      />

      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Background Design Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Geometric Patterns */}
          <div className="absolute top-40 right-20 w-32 h-32 border-4 border-red-200/30 rounded-lg rotate-45"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 border-4 border-yellow-200/30 rounded-full"></div>
          
          {/* Dots Pattern */}
          <div className="absolute top-1/4 left-1/4 grid grid-cols-3 gap-4 opacity-20">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-red-600 rounded-full"></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              Expert Faculty
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our instructors are certified professionals dedicated to your growth and success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {instructors.map((instructor, i) => (
              <InstructorCard
                key={instructor.id}
                instructor={instructor}
                index={i}
                isActive={activeIndex === i}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
        {/* Enhanced Background Design */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient Mesh */}
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 via-gray-50 to-yellow-50/30"></div>
          
          {/* Large Blurred Orbs */}
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-yellow-500/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-red-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Trophy/Award Pattern */}
          <div className="absolute top-20 right-20 opacity-5">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" fill="#111827" />
            </svg>
          </div>
          
          {/* Dots Grid */}
          <div className="absolute bottom-20 left-20 grid grid-cols-4 gap-4 opacity-10">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-red-600 rounded-full"></div>
            ))}
          </div>
          
          {/* Diagonal Accent Lines */}
          <div className="absolute top-0 left-1/3 w-0.5 h-full bg-gradient-to-b from-transparent via-red-200/15 to-transparent transform -skew-x-12"></div>
          <div className="absolute top-0 right-1/3 w-0.5 h-full bg-gradient-to-b from-transparent via-yellow-200/15 to-transparent transform skew-x-12"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
              Why Train With Our Instructors?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <WhyChooseCard
                icon={Award}
                title="Certified Experts"
                description="Licensed coaches with proven track records"
                color="primary"
                index={0}
              />
              <WhyChooseCard
                icon={Heart}
                title="Personal Attention"
                description="Individualized coaching for every student"
                color="secondary"
                index={1}
              />
              <WhyChooseCard
                icon={Users}
                title="Proven Results"
                description="Students who achieve their goals consistently"
                color="primary"
                index={2}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}