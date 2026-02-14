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
    <div className="bg-white text-gray-900" style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.3s' }}>
      {/* Hero */}
      <HeroSection about={about} />
      
      {/* Tribute */}
      <TributeSection />
      
      {/* Timeline */}
      <TimelineSection safeStats={safeStats} />
      
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
  return (
    <section className="relative min-h-[70vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/80 to-white z-10" />

      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {about?.hero?.videoUrl ? (
          <video
            src={about.hero.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
            style={{ willChange: 'auto' }}
          />
        ) : about?.hero?.backgroundImage ? (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `https://res.cloudinary.com/dem7arres/image/upload/v1771093457/vijay-nana2_axwbqh.jpg` }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>

      <div className="relative z-20 container mx-auto px-4 md:px-6 text-center">
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-red-600 mb-6 md:mb-8 animate-in">
          Hawk Taekwondo Training Centre
        </h1>

        <div className="max-w-4xl mx-auto animate-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <p className="text-xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-6">
            Founded by Master Late Vijaysinh Rathod
          </p>
          <p className="text-base md:text-xl text-gray-700 leading-relaxed">
            A legacy of excellence, discipline, and character development in Ahmedabad. Shaping champions and confident individuals for four decades.
          </p>
        </div>
      </div>
    </section>
  )
}

function TributeSection() {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section ref={ref} className="py-16 md:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className={`rounded-2xl overflow-hidden shadow-2xl border-4 md:border-8 border-red-100 bg-gray-100 ${isVisible ? 'animate-in-left' : 'opacity-0'}`}>
            <img 
              src="https://res.cloudinary.com/dem7arres/image/upload/v1771093457/vijay-nana2_axwbqh.jpg"
              alt="Master Late Vijaysinh Rathod"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>

          <div className={isVisible ? 'animate-in-right' : 'opacity-0'} style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl md:text-5xl font-black text-red-600 mb-6 md:mb-8">
              In Honor of Master Late Vijaysinh Rathod
            </h2>
            <p className="text-base md:text-xl text-gray-700 leading-relaxed mb-4 md:mb-6">
              In 1985, Master Late Vijaysinh Rathod founded Hawk Taekwondo Training Centre in Ahmedabad with a clear vision: to build not just fighters, but individuals of strong character, discipline, and resilience.
            </p>
            <p className="text-base md:text-xl text-gray-700 leading-relaxed">
              His dedication produced countless black belt holders and state & national champions. His legacy continues to inspire every student who walks through our doors.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineSection({ safeStats }) {
  const [ref1, isVisible1] = useScrollAnimation()
  const [ref2, isVisible2] = useScrollAnimation()
  const [ref3, isVisible3] = useScrollAnimation()
  const [ref4, isVisible4] = useScrollAnimation()
  
  return (
    <section className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-black text-center mb-12 md:mb-28 text-red-600">
          Our Journey
        </h2>

        <div className="relative max-w-6xl mx-auto space-y-16 md:space-y-32">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200" />

          {/* 1985 */}
          <div ref={ref1} className="relative">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className={`md:text-right md:pr-12 order-2 md:order-1 ${isVisible1 ? 'animate-in-left' : 'opacity-0'}`}>
                <div className="inline-flex items-center justify-center bg-red-600 text-white text-xl sm:text-2xl md:text-3xl font-black px-6 py-3 md:px-7 md:py-5 rounded-full border-4 md:border-8 border-white shadow-xl mb-4 md:mb-6">
                  1985
                </div>
                <h3 className="text-2xl md:text-4xl font-bold text-red-600 mb-3 md:mb-4">
                  The Foundation
                </h3>
                <p className="text-base md:text-xl text-gray-700 leading-relaxed">
                  Established in Ahmedabad by Master Late Vijaysinh Rathod as a premier martial arts academy focused on discipline, physical fitness, mental strength, and character building.
                </p>
              </div>

              <div className={`order-1 md:order-2 ${isVisible1 ? 'animate-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 md:border-8 border-red-50 bg-gray-100" />
              </div>
            </div>
          </div>

          {/* Growth */}
          <div ref={ref2} className="relative">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className={`order-1 ${isVisible2 ? 'animate-in-left' : 'opacity-0'}`}>
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 md:border-8 border-red-50 bg-gray-100" />
              </div>

              <div className={`md:pl-12 order-2 ${isVisible2 ? 'animate-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                <div className="inline-flex items-center justify-center bg-red-600 text-white text-xl sm:text-2xl md:text-3xl font-black px-6 py-3 md:px-7 md:py-5 rounded-full border-4 md:border-8 border-white shadow-xl mb-4 md:mb-6">
                  Growth
                </div>
                <h3 className="text-2xl md:text-4xl font-bold text-red-600 mb-3 md:mb-4">
                  Producing Champions
                </h3>
                <p className="text-base md:text-xl text-gray-700 leading-relaxed">
                  Over four decades, Hawk Taekwondo has trained numerous black belt holders and produced state and national-level champions — a testament to our commitment to excellence.
                </p>
              </div>
            </div>
          </div>

          {/* Today */}
          <div ref={ref3} className="relative">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className={`md:text-right md:pr-12 order-2 md:order-1 ${isVisible3 ? 'animate-in-left' : 'opacity-0'}`}>
                <div className="inline-flex items-center justify-center bg-red-600 text-white text-xl sm:text-2xl md:text-3xl font-black px-6 py-3 md:px-7 md:py-5 rounded-full border-4 md:border-8 border-white shadow-xl mb-4 md:mb-6">
                  Today
                </div>
                <h3 className="text-2xl md:text-4xl font-bold text-red-600 mb-3 md:mb-4">
                  Master Yajuvendrasinh Rathod
                </h3>
                <p className="text-base md:text-xl text-gray-700 leading-relaxed mb-3 md:mb-4">
                  Son of the founder and current lead instructor, Master Yajuvendrasinh Rathod carries forward the legacy with passion, modern training methods, and the same dedication to building strong individuals.
                </p>
                <p className="text-base md:text-xl text-gray-700 leading-relaxed">
                  Offering expert coaching in Taekwondo, Kickboxing, Muay Thai, and Self Defence for children, teenagers, and adults of all levels.
                </p>
              </div>

              <div className={`order-1 md:order-2 ${isVisible3 ? 'animate-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 md:border-8 border-red-50 bg-gray-100" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div ref={ref4} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 pt-8">
            {safeStats.map((s, i) => (
              <StatCard key={i} stat={s} index={i} isVisible={isVisible4} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ValuesSection({ safeValues }) {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section ref={ref} className="py-16 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-black text-center mb-12 md:mb-20 text-red-600">
          Our Core Values
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {safeValues.map((v, i) => {
            const iconMap = { Shield, Award, Heart, Target, Users, TrendingUp }
            const Icon = iconMap[v.icon] || Shield
            return (
              <div
                key={i}
                className={`bg-white rounded-xl md:rounded-2xl p-6 md:p-10 text-center shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 ${isVisible ? 'animate-in' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Icon className="w-12 h-12 md:w-16 md:h-16 text-red-600 mx-auto mb-4 md:mb-6" />
                <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">{v.title}</h3>
                <p className="text-gray-600 text-sm md:text-lg">{v.description}</p>
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
    <section ref={ref} className="py-16 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-black text-center mb-12 md:mb-20 text-red-600">
          Our Instructors
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {sortedInstructors.map((inst, i) => (
            <div
              key={inst.id || i}
              className={`bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden border-t-4 border-red-600 ${isVisible ? 'animate-scale' : 'opacity-0'}`}
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
                  <span className="text-6xl md:text-8xl font-black text-red-200">
                    {inst?.name?.charAt(0) || 'I'}
                  </span>
                )}
              </div>
              <div className="p-6 md:p-8 text-center">
                <h3 className="text-xl md:text-3xl font-bold mb-2">{inst.name}</h3>
                <p className="text-red-600 font-semibold text-base md:text-xl mb-3 md:mb-4">{inst.rank}</p>
                <p className="text-gray-600 text-sm md:text-lg">
                  {inst.specialization || inst.bio || 'Expert Taekwondo & Martial Arts Instructor'}
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
      className={`bg-white shadow-lg rounded-xl md:rounded-2xl p-4 md:p-10 text-center border-t-4 border-red-600 ${isVisible ? 'animate-scale' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="text-3xl md:text-6xl font-black text-red-600 mb-2 md:mb-3">
        {count}{suffix}
      </div>
      <div className="text-sm md:text-xl text-gray-600 font-medium">{stat.label}</div>
    </div>
  )
}
