import { useState, useEffect, useRef } from 'react'
import { AlertCircle, Shield, Award, Heart, Target, Users, TrendingUp } from 'lucide-react'
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

  const { schoolInfo, instructors: instructorsData, about } = data
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
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-15px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(15px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-in {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        .animate-in-left {
          animation: fadeInLeft 0.5s ease-out forwards;
        }
        
        .animate-in-right {
          animation: fadeInRight 0.5s ease-out forwards;
        }
        
        .animate-scale {
          animation: scaleIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

function HeroSection({ about }) {
  const [titleVisible, setTitleVisible] = useState(false)
  const [hawkSlash, setHawkSlash] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const fullText = 'A Legacy Since 1985'
  
  useEffect(() => {
    // Hawk slash animation
    setTimeout(() => setHawkSlash(true), 200)
    
    // Title fade in after slash
    setTimeout(() => setTitleVisible(true), 800)
    
    // Typewriter effect starts after title
    setTimeout(() => {
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
    
    return () => clearInterval(cursorInterval)
  }, [])
  
  return (
    <section className="relative min-h-[85vh] md:min-h-[95vh] flex items-center justify-center overflow-hidden w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10" />

      <div className="absolute inset-0 w-full h-full">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good/v1771337575/hawk-taekwondo/images/cfd1516b-a500-4ed1-8197-067cca6132c6.jpg)`,
            backgroundPosition: 'center 40%'
          }}
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

      {/* Scroll Down Indicator - Fixed at bottom center with smooth scroll */}
      <a 
        href="#legacy-section"
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-bounce cursor-pointer hover:scale-110 transition-transform"
        onClick={(e) => {
          e.preventDefault()
          document.querySelector('#legacy-section')?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        <p className="text-white font-black text-sm md:text-base mb-2 tracking-wider" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
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
        }
        
        .hawk-slash-svg {
          animation: slashIn 0.6s ease-out 0.3s forwards;
        }
        
        .slash-path {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
        }
        
        .claw-marks {
          animation: clawAppear 0.4s ease-out 0.3s forwards;
          opacity: 0;
        }
        
        .hawk-slash-text {
          animation: textShake 0.3s ease-out 0.4s;
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
          animation: featherFall 1s ease-out forwards;
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
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start max-w-6xl mx-auto mb-16 md:mb-24">
          <div className={`rounded-xl overflow-hidden shadow-2xl ${isVisible ? 'animate-in-left' : 'opacity-0'}`}>
            <div className="aspect-[3/4] w-full">
              <img 
                src="https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:best/v1771093457/vijay-nana2_axwbqh.jpg"
                alt="Master Late Vijaysinh Rathod"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>

          <div className={`flex flex-col justify-center ${isVisible ? 'animate-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="inline-block bg-red-600 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full mb-3 w-fit">
              1985 - FOUNDED
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-3 md:mb-4">
              Master Late Vijaysinh Rathod
            </h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3">
              Founded Hawk Taekwondo in 1985 with a vision to build champions of character, not just fighters.
            </p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              His legacy lives through countless black belts and state champions.
            </p>
          </div>
        </div>

        {/* Image Grid - 3 Photos */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-black text-center text-gray-900 mb-6 md:mb-10">
            Four Decades of Excellence
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {/* Image 1 - Champions Group Photo */}
            <div className={`rounded-xl overflow-hidden shadow-lg ${isVisible ? 'animate-scale' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <div className="aspect-[3/4]">
                <img 
                  src="https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good/v1771342947/IMG_0470_pprckt.jpg"
                  alt="Hawk Taekwondo champions with medals and trophies"
                  className="w-full h-full object-cover object-[center_20%]"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Image 2 - Outdoor Training (Current) */}
            <div className={`rounded-xl overflow-hidden shadow-lg ${isVisible ? 'animate-scale' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <div className="aspect-[3/4]">
                <img 
                  src="https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good/v1771351430/tsPEAK_noxbda.jpg"
                  alt="Current students training at outdoor session"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Image 3 - Modi Ji Ceremony (Historical) */}
            <div className={`rounded-xl overflow-hidden shadow-lg ${isVisible ? 'animate-scale' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
              <div className="aspect-[3/4]">
                <img 
                  src="https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good/v1771351683/nanakaksaPEAK_1_ybrb00.png"
                  alt="Historical award ceremony with dignitaries"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Large Feature Image */}
          <div className={`mt-6 md:mt-8 rounded-xl overflow-hidden shadow-2xl ${isVisible ? 'animate-in' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            <div className="aspect-[16/9] md:aspect-[21/9]">
              <img 
                src="https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good/v1771343248/IMG_2693_fbvdm9.jpg"
                alt="Students receiving awards at competition ceremony"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>

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
            
            {/* Current Training Image */}
            <div className={`rounded-xl overflow-hidden shadow-2xl ${isVisible ? 'animate-in' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
              <div className="aspect-[16/9] md:aspect-[21/9]">
                <img 
                  src="https://res.cloudinary.com/dem7arres/image/upload/f_auto,q_auto:good/v1771335992/hawk-taekwondo/images/13a7ed63-bf70-4878-828d-e805933d354e.jpg"
                  alt="Current students practicing high kicks during training session"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
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
              <div
                key={i}
                className={`bg-gray-50 rounded-lg p-5 md:p-6 text-center hover:shadow-lg transition-shadow duration-300 ${isVisible ? 'animate-in' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Icon className="w-10 h-10 md:w-12 md:h-12 text-red-600 mx-auto mb-3" />
                <h3 className="text-base md:text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm">{v.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

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
            <div
              key={inst.id || i}
              className={`bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-red-600 ${isVisible ? 'animate-scale' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {inst.image ? (
                  <img
                    src={inst.image}
                    alt={inst.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-5xl md:text-6xl font-black text-red-200">
                    {inst?.name?.charAt(0) || 'I'}
                  </span>
                )}
              </div>
              <div className="p-5 md:p-6 text-center">
                <h3 className="text-lg md:text-xl font-bold mb-1">{inst.name}</h3>
                <p className="text-red-600 font-semibold text-sm md:text-base mb-2">{inst.rank}</p>
                <p className="text-gray-600 text-xs md:text-sm">
                  {inst.specialization || inst.bio || 'Expert Instructor'}
                </p>
              </div>
            </div>
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
        <div className={isVisible ? 'animate-scale' : 'opacity-0'}>
          <Award className="w-16 h-16 md:w-24 md:h-24 text-white mx-auto mb-6 md:mb-8 opacity-90" />
          <h2 className="text-3xl md:text-6xl font-black mb-6 md:mb-8">{cta.title || 'Join the Hawk Legacy'}</h2>
          <p className="text-lg md:text-2xl mb-8 md:mb-12 max-w-4xl mx-auto opacity-90">
            {cta.text || 'Become part of a legacy that builds confidence, resilience, and lifelong skills. Train with us in Ahmedabad today.'}
          </p>
          <a
            href={cta.buttonLink || '#contact'}
            className="inline-block bg-white text-red-600 px-8 py-4 md:px-12 md:py-6 rounded-xl text-xl md:text-3xl font-bold hover:bg-gray-100 transition"
          >
            {cta.buttonLabel || 'Start Your Journey'}
          </a>
        </div>
      </div>
    </section>
  )
}

// Stat card with count-up animation
function StatCard({ stat, index, isVisible }) {
  const count = useCountUp(stat.number, 2000, isVisible)
  const suffix = stat.number.replace(/[0-9]/g, '') // Extract + or any suffix
  
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-4 md:p-6 text-center border-t-4 border-red-600 ${isVisible ? 'animate-scale' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="text-2xl md:text-4xl font-black text-red-600 mb-1 md:mb-2">
        {count}{suffix}
      </div>
      <div className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</div>
    </div>
  )
}
