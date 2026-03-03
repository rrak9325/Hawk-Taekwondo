import { useState, useEffect, memo, useCallback } from 'react'
import { Shield, Target, Users, Award, Star, Check } from 'lucide-react'
import Hero from '../components/Hero'
import PageNavigation from '../components/PageNavigation'
import { useSchoolData } from '../hooks/useSchoolData.js'
import { PageLoadingFallback } from '../components/LoadingFallback'
import ServerDownPage from '../components/ServerDownPage'
import { currentAnimationConfig } from '../utils/devicePerformance.js'

// Lightweight scroll animation hook
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useState(null)[0]

  useEffect(() => {
    // Skip scroll animations on low-end devices
    if (!currentAnimationConfig.useScrollAnimations) {
      setIsVisible(true)
      return
    }

    if (!ref) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [ref])

  return [ref, isVisible]
}

// Memoized Program Card
const ProgramCard = memo(({ program, index }) => {
  const icons = [Shield, Target, Users, Award]
  const Icon = icons[index % icons.length]
  
  // Hardcoded benefits as fallback
  const defaultBenefits = {
    'Kickboxing': [
      'Improved cardiovascular endurance and stamina',
      'Full-body strength and muscle toning',
      'Enhanced coordination, agility, and power'
    ],
    'Taekwondo': [
      'Improved flexibility and balance',
      'Enhanced cardiovascular fitness and mental discipline',
      'Self-defense skills and confidence building'
    ],
    'Self Defence': [
      'Effective protection skills and situational awareness',
      'Confidence in dangerous situations',
      'Quick reaction techniques and legal knowledge'
    ],
    'MuayThai': [
      'Explosive power development and conditioning',
      'Mental toughness and traditional Thai techniques',
      'Competition preparation and striking mastery'
    ]
  }
  
  const benefits = defaultBenefits[program.name] || []
  
  return (
    <div
      className="program-card-wrapper"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="program-card group">
        {program.image ? (
          <div className="program-image-container">
            <img 
              src={program.image} 
              alt={program.name}
              className="program-image"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              width="400"
              height="300"
            />
          </div>
        ) : (
          <div className="program-placeholder">
            <div className="program-placeholder-icon">
              <Icon className="placeholder-icon" />
            </div>
          </div>
        )}
        
        <div className="program-content">
          <h3 className="program-title">
            {program.name}
          </h3>
          
          <p className="program-description">
            {program.description}
          </p>
          
          <div className="program-benefits">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="benefit-item">
                <Check className="benefit-check" />
                <span className="benefit-text">{benefit}</span>
              </div>
            ))}
          </div>
          
          <a 
            href="/contact#form" 
            className="program-cta"
          >
            Enroll Now
          </a>
        </div>
      </div>
      
      <style>{`
        .program-card-wrapper {
          opacity: 0;
          animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .program-card {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          background: linear-gradient(to bottom right, white, #f9fafb);
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .program-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
        }
        
        .program-image-container {
          height: 12rem;
          overflow: hidden;
          background: #f5f5f5;
        }
        
        .program-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .program-card:hover .program-image {
          transform: scale(1.08);
        }
        
        .program-placeholder {
          height: 12rem;
          background: linear-gradient(to bottom right, rgba(17, 24, 39, 0.05), rgba(220, 38, 38, 0.05));
          display: flex;
          align-items: center;
          justify-center;
        }
        
        .program-placeholder-icon {
          width: 5rem;
          height: 5rem;
          border-radius: 50%;
          background: rgba(17, 24, 39, 0.1);
          display: flex;
          align-items: center;
          justify-center;
        }
        
        .placeholder-icon {
          width: 2.5rem;
          height: 2.5rem;
          color: #111827;
        }
        
        .program-content {
          padding: 1.5rem;
        }
        
        .program-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.75rem;
          transition: color 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .program-card:hover .program-title {
          color: #dc2626;
        }
        
        .program-description {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .program-benefits {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        
        .benefit-check {
          width: 1rem;
          height: 1rem;
          color: #dc2626;
          margin-top: 0.125rem;
          flex-shrink: 0;
        }
        
        .benefit-text {
          font-size: 0.875rem;
          color: #374151;
          line-height: 1.4;
        }
        
        .program-cta {
          display: block;
          width: 100%;
          background: linear-gradient(to right, #111827, #dc2626);
          color: white;
          text-align: center;
          padding: 0.75rem;
          border-radius: 12px;
          font-weight: 600;
          transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }
        
        .program-cta:hover {
          background: linear-gradient(to right, rgba(17, 24, 39, 0.9), rgba(220, 38, 38, 0.9));
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4);
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
})

ProgramCard.displayName = 'ProgramCard'

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
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
})

WhyChooseCard.displayName = 'WhyChooseCard'

export default function Programs() {
  const { data, loading, error } = useSchoolData()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (data) {
      setTimeout(() => setReady(true), 150)
    }
  }, [data])

  // Scroll to section if hash is present
  useEffect(() => {
    if (ready && window.location.hash === '#programs-section') {
      setTimeout(() => {
        const element = document.getElementById('programs-section')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    }
  }, [ready])

  if (loading) return <PageLoadingFallback />
  
  if (error) return <ServerDownPage />

  if (!data) return null

  const { programs: programsData, programsPage } = data

  // Convert programs object to array
  const programs = Object.values(programsData || {})
  
  // Hardcoded benefits as fallback
  const defaultBenefits = {
    'Kickboxing': [
      'Improved cardiovascular endurance and stamina',
      'Full-body strength and muscle toning',
      'Enhanced coordination, agility, and power'
    ],
    'Taekwondo': [
      'Improved flexibility and balance',
      'Enhanced cardiovascular fitness and mental discipline',
      'Self-defense skills and confidence building'
    ],
    'Self Defence': [
      'Effective protection skills and situational awareness',
      'Confidence in dangerous situations',
      'Quick reaction techniques and legal knowledge'
    ],
    'MuayThai': [
      'Explosive power development and conditioning',
      'Mental toughness and traditional Thai techniques',
      'Competition preparation and striking mastery'
    ]
  }

  const icons = [Shield, Target, Users, Award]

  return (
    <div className="bg-white" style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.3s' }}>
      <Hero {...programsPage.hero} />

      <section id="programs-section" className="py-16 md:py-24 relative overflow-hidden">
        {/* Background Design Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient Mesh */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-50/50 via-transparent to-yellow-50/50"></div>
          
          {/* Floating Shapes */}
          <div className="absolute top-10 right-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          
          {/* Martial Arts Inspired Patterns */}
          <div className="absolute top-1/3 left-10 opacity-10">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#dc2626" strokeWidth="2" fill="none" />
              <circle cx="50" cy="50" r="30" stroke="#dc2626" strokeWidth="2" fill="none" />
              <circle cx="50" cy="50" r="20" stroke="#dc2626" strokeWidth="2" fill="none" />
            </svg>
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute bottom-10 right-10 w-40 h-40 opacity-5">
            <div className="grid grid-cols-4 gap-2 h-full">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="bg-gray-900 rounded"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Martial Arts Programs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the perfect discipline to elevate your fitness, confidence, and self-defense skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, i) => (
              <ProgramCard key={program.id} program={program} index={i} />
            ))}
          </div>
        </div>
        
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </section>

      <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
        {/* Enhanced Background Design */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-red-50/30"></div>
          
          {/* Large Decorative Circles */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
          
          {/* Geometric Grid Pattern */}
          <div className="absolute top-10 right-10 opacity-5">
            <div className="grid grid-cols-6 gap-3">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-gray-900 rounded-sm"></div>
              ))}
            </div>
          </div>
          
          {/* Diagonal Lines */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-200/20 to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-yellow-200/20 to-transparent"></div>
          
          {/* Floating Shapes */}
          <div className="absolute top-1/3 left-10 w-20 h-20 border-2 border-red-300/20 rounded-lg rotate-12 animate-float"></div>
          <div className="absolute bottom-1/3 right-10 w-16 h-16 border-2 border-yellow-300/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
              Why Choose Our Programs?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <WhyChooseCard
                icon={Star}
                title="Expert Instructors"
                description="Certified masters with real-world experience"
                color="primary"
                index={0}
              />
              <WhyChooseCard
                icon={Target}
                title="Proven Results"
                description="Transform your body and mind with our methods"
                color="secondary"
                index={1}
              />
              <WhyChooseCard
                icon={Users}
                title="Community"
                description="Join a supportive family of martial artists"
                color="primary"
                index={2}
              />
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(12deg); }
            50% { transform: translateY(-15px) rotate(12deg); }
          }
          
          .animate-float {
            animation: float 5s ease-in-out infinite;
          }
        `}</style>
      </section>

      <PageNavigation />
    </div>
  )
}