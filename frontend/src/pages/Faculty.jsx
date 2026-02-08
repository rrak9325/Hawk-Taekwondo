import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Star, Users, Heart } from 'lucide-react'
import Hero from '../components/Hero'
import { useSchoolData } from '../hooks/useSchoolData.js'
import { PageLoadingFallback } from '../components/LoadingFallback'

export default function Faculty() {
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

  const { instructors: instructorsData, facultyPage } = data

  // Convert instructors object to array
  const instructors = Object.values(instructorsData || {})

  return (
    <motion.div
      className="bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero 
        {...facultyPage.hero}
        height="h-[70vh]"
        overlayOpacity="bg-black/40"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              Expert Faculty
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our instructors are certified professionals dedicated to your growth and success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {instructors.map((instructor, i) => (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group"
              >
                <div className="md:flex">
                  <div className="md:w-2/5 p-6 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                    {instructor.image ? (
                      <div className="relative">
                        <img
                          src={instructor.image} 
                          alt={instructor.name}
                          className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
                          style={{ objectPosition: 'center top' }}
                          loading={i < 2 ? 'eager' : 'lazy'}
                          decoding="async"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.parentElement.innerHTML = `
                              <div class="w-48 h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                                <div class="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                                  <svg class="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            `
                          }}
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="w-10 h-10 text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:w-3/5 p-6 md:p-8">
                    <div className="mb-4">
                      <h3 className="font-heading text-2xl font-bold text-primary mb-1">
                        {instructor.name}
                      </h3>
                      <p className="text-secondary font-semibold">{instructor.rank}</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {instructor.specialization}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {instructor.experience} experience
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {instructor.bio}
                    </p>
                    
                    <div className="flex gap-2">
                      <a 
                        href="/contact" 
                        className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white text-center py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        Contact Instructor
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
              Why Train With Our Instructors?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-primary mb-2">Certified Experts</h3>
                <p className="text-gray-600">Licensed coaches with proven track records</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-primary mb-2">Personal Attention</h3>
                <p className="text-gray-600">Individualized coaching for every student</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-primary mb-2">Proven Results</h3>
                <p className="text-gray-600">Students who achieve their goals consistently</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}