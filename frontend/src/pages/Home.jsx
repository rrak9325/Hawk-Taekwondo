import { useState, useEffect, memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Shield, CheckCircle, Award, Users, Target, Heart, TrendingUp, Star } from 'lucide-react'
import Hero from '../components/Hero'
import CapturedMomentsGallery from '../components/CapturedMomentsGallery'
import Testimonials from '../components/Testimonials'
import { useSchoolData } from '../hooks/useSchoolData.js'
import { PageLoadingFallback } from '../components/LoadingFallback'
import ServerDownPage from '../components/ServerDownPage'
import useScrollReveal from '../hooks/useScrollReveal'
import LazySection from '../components/LazySection'

// Scroll reveal wrapper component
const ScrollReveal = ({ children, delay = 0 }) => {
  const ref = useScrollReveal()
  
  return (
    <div 
      ref={ref} 
      className="scroll-reveal"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// Memoized Feature Card component for better performance
const FeatureCard = memo(({ feature, index }) => {
  const iconMap = { Shield, Award, Users, Target, Heart, TrendingUp, Star }
  const Icon = iconMap[feature?.icon] || Shield

  return (
    <div
      className="feature-card"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="feature-icon-wrapper">
        <Icon className="feature-icon" />
      </div>
      <h3 className="feature-title">{feature?.title}</h3>
      <p className="feature-description">{feature?.description}</p>

      <style>{`
        .feature-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          border-bottom: 4px solid transparent;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .feature-card:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
          border-bottom-color: #dc2626;
        }
        
        .feature-icon-wrapper {
          width: 3.5rem;
          height: 3.5rem;
          background: rgba(220, 38, 38, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (min-width: 1024px) {
          .feature-icon-wrapper {
            width: 4rem;
            height: 4rem;
            margin-bottom: 1.5rem;
          }
        }
        
        .feature-card:hover .feature-icon-wrapper {
          transform: scale(1.15) rotate(5deg);
        }
        
        .feature-icon {
          width: 1.75rem;
          height: 1.75rem;
          color: #dc2626;
        }
        
        @media (min-width: 1024px) {
          .feature-icon {
            width: 2rem;
            height: 2rem;
          }
        }
        
        .feature-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #111827;
        }
        
        @media (min-width: 1024px) {
          .feature-title {
            font-size: 1.25rem;
            margin-bottom: 0.75rem;
          }
        }
        
        .feature-description {
          color: #6b7280;
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

FeatureCard.displayName = 'FeatureCard'

// Memoized Program Card component
const ProgramCard = memo(({ program, index }) => {
  const benefits = Array.isArray(program.benefits)
    ? program.benefits
    : Object.values(program.benefits || {})

  return (
    <div
      className="program-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {program.image && (
        <div className="program-image-container">
          <img
            src={program.image}
            alt={program.name}
            className="program-image"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            width="400"
            height="225"
          />
        </div>
      )}

      <div className="program-content">
        <h3 className="program-title">{program.name}</h3>
        <p className="program-description">{program.description}</p>

        <ul className="program-benefits">
          {benefits.slice(0, 3).map((b, idx) => (
            <li key={idx} className="program-benefit">
              <CheckCircle className="benefit-icon" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <Link to="/programs#programs-section" className="program-link">
          Learn More
        </Link>
      </div>

      <style>{`
        .program-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .program-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
        }
        
        .program-image-container {
          aspect-ratio: 16/9;
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
        
        .program-content {
          padding: 1.5rem;
        }
        
        .program-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #111827;
        }
        
        @media (min-width: 1024px) {
          .program-title {
            font-size: 1.25rem;
          }
        }
        
        .program-description {
          color: #6b7280;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        
        .program-benefits {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .program-benefit {
          display: flex;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
        }
        
        .benefit-icon {
          width: 1rem;
          height: 1rem;
          color: #10b981;
          margin-top: 0.125rem;
          flex-shrink: 0;
        }
        
        .program-link {
          display: block;
          width: 100%;
          text-align: center;
          padding: 0.75rem;
          border: 2px solid #dc2626;
          color: #dc2626;
          border-radius: 12px;
          font-weight: 600;
          transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .program-link:hover {
          background: #dc2626;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
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

export default function Home() {
  const { data, loading, error } = useSchoolData()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (data) {
      setTimeout(() => setReady(true), 100)
    }
  }, [data])
  
  // Memoize computed arrays to prevent re-renders
  const safeFeatures = useMemo(() => {
    if (!data?.home?.features) return []
    const features = data.home.features
    return Array.isArray(features)
      ? features.filter(f => f && f.icon)
      : Object.values(features).filter(f => f && f.icon)
  }, [data?.home?.features])
  
  const safePrograms = useMemo(() => {
    if (!data?.programs) return []
    const programs = data.programs
    return Array.isArray(programs)
      ? programs.filter(p => p && p.name)
      : Object.values(programs).filter(p => p && p.name)
  }, [data?.programs])

  if (loading) return <PageLoadingFallback />

  if (error) return <ServerDownPage />

  if (!data) return null

  const { schoolInfo, home, gallery } = data
  const { hero } = home

  return (
    <div className="bg-white" style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.3s' }}>
      <Hero
        {...hero}
        height="h-[92vh]"
        overlayOpacity="bg-black/1"
        showHawk={false}
      />



      {/* Programs Preview Section - Only renders when in viewport */}
      <LazySection className="py-12 lg:py-16 xl:py-24" rootMargin="300px">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-primary mb-4">
                Our <span className="text-secondary">Programs</span>
              </h2>
              <p className="text-gray-600 text-base lg:text-lg">
                Discover the perfect program for your martial arts journey.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {safePrograms.slice(0, 3).map((p, i) => (
              <ScrollReveal key={p?.id || `program-${i}`} delay={i * 100}>
                <ProgramCard program={p} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </LazySection>
      {/* Features Section - Only renders when in viewport */}
      <LazySection className="py-16 lg:py-20 bg-white" rootMargin="300px">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
              <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-primary mb-4">
                Why Choose <span className="text-secondary">Hawk Taekwondo?</span>
              </h2>
              <p className="text-gray-600 text-base lg:text-lg">
                We provide a safe, supportive, and professional environment where students of all ages can excel in martial arts and character development.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {safeFeatures.map((f, i) => (
              <ScrollReveal key={f?.title || i} delay={i * 80}>
                <FeatureCard feature={f} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </LazySection>
      {/* Gallery Section - Only renders when in viewport */}
      <LazySection rootMargin="400px">
        <CapturedMomentsGallery gallery={gallery} />
      </LazySection>

      {/* Testimonials Section - Only renders when in viewport */}
      <LazySection rootMargin="400px">
        <Testimonials testimonials={data.testimonials || []} />
      </LazySection>

      {/* Call to Action Section - Only renders when in viewport */}
      <LazySection className="py-12 lg:py-16 xl:py-20 bg-gradient-to-br from-primary to-primary-light text-white text-center" rootMargin="300px">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/90 text-base lg:text-lg mb-6 lg:mb-8 max-w-2xl mx-auto">
              Join {schoolInfo.name} and discover the transformative power of martial arts.
              Build confidence, discipline, and strength in a supportive community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/contact" className="btn-secondary px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold w-full sm:w-auto hover-lift">
                Book A Free Trial
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </LazySection>
    </div>
  )
}
