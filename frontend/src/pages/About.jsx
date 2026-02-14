import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Shield, Award, Heart, Target, Users, TrendingUp } from 'lucide-react'
import { useSchoolData } from '../hooks/useSchoolData.js'
import { PageLoadingFallback } from '../components/LoadingFallback'

export default function About() {
  const { data, loading, error } = useSchoolData()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (data) {
      setTimeout(() => setReady(true), 250)
    }
  }, [data])

  if (loading) return <PageLoadingFallback />

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
          <p className="text-xl text-red-600 mb-6">Failed to load content: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { schoolInfo, instructors: instructorsData, about } = data
  const instructors = Object.values(instructorsData || {}).filter(inst => inst && inst.name)

  // Ensure Yajuvendrasinh Rathod appears first if present
  const sortedInstructors = [...instructors].sort((a, b) =>
    a.name?.includes('Yajuvendrasinh') ? -1 : b.name?.includes('Yajuvendrasinh') ? 1 : 0
  )

  const { values, stats, cta } = about
  const safeStats = (Array.isArray(stats) ? stats : Object.values(stats || {})).filter(s => s && s.number && s.label)
  const safeValues = (Array.isArray(values) ? values : Object.values(values || {})).filter(v => v && v.icon && v.title)

  return (
    <motion.div
      className="bg-white text-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Hero – Full width legacy statement */}
      <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/80 to-white z-10" />

        {/* Hero media – full bleed */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {about?.hero?.videoUrl ? (
            <video
              src={about.hero.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
            />
          ) : about?.hero?.backgroundImage ? (
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${about.hero.backgroundImage})`
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
        </div>

        <div className="relative z-20 container mx-auto px-6 text-center">
          <motion.h1
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-red-600 mb-8"
          >
            Hawk Taekwondo Training Centre
          </motion.h1>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
              Founded by Master Late Vijaysinh Rathod
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              A legacy of excellence, discipline, and character development in Ahmedabad. Shaping champions and confident individuals for four decades.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tribute to Founder */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Large media left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl border-8 border-red-100 bg-gray-100"
            />

            {/* Text right */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-red-600 mb-8">
                In Honor of Master Late Vijaysinh Rathod
              </h2>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                In 1985, Master Late Vijaysinh Rathod founded Hawk Taekwondo Training Centre in Ahmedabad with a clear vision: to build not just fighters, but individuals of strong character, discipline, and resilience.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                His dedication produced countless black belt holders and state & national champions. His legacy continues to inspire every student who walks through our doors.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-20 md:mb-28 text-red-600">
            Our Journey
          </h2>

          <div className="relative max-w-6xl mx-auto">
            {/* Timeline vertical line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gray-200" />

            {/* Founding */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-24 md:mb-32 relative"
            >
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <div className="md:text-right md:pr-12 order-2 md:order-1">
                  <div
                    className="
                      inline-flex items-center justify-center
                      bg-red-600 text-white
                      text-2xl sm:text-3xl md:text-3xl font-black
                      px-5 py-3 sm:px-6 sm:py-4 md:px-7 md:py-5
                      rounded-full
                      border-8 border-white
                      shadow-xl
                      mb-6 md:mb-0
                      mx-auto md:mx-0
                      min-w-[4.8rem] sm:min-w-[5.5rem] md:min-w-[7rem]
                    "
                  >
                    1985
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
                    The Foundation
                  </h3>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    Established in Ahmedabad by Master Late Vijaysinh Rathod as a premier martial arts academy focused on discipline, physical fitness, mental strength, and character building.
                  </p>
                </div>

                <div className="order-1 md:order-2">
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-8 border-red-50 bg-gray-100" />
                </div>
              </div>
            </motion.div>

            {/* Growth & Championships */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-24 md:mb-32 relative"
            >
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <div>
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-8 border-red-50 bg-gray-100" />
                </div>

                <div className="md:pl-12">
                  <div
                    className="
                      inline-flex items-center justify-center
                      bg-red-600 text-white
                      text-2xl sm:text-3xl md:text-3xl font-black
                      px-5 py-3 sm:px-6 sm:py-4 md:px-7 md:py-5
                      rounded-full
                      border-8 border-white
                      shadow-xl
                      mb-6 md:mb-0
                      mx-auto md:mx-0
                      min-w-[4.8rem] sm:min-w-[5.5rem] md:min-w-[7rem]
                    "
                  >
                    Growth
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
                    Producing Champions
                  </h3>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    Over four decades, Hawk Taekwondo has trained numerous black belt holders and produced state and national-level champions — a testament to our commitment to excellence.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Current Era */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-24 md:mb-32 relative"
            >
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <div className="md:text-right md:pr-12 order-2 md:order-1">
                  <div
                    className="
                      inline-flex items-center justify-center
                      bg-red-600 text-white
                      text-2xl sm:text-3xl md:text-3xl font-black
                      px-5 py-3 sm:px-6 sm:py-4 md:px-7 md:py-5
                      rounded-full
                      border-8 border-white
                      shadow-xl
                      mb-6 md:mb-0
                      mx-auto md:mx-0
                      min-w-[4.8rem] sm:min-w-[5.5rem] md:min-w-[7rem]
                    "
                  >
                    Today
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
                    Master Yajuvendrasinh Rathod
                  </h3>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
                    Son of the founder and current lead instructor, Master Yajuvendrasinh Rathod carries forward the legacy with passion, modern training methods, and the same dedication to building strong individuals.
                  </p>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    Offering expert coaching in Taekwondo, Kickboxing, Muay Thai, and Self Defence for children, teenagers, and adults of all levels.
                  </p>
                </div>

                <div className="order-1 md:order-2">
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-8 border-red-50 bg-gray-100" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10"
            >
              {safeStats.map((s, i) => (
                <div
                  key={i}
                  className="bg-white shadow-lg rounded-2xl p-8 md:p-10 text-center border-t-4 border-red-600"
                >
                  <div className="text-4xl md:text-6xl font-black text-red-600 mb-3">
                    {s.number}
                  </div>
                  <div className="text-lg md:text-xl text-gray-600 font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 md:mb-20 text-red-600">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {safeValues.map((v, i) => {
              const iconMap = { Shield, Award, Heart, Target, Users, TrendingUp }
              const Icon = iconMap[v.icon] || Shield
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-8 md:p-10 text-center shadow-md hover:shadow-xl hover:border-red-200 transition-all duration-300 border border-gray-100"
                >
                  <Icon className="w-14 h-14 md:w-16 md:h-16 text-red-600 mx-auto mb-6" />
                  <h3 className="text-xl md:text-2xl font-bold mb-4">{v.title}</h3>
                  <p className="text-gray-600 text-base md:text-lg">{v.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 md:mb-20 text-red-600">
            Our Instructors
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {sortedInstructors.map((inst, i) => (
              <motion.div
                key={inst.id || i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-red-600"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {/* ← Instructor photo – square format → */}
                  {inst.image ? (
                    <img
                      src={inst.image}
                      alt={inst.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-8xl font-black text-red-200">
                      {inst?.name?.charAt(0) || 'I'}
                    </span>
                  )}
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{inst.name}</h3>
                  <p className="text-red-600 font-semibold text-lg md:text-xl mb-4">{inst.rank}</p>
                  <p className="text-gray-600 text-base md:text-lg">
                    {inst.specialization || inst.bio || 'Expert Taekwondo & Martial Arts Instructor'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Award className="w-20 h-20 md:w-24 md:h-24 text-white mx-auto mb-8 opacity-90" />
            <h2 className="text-4xl md:text-6xl font-black mb-8">{cta.title || 'Join the Hawk Legacy'}</h2>
            <p className="text-xl md:text-2xl mb-10 md:mb-12 max-w-4xl mx-auto opacity-90">
              {cta.text ||
                'Become part of a legacy that builds confidence, resilience, and lifelong skills. Train with us in Ahmedabad today.'}
            </p>
            <a
              href={cta.buttonLink || '#contact'}
              className="inline-block bg-white text-red-600 px-12 py-6 rounded-xl text-2xl md:text-3xl font-bold hover:bg-gray-100 transition transform hover:scale-105"
            >
              {cta.buttonLabel || 'Start Your Journey'}
            </a>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}