import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Target, Users, Award, Star, Check } from 'lucide-react'
import Hero from '../components/Hero'
import { useSchoolData } from '../hooks/useSchoolData.js'
import { PageLoadingFallback } from '../components/LoadingFallback'

export default function Programs() {
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

  const { programs, programsPage } = data

  const icons = [Shield, Target, Users, Award]

  return (
    <motion.div
      className="bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero {...programsPage.hero} />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Martial Arts Programs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the perfect discipline to elevate your fitness, confidence, and self-defense skills
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, i) => {
              const Icon = icons[i % icons.length]
              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {program.image ? (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={program.image} 
                        alt={program.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                      {program.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {program.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      {program.benefits.slice(0, 3).map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <a 
                      href="/contact" 
                      className="block w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white text-center py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                    >
                      Enroll Now
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
              Why Choose Our Programs?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-primary mb-2">Expert Instructors</h3>
                <p className="text-gray-600">Certified masters with real-world experience</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-primary mb-2">Proven Results</h3>
                <p className="text-gray-600">Transform your body and mind with our methods</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-primary mb-2">Community</h3>
                <p className="text-gray-600">Join a supportive family of martial artists</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}