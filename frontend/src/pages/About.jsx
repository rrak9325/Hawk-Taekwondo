import { useState, useEffect, useRef, memo } from 'react'
import { Shield, Award, Heart, Target, Users, TrendingUp } from 'lucide-react'
import { useSchoolData } from '../hooks/useSchoolData.js'
import { PageLoadingFallback } from '../components/LoadingFallback'
import ServerDownPage from '../components/ServerDownPage'

// Lightweight scroll animation hook
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
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
  }, [])

  return [ref, isVisible]
}

// Count-up animation hook
function useCountUp(end, duration = 2000, isVisible) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let startTime = null
    const startValue = 0
    const endValue = parseInt(end.replace(/\D/g, '')) || 0

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * endValue)
      
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(endValue)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, isVisible])

  return count
}

// PhotoFrame component with elegant hover effects and captions
const PhotoFrame = memo(({ 
  src, 
  alt, 
  caption, 
  aspectRatio = '3/4', 
  aspectRatioMd,
  objectPosition = 'center',
  priority = false,
  className = '',
  style = {}
}) => {
  return (
    <div className={`photo-frame-wrapper ${className}`} style={style}>
      <div className="photo-frame group">
        <div 
          className={`photo-container aspect-[${aspectRatio}] ${aspectRatioMd ? `md:aspect-[${aspectRatioMd}]` : ''}`}
        >
          <img 
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchpriority={priority ? 'high' : 'low'}
            className="photo-image"
            style={{ objectPosition }}
          />
        </div>
        {caption && (
          <p className="photo-caption">
            {caption}
          </p>
        )}
      </div>
      
      <style>{`
        .photo-frame-wrapper {
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .photo-frame {
          position: relative;
          background: linear-gradient(to bottom, #fafafa, #ffffff);
          padding: 8px;
          border-radius: 12px;
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.08),
            0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        
        @media (min-width: 768px) {
          .photo-frame {
            padding: 12px;
          }
        }
        
        .photo-frame:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.12),
            0 4px 8px rgba(0, 0, 0, 0.08),
            0 0 0 2px rgba(220, 38, 38, 0.1);
        }
        
        .photo-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 8px;
          background: #f5f5f5;
        }
        
        .photo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        
        .photo-frame:hover .photo-image {
          transform: scale(1.05);
        }
        
        .photo-caption {
          margin-top: 12px;
          padding: 0 4px;
          text-align: center;
          font-size: 0.875rem;
          line-height: 1.4;
          color: #374151;
          font-weight: 600;
          transition: color 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (min-width: 768px) {
          .photo-caption {
            font-size: 0.9375rem;
            margin-top: 16px;
          }
        }
        
        .photo-frame:hover .photo-caption {
          color: #dc2626;
        }
      `}</style>
    </div>
  )
})

PhotoFrame.displayName = 'PhotoFrame'

// Memoized InstructorCard component
const InstructorCard = memo(({ instructor, index, isVisible }) => {
  const inst = instructor
  
  return (
    <div
      className={`instructor-card ${isVisible ? 'animate-scale' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="instructor-image-container">
        {inst.image ? (
          <img
            src={inst.image}
            alt={inst.name}
            className="instructor-image"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          />
        ) : (
          <span className="instructor-placeholder">
            {inst?.name?.charAt(0) || 'I'}
          </span>
        )}
      </div>
      <div className="instructor-info">
        <h3 className="instructor-name">{inst.name}</h3>
        <p className="instructor-rank">{inst.rank}</p>
        <p className="instructor-bio">
          {inst.specialization || inst.bio || 'Expert Instructor'}
        </p>
      </div>
      
      <style>{`
        .instructor-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          border-top: 4px solid #dc2626;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .instructor-card:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 
            0 12px 28px rgba(0, 0, 0, 0.15),
            0 0 0 2px rgba(220, 38, 38, 0.15);
        }
        
        .instructor-image-container {
          position: relative;
          aspect-ratio: 1;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .instructor-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .instructor-card:hover .instructor-image {
          transform: scale(1.08);
        }
        
        .instructor-placeholder {
          font-size: 3.75rem;
          font-weight: 900;
          color: #fecaca;
        }
        
        @media (min-width: 768px) {
          .instructor-placeholder {
            font-size: 4rem;
          }
        }
        
        .instructor-info {
          padding: 1.25rem 1.5rem;
          text-align: center;
        }
        
        @media (min-width: 768px) {
          .instructor-info {
            padding: 1.5rem;
          }
        }
        
        .instructor-name {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: #111827;
        }
        
        @media (min-width: 768px) {
          .instructor-name {
            font-size: 1.25rem;
          }
        }
        
        .instructor-rank {
          color: #dc2626;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        
        @media (min-width: 768px) {
          .instructor-rank {
            font-size: 1rem;
          }
        }
        
        .instructor-bio {
          color: #6b7280;
          font-size: 0.75rem;
          line-height: 1.5;
        }
        
        @media (min-width: 768px) {
          .instructor-bio {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  )
})

InstructorCard.displayName = 'InstructorCard'

export default function About() {
  const { data, loading, error } = useSchoolData()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (data) {
      setTimeout(() => setReady(true), 100)
    }
  }, [data])

  if (loading) return <PageLoadingFallback />

  if (error) return <ServerDownPage />

  if (!data) return null

  const { instructors: instructorsData, about } = data
  const instructors = Object.values(instructorsData || {}).filter(inst => inst && inst.name)

  const sortedInstructors = [...instructors].sort((a, b) =>
    a.name?.includes('Yajuvendrasinh') ? -1 : b.name?.includes('Yajuvendrasinh') ? 1 : 0
  )

  const { values, stats, cta } = about
  const safeStats = (Array.isArray(stats) ? stats : Object.values(stats || {})).filter(s => s && s.number && s.label)
  const safeValues = (Array.isArray(values) ? values : Object.values(values || {})).filter(v => v && v.icon && v.title)

  return (
    <div className="bg-white text-gray-900 relative about-page-container" style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.3s' }}>
      {/* Hero */}
      <HeroSection about={about} />
      
      {/* Legacy Story with Images */}
      <LegacyStorySection />
      
      {/* Stats */}
      <StatsSection safeStats={safeStats} />
      
      {/* Core Values */}
      <ValuesSection safeValues={safeValues} />
      
      {/* Instructors */}
      <InstructorsSection sortedInstructors={sortedInstructors} />
      
      {/* CTA */}
      <CTASection cta={cta} />
      
      <style>{`
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
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
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
        
        .animate-in {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-in-left {
          animation: fadeInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-in-right {
          animation: fadeInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-scale {
          animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        /* Performance optimizations */
        .about-page-container {
          will-change: opacity;
        }
        
        .animate-in,
        .animate-in-left,
        .animate-in-right,
        .animate-scale {
          will-change: transform, opacity;
        }
        
        /* Ensure smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Optimize image rendering */
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  )
}

function HeroSection() {
  const [titleVisible, setTitleVisible] = useState(false)
  const [hawkSlash, setHawkSlash] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const fullText = 'A Legacy Since 1985'
  
  useEffect(() => {
    // Hawk slash animation
    const slashTimer = setTimeout(() => setHawkSlash(true), 200)
    
    // Title fade in after slash
    const titleTimer = setTimeout(() => setTitleVisible(true), 800)
    
    // Typewriter effect starts after title
    const typeTimer = setTimeout(() => {
      let currentIndex = 0
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(typingInterval)
        }
      }, 70)
      
      return () => clearInterval(typingInterval)
    }, 1500)
    
    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    
    return () => {
      clearTimeout(slashTimer)
      clearTimeout(titleTimer)
      clearTimeout(typeTimer)
      clearInterval(cursorInterval)
    }
  }, [])
  
  return (
    <section className="relative min-h-[85vh] md:min-h-[95vh] flex items-center justify-center overflow-hidden w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10" />

      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good/v1771337575/hawk-taekwondo/images/cfd1516b-a500-4ed1-8197-067cca6132c6.jpg"
          alt="Hawk Taekwondo Training Centre"
          loading="eager"
          decoding="async"
          fetchpriority="high"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 40%' }}
        />
      </div>

      <div className="relative z-20 container mx-auto px-4 md:px-8 text-center max-w-6xl">
        <h1 
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white mb-6 md:mb-8 leading-tight transition-all duration-1000 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ 
            textShadow: '0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)',
            letterSpacing: '-0.02em'
          }}>
          <span className="relative inline-block">
            <span className={`relative z-10 ${hawkSlash ? 'hawk-slash-text' : ''}`}>Hawk</span>
            {hawkSlash && (
              <>
                {/* Hawk Bird Silhouette */}
                <svg 
                  className="absolute hawk-bird"
                  width="80" 
                  height="80" 
                  viewBox="0 0 100 100"
                  style={{ 
                    filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.9))',
                    pointerEvents: 'none'
                  }}>
                  <path 
                    d="M50 20 L30 35 L25 30 L20 35 L30 40 L35 50 L30 55 L35 60 L45 55 L50 65 L55 55 L65 60 L70 55 L65 50 L70 40 L80 35 L75 30 L70 35 L50 20 Z" 
                    fill="#fbbf24"
                  />
                </svg>
                
                {/* Slash Trail */}
                <svg 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hawk-slash-svg"
                  width="200" 
                  height="200" 
                  viewBox="0 0 200 200"
                  style={{ 
                    filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))',
                    pointerEvents: 'none'
                  }}>
                  <path 
                    d="M 20 100 Q 100 20 180 100" 
                    stroke="#fbbf24" 
                    strokeWidth="4" 
                    fill="none"
                    strokeLinecap="round"
                    className="slash-path"
                  />
                  <path 
                    d="M 15 95 L 25 105 M 175 95 L 185 105" 
                    stroke="#fbbf24" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    className="claw-marks"
                  />
                </svg>
                <div className="hawk-feathers">
                  <div className="feather feather-1"></div>
                  <div className="feather feather-2"></div>
                  <div className="feather feather-3"></div>
                </div>
              </>
            )}
          </span>
          {' '}Taekwondo Training Centre
        </h1>

        <div className="min-h-[2.5rem] md:min-h-[3.5rem]">
          <p 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-400 inline-block"
            style={{ 
              textShadow: '0 2px 8px rgba(0,0,0,0.7)',
              fontFamily: 'ui-monospace, monospace'
            }}
            aria-label={fullText}>
            {typedText}
            <span 
              className={`inline-block w-0.5 h-6 md:h-8 bg-amber-400 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`} 
              style={{ transition: 'opacity 0.1s' }} 
            />
          </p>
        </div>
      </div>

      {/* Scroll Down Indicator - Absolute positioned at bottom center */}
      <div className="absolute bottom-8 md:bottom-12 left-0 right-0 z-30 flex justify-center">
        <a 
          href="#legacy-section"
          className="flex flex-col items-center animate-bounce cursor-pointer hover:scale-110 transition-transform"
          onClick={(e) => {
            e.preventDefault()
            document.querySelector('#legacy-section')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <p className="text-white font-black text-sm md:text-base mb-2 tracking-wider text-center" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            SCROLL DOWN
          </p>
          <svg 
            className="w-6 h-6 md:w-8 md:h-8 text-amber-400" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="3" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </a>
      </div>
      
      <style>{`
        @keyframes hawkFly {
          0% {
            top: -20%;
            left: -20%;
            opacity: 0;
            transform: rotate(-45deg) scale(0.5);
          }
          30% {
            opacity: 1;
          }
          50% {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(0deg) scale(1.2);
          }
          70% {
            opacity: 1;
          }
          100% {
            top: 120%;
            left: 120%;
            opacity: 0;
            transform: rotate(45deg) scale(0.5);
          }
        }
        
        @keyframes slashIn {
          0% {
            stroke-dashoffset: 300;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.8;
          }
        }
        
        @keyframes clawAppear {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
        }
        
        @keyframes textShake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-2px) rotate(-1deg); }
          75% { transform: translateX(2px) rotate(1deg); }
        }
        
        @keyframes featherFall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(60px) rotate(180deg);
          }
        }
        
        .hawk-bird {
          animation: hawkFly 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          position: absolute;
          top: -20%;
          left: -20%;
          will-change: transform, opacity;
        }
        
        .hawk-slash-svg {
          animation: slashIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
          will-change: opacity;
        }
        
        .slash-path {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
        }
        
        .claw-marks {
          animation: clawAppear 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
          opacity: 0;
        }
        
        .hawk-slash-text {
          animation: textShake 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
        }
        
        .hawk-feathers {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        
        .feather {
          position: absolute;
          width: 8px;
          height: 20px;
          background: linear-gradient(to bottom, #fbbf24, #f59e0b);
          border-radius: 50% 50% 50% 0;
          opacity: 0;
          animation: featherFall 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          will-change: transform, opacity;
        }
        
        .feather-1 {
          left: -20px;
          animation-delay: 0.5s;
        }
        
        .feather-2 {
          left: 0px;
          animation-delay: 0.6s;
        }
        
        .feather-3 {
          left: 20px;
          animation-delay: 0.7s;
        }
      `}</style>
    </section>
  )
}

function LegacyStorySection() {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section id="legacy-section" ref={ref} className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Founder Tribute */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-10 items-start max-w-6xl mx-auto mb-16 md:mb-24">
          <div className={`${isVisible ? 'animate-in-left' : 'opacity-0'}`}>
            <div style={{
              position: 'relative',
              background: 'linear-gradient(to bottom, #fafafa, #ffffff)',
              padding: '8px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)',
              transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '100%',
                overflow: 'hidden',
                borderRadius: '8px',
                background: '#f5f5f5'
              }}>
                <img 
                  src="https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:best/v1771093457/vijay-nana2_axwbqh.jpg"
                  alt="Master Late Vijaysinh Rathod"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 20%'
                  }}
                />
              </div>
              <p style={{
                marginTop: '12px',
                padding: '0 4px',
                textAlign: 'center',
                fontSize: '0.875rem',
                lineHeight: '1.4',
                color: '#374151',
                fontWeight: '600'
              }}>
                Master Late Vijaysinh Rathod – Founder
              </p>
            </div>
          </div>

          <div className={`flex flex-col justify-center ${isVisible ? 'animate-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
            <div className="inline-block bg-red-600 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full mb-3 w-fit">
              1985 - FOUNDED
            </div>
            <h2 className="text-lg md:text-4xl font-black text-gray-900 mb-2 md:mb-4">
              Master Late Vijaysinh Rathod
            </h2>
            <p className="text-xs md:text-base text-gray-700 leading-relaxed mb-2 md:mb-3">
              In 1985, Master Vijaysinh Rathod started Hawk Taekwondo with one simple belief: martial arts should build character first, champions second.
            </p>
            <p className="text-xs md:text-base text-gray-600 leading-relaxed mb-2 md:mb-3">
              Over the years, he trained hundreds of students who went on to earn black belts and win at state and national levels. But what he really cared about was teaching discipline, mental strength, and self-respect—things that stick with you long after you leave the mat.
            </p>
            <p className="text-xs md:text-base text-gray-700 leading-relaxed italic border-l-4 border-red-600 pl-4">
              "We don't just train fighters—we build people who can handle whatever life throws at them."
            </p>
          </div>
        </div>

        {/* Image Grid - 3 Photos */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl underline md:text-4xl lg:text-5xl font-black text-center text-gray-900 mb-6 md:mb-10">
            Four Decades of Excellence
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <PhotoFrame
              src="https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good/v1771342947/IMG_0470_pprckt.jpg"
              alt="Hawk Taekwondo champions with medals and trophies"
              caption="State Championship Winners"
              aspectRatio="3/4"
              objectPosition="center 20%"
              className={isVisible ? 'animate-scale' : 'opacity-0'}
              style={{ animationDelay: '0.1s' }}
            />

            <PhotoFrame
              src="https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good/v1771351430/tsPEAK_noxbda.jpg"
              alt="Current students training at outdoor session"
              caption="Outdoor Training Session"
              aspectRatio="3/4"
              className={isVisible ? 'animate-scale' : 'opacity-0'}
              style={{ animationDelay: '0.15s' }}
            />

            <PhotoFrame
              src="https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good/v1771351683/nanakaksaPEAK_1_ybrb00.png"
              alt="Historical award ceremony with dignitaries"
              caption="Award Ceremony with Dignitaries"
              aspectRatio="3/4"
              className={isVisible ? 'animate-scale' : 'opacity-0'}
              style={{ animationDelay: '0.2s' }}
            />
          </div>

          {/* Large Feature Image */}
          <PhotoFrame
            src="https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good/v1771343248/IMG_2693_fbvdm9.jpg"
            alt="Students receiving awards at competition ceremony"
            caption="Competition Award Ceremony"
            aspectRatio="16/9"
            aspectRatioMd="21/9"
            className={`mt-6 md:mt-8 ${isVisible ? 'animate-in' : 'opacity-0'}`}
            style={{ animationDelay: '0.25s' }}
          />

          {/* Current Leadership */}
          <div className="mt-12 md:mt-16 text-center max-w-4xl mx-auto today-section">
            <div className="inline-block bg-red-600 text-white text-lg md:text-2xl font-black px-6 py-3 rounded-full mb-6 shadow-lg">
              TODAY
            </div>
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Led by Master Yajuvendrasinh Rathod
            </h3>
            <p className="text-base md:text-lg text-gray-700 mb-8">
              Continuing the legacy with modern training in Taekwondo, Kickboxing, Muay Thai & Self Defence
            </p>
            
            {/* Current Training Images - Side by Side */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <PhotoFrame
                src="https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good/v1771335992/hawk-taekwondo/images/13a7ed63-bf70-4878-828d-e805933d354e.jpg"
                alt="Current students practicing high kicks during training session"
                caption="Master Yajuvendrasinh Rathod training advanced students"
                aspectRatio="1/1"
                className={isVisible ? 'animate-in' : 'opacity-0'}
                style={{ animationDelay: '0.3s' }}
              />
              
              <PhotoFrame
                src="https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good/v1771400433/curr_classes_v49n6k.png"
                alt="Current Hawk Taekwondo students with Master Yajuvendrasinh Rathod"
                caption="Current Students with Master Yajuvendrasinh Rathod"
                aspectRatio="1/1"
                className={isVisible ? 'animate-in' : 'opacity-0'}
                style={{ animationDelay: '0.35s' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsSection({ safeStats }) {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section ref={ref} className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {safeStats.map((s, i) => (
            <StatCard key={i} stat={s} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ValuesSection({ safeValues }) {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section ref={ref} className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-4xl font-black text-center mb-8 md:mb-12 text-gray-900">
          Our Core Values
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {safeValues.map((v, i) => {
            const iconMap = { Shield, Award, Heart, Target, Users, TrendingUp }
            const Icon = iconMap[v.icon] || Shield
            return (
              <ValueCard
                key={i}
                icon={Icon}
                title={v.title}
                description={v.description}
                index={i}
                isVisible={isVisible}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Memoized ValueCard component
const ValueCard = memo(({ icon: Icon, title, description, index, isVisible }) => {
  return (
    <div
      className={`value-card ${isVisible ? 'animate-in' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <Icon className="value-icon" />
      <h3 className="value-title">{title}</h3>
      <p className="value-description">{description}</p>
      
      <style>{`
        .value-card {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          text-align: center;
          transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }
        
        @media (min-width: 768px) {
          .value-card {
            padding: 1.5rem;
          }
        }
        
        .value-card:hover {
          background: white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px) scale(1.03);
          border-color: rgba(220, 38, 38, 0.1);
        }
        
        .value-icon {
          width: 2.5rem;
          height: 2.5rem;
          color: #dc2626;
          margin: 0 auto 0.75rem;
          display: block;
          transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (min-width: 768px) {
          .value-icon {
            width: 3rem;
            height: 3rem;
          }
        }
        
        .value-card:hover .value-icon {
          transform: scale(1.15) rotate(5deg);
        }
        
        .value-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #111827;
        }
        
        @media (min-width: 768px) {
          .value-title {
            font-size: 1.125rem;
          }
        }
        
        .value-description {
          color: #6b7280;
          font-size: 0.75rem;
          line-height: 1.5;
        }
        
        @media (min-width: 768px) {
          .value-description {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  )
})

ValueCard.displayName = 'ValueCard'

function InstructorsSection({ sortedInstructors }) {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section ref={ref} className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-4xl font-black text-center mb-8 md:mb-12 text-gray-900">
          Our Instructors
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {sortedInstructors.map((inst, i) => (
            <InstructorCard
              key={inst.id || i}
              instructor={inst}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ cta }) {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section ref={ref} className="py-16 md:py-32 bg-red-600 text-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className={`cta-content ${isVisible ? 'animate-scale' : 'opacity-0'}`}>
          <Award className="cta-icon" />
          <h2 className="cta-title">{cta.title || 'Join the Hawk Legacy'}</h2>
          <p className="cta-text">
            {cta.text || 'Become part of a legacy that builds confidence, resilience, and lifelong skills. Train with us in Ahmedabad today.'}
          </p>
          <a
            href={cta.buttonLink || '#contact'}
            className="cta-button"
          >
            {cta.buttonLabel || 'Start Your Journey'}
          </a>
        </div>
        
        <style>{`
          .cta-content {
            max-width: 56rem;
            margin: 0 auto;
          }
          
          .cta-icon {
            width: 4rem;
            height: 4rem;
            color: white;
            margin: 0 auto 1.5rem;
            opacity: 0.9;
            transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          @media (min-width: 768px) {
            .cta-icon {
              width: 6rem;
              height: 6rem;
              margin-bottom: 2rem;
            }
          }
          
          .cta-content:hover .cta-icon {
            transform: scale(1.1) rotate(5deg);
          }
          
          .cta-title {
            font-size: 1.875rem;
            font-weight: 900;
            margin-bottom: 1.5rem;
            line-height: 1.2;
          }
          
          @media (min-width: 768px) {
            .cta-title {
              font-size: 3.75rem;
              margin-bottom: 2rem;
            }
          }
          
          .cta-text {
            font-size: 1.125rem;
            margin-bottom: 2rem;
            opacity: 0.95;
            line-height: 1.6;
          }
          
          @media (min-width: 768px) {
            .cta-text {
              font-size: 1.5rem;
              margin-bottom: 3rem;
            }
          }
          
          .cta-button {
            display: inline-block;
            background: white;
            color: #dc2626;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-size: 1.25rem;
            font-weight: 700;
            transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          
          @media (min-width: 768px) {
            .cta-button {
              padding: 1.5rem 3rem;
              font-size: 1.875rem;
            }
          }
          
          .cta-button:hover {
            background: #f9fafb;
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
          }
        `}</style>
      </div>
    </section>
  )
}

// Stat card with count-up animation - Memoized for performance
const StatCard = memo(({ stat, index, isVisible }) => {
  const count = useCountUp(stat.number, 2000, isVisible)
  const suffix = stat.number.replace(/[0-9]/g, '') // Extract + or any suffix
  
  return (
    <div
      className={`stat-card ${isVisible ? 'animate-scale' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="stat-number">
        {count}{suffix}
      </div>
      <div className="stat-label">{stat.label}</div>
      
      <style>{`
        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          text-align: center;
          border-top: 4px solid #dc2626;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (min-width: 768px) {
          .stat-card {
            padding: 1.5rem;
          }
        }
        
        .stat-card:hover {
          transform: translateY(-6px) scale(1.05);
          box-shadow: 
            0 12px 28px rgba(0, 0, 0, 0.15),
            0 0 0 2px rgba(220, 38, 38, 0.1);
        }
        
        .stat-number {
          font-size: 1.5rem;
          font-weight: 900;
          color: #dc2626;
          margin-bottom: 0.25rem;
          line-height: 1.2;
        }
        
        @media (min-width: 768px) {
          .stat-number {
            font-size: 2.25rem;
            margin-bottom: 0.5rem;
          }
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        
        @media (min-width: 768px) {
          .stat-label {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  )
})

StatCard.displayName = 'StatCard'
