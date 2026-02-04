import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import Hero from '../components/Hero'
import { useSchoolData } from '../hooks/useSchoolData.js'
import { PageLoadingFallback } from '../components/LoadingFallback'

export default function About() {
  const { data, loading, error } = useSchoolData()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (data) {
      setTimeout(() => setReady(true), 150)
    }
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

  const { schoolInfo, instructors, about } = data
  const { values, stats, cta, hero } = about

  return (
    <motion.div
      className="bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >

      <Hero {...hero} />

      {/* Our Story & Stats */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl font-bold text-primary mb-6">
              Our Story
            </h2>
            <p className="text-gray-600 mb-4">
              Founded in {schoolInfo.founded}, {schoolInfo.name} has been dedicated to training students in the art of Taekwondo for over a decade.
            </p>
            <p className="text-gray-600 mb-4">
              {schoolInfo.mission}
            </p>
            <p className="text-gray-600">
              Led by Master {instructors[0]?.name}, we blend traditional Korean martial arts with modern training techniques to help every student reach their full potential.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card text-center"
              >
                <div className="text-4xl font-bold text-secondary">{s.number}</div>
                <div className="text-gray-600">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">
              Our Core Values
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => {
              const Icon = Icons[v.icon] || Icons.Shield
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card text-center"
                >
                  <Icon className="w-8 h-8 text-secondary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{v.title}</h3>
                  <p className="text-gray-600 text-sm">{v.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Meet Our Instructors */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">
              Meet Our Instructors
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((inst, i) => (
              <motion.div
                key={inst.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card text-center"
              >
                <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden bg-secondary/20 flex items-center justify-center">
                  {inst.image && (
                    <img
                      src={inst.image}
                      alt={inst.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextSibling.style.display = 'flex'
                      }}
                    />
                  )}
                  <span className="hidden w-full h-full items-center justify-center text-4xl font-bold text-secondary">
                    {inst.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-bold">{inst.name}</h3>
                <p className="text-secondary">{inst.rank}</p>
                <p className="text-gray-600 text-sm">{inst.specialization || inst.bio}</p>
                <div className="flex justify-center gap-2 text-sm text-gray-500 mt-2">
                  <Icons.Trophy className="w-4 h-4" />
                  {inst.experience || '10+'} years
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-light text-white text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Icons.Award className="w-14 h-14 mx-auto mb-6 text-secondary" />
            <h2 className="font-heading text-3xl font-bold mb-6">
              {cta.title}
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              {cta.text}
            </p>
            <a href={cta.buttonLink} className="btn-secondary px-8 py-4 text-lg font-semibold">
              {cta.buttonLabel}
            </a>
          </motion.div>
        </div>
      </section>

    </motion.div>
  )
}