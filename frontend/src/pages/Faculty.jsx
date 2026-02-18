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

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
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

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
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