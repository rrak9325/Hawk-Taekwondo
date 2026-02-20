import { useState, useEffect, memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Shield, CheckCircle, Award, Users, Target, Heart, TrendingUp, Star } from 'lucide-react'
import Hero from '../components/Hero'
import CapturedMomentsGallery from '../components/CapturedMomentsGallery'
import Testimonials from '../components/Testimonials'
import { useSchoolData } from '../hooks/useSchoolData.js'
import { PageLoadingFallback } from '../components/LoadingFallback'
import ServerDownPage from '../components/ServerDownPage'
import useScrollReveal from '../hooks/useScrollRevealNew'
import LazySection from '../components/LazySection'

// Optimized Scroll reveal wrapper component
const ScrollReveal = ({ children, delay = 0, className = 'slide-up' }) => {
  const { ref, isVisible } = useScrollReveal()
  
  return (
    <div 
      ref={ref} 
      className={`${className} ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// Memoized Feature Card component - Now using CSS utilities!
const FeatureCard = memo(({ feature, index }) => {
  const iconMap = { Shield, Award, Users, Target, Heart, TrendingUp, Star }
  const Icon = iconMap[feature?.icon] || Shield

  return (
    <div className="bg-white rounded-2xl p-6 text-center border-b-4 border-transparent shadow-md hover-lift hover:shadow-2xl hover:border-red-600 transition-all duration-500">
      <div className="w-14 h-14 lg:w-16 lg:h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 transition-transform duration-400 hover:scale-110 hover:rotate-6">
        <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-red-600" />
      </div>
      <h3 className="text-lg lg:text-xl font-bold mb-2 lg:mb-3 text-gray-900">{feature?.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{feature?.description}</p>
    </div>
  )
})

FeatureCard.displayName = 'FeatureCard'

// Memoized Program Card component - Now using CSS utilities!
const ProgramCard = memo(({ program, index }) => {
  const benefits = Array.isArray(program.benefits)
    ? program.benefits
    : Object.values(program.benefits || {})

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover-lift hover:shadow-2xl transition-all duration-500">
      {program.image && (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img
            src={program.image}
            alt={program.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            width="400"
            height="225"
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-lg lg:text-xl font-bold mb-3 text-gray-900">{program.name}</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{program.description}</p>

        <ul className="flex flex-col gap-2 mb-6">
          {benefits.slice(0, 3).map((b, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <Link 
          to="/programs#programs-section" 
          className="block w-full text-center py-3 border-2 border-red-600 text-red-600 rounded-xl font-semibold hover-lift hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-600/30 transition-all duration-400"
        >
          Learn More
        </Link>
      </div>
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
      <LazySection className="py-12 lg:py-16 xl:py-24" rootMargin="300px" keepMounted={true}>
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
      <LazySection className="py-16 lg:py-20 bg-white" rootMargin="300px" keepMounted={true}>
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
      <LazySection rootMargin="400px" keepMounted={true}>
        <CapturedMomentsGallery gallery={gallery} />
      </LazySection>

      {/* Testimonials Section - Only renders when in viewport */}
      <LazySection rootMargin="400px" keepMounted={true}>
        <Testimonials testimonials={data.testimonials || []} />
      </LazySection>

      {/* Call to Action Section - Only renders when in viewport */}
      <LazySection className="py-12 lg:py-16 xl:py-20 bg-gradient-to-br from-primary to-primary-light text-white text-center" rootMargin="300px" keepMounted={true}>
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
