import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import Hero from '../components/Hero'
import CapturedMomentsGallery from '../components/CapturedMomentsGallery'
import Testimonials from '../components/Testimonials'
import { useSchoolData } from '../hooks/useSchoolData.js'
import { PageLoadingFallback } from '../components/LoadingFallback'

export default function Home() {
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

  const { schoolInfo, programs: programsData, home, gallery } = data
  const { hero, features } = home
  const safeFeatures = features ? Object.values(features) : []
  const safePrograms = programsData ? Object.values(programsData) : []

  return (
    <motion.div
      className="bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero
        {...hero}
        height="h-[92vh]"
        overlayOpacity="bg-black/1"
      />

      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
          >
            <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-primary mb-4">
              Why Choose <span className="text-secondary">Hawk Taekwondo?</span>
            </h2>
            <p className="text-gray-600 text-base lg:text-lg">
              We provide a safe, supportive, and professional environment where students of all ages can excel in martial arts and character development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {safeFeatures.map((f, i) => {
              const Icon = Icons[f.icon] || Icons.Shield
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="card text-center hover:shadow-2xl transition-all duration-300 border-b-4 border-transparent hover:border-secondary p-6"
                >
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 transform group-hover:rotate-12 transition-transform">
                    <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-secondary" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold mb-2 lg:mb-3 text-primary">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/*  */}

      {/* Revolutionary Gallery Section */}
      <CapturedMomentsGallery gallery={gallery} />

      {/* Programs Preview Section */}


      <section className="py-12 lg:py-16 xl:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-primary mb-4">
              Our <span className="text-secondary">Programs</span>
            </h2>
            <p className="text-gray-600 text-base lg:text-lg">
              Discover the perfect program for your martial arts journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {safePrograms.slice(0, 3).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="card"
              >
                {p.image && (
                  <div className="aspect-video rounded-xl overflow-hidden mb-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                <h3 className="font-heading text-lg lg:text-xl font-bold mb-3">
                  {p.name}
                </h3>

                <p className="text-gray-600 mb-4 text-sm">
                  {p.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {(Array.isArray(p.benefits) ? p.benefits : Object.values(p.benefits)).slice(0, 3).map((b, idx) => (
                    <li key={idx} className="flex gap-2 text-sm">
                      <Icons.CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/programs" className="btn-outline w-full text-center">
                  Learn More
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials testimonials={data.testimonials || []} />

      {/* Call to Action Section */}
      <section className="py-12 lg:py-16 xl:py-20 bg-gradient-to-br from-primary to-primary-light text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4"
        >
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/90 text-base lg:text-lg mb-6 lg:mb-8 max-w-2xl mx-auto">
            Join {schoolInfo.name} and discover the transformative power of martial arts.
            Build confidence, discipline, and strength in a supportive community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/contact" className="btn-secondary px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold w-full sm:w-auto">
              Book A Free Trial
            </Link>
          </div>
        </motion.div>
      </section>


    </motion.div>
  )
}