import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react'
import Hero from '../components/Hero'

export default function Contact() {
  const [data, setData] = useState(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    
    // Try API first, fallback to static file
    const fetchData = async () => {
      try {
        let response
        try {
          response = await fetch('/api/data')
          if (!response.ok) throw new Error('API failed')
        } catch (apiError) {
          console.warn('API failed, trying static file:', apiError)
          response = await fetch('/mockData.json')
        }
        
        if (!response.ok) throw new Error('Failed to load data')
        const json = await response.json()
        
        if (isMounted) {
          setData(json)
          setReady(true)
        }
      } catch (e) {
        if (isMounted) {
          setError(e.message)
        }
      }
    }
    
    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  // Memoize form handlers to prevent unnecessary re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    
    // Create WhatsApp message with form data
    const message = `Hello! I'm interested in joining Hawk Taekwondo.

My details:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Program: ${formData.program}

Message: ${formData.message}`
    
    // URL encode the message
    const encodedMessage = encodeURIComponent(message)
    
    // Redirect to WhatsApp with pre-filled message
    window.open(`https://wa.me/918487829291?text=${encodedMessage}`, '_blank')
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      program: '',
      message: '',
    })
  }, [formData])

  // Memoize program options to prevent re-computation
  const programOptions = useMemo(() => {
    if (!data?.programs) return []
    return data.programs.map(p => (
      <option key={p.id} value={p.name}>{p.name}</option>
    ))
  }, [data?.programs])

  if (error) {
    return (
      <div className="bg-white py-20 text-center text-red-600">
        Failed to load contact data
      </div>
    )
  }

  if (!data || !ready) return null

  const { schoolInfo, programs, contactPage } = data

  return (
    <motion.div
      className="bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >

      <Hero {...contactPage.hero} />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl font-bold text-primary mb-8">
              Contact Information
            </h2>

            <div className="space-y-6">

              <Info icon={MapPin} title="Address" text={schoolInfo.address} />
              <Info icon={Phone} title="Phone" text={schoolInfo.phone} />
              <Info icon={Mail} title="Email" text={schoolInfo.email} />

              <div className="flex gap-4">
                <IconWrap icon={Clock} />
                <div>
                  <h3 className="font-semibold text-primary mb-1">
                    Operating Hours
                  </h3>
                  {schoolInfo.hours.map((h, i) => (
                    <p key={i} className="text-gray-600">{h}</p>
                  ))}
                </div>
              </div>

            </div>


            {/* MAP SECTION */}
            <div className="mt-10">
              <h3 className="font-heading text-xl font-semibold text-primary mb-4">
                Visit Our Dojang
              </h3>

              <div className="w-full overflow-hidden rounded-2xl border border-gray-200 shadow-lg bg-gray-900">
                {/* Embedded Google Map */}
                <div className="w-full h-[300px] relative">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.484210083073!2d72.5515258758652!3d23.004118516315257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e851bc7092e07%3A0x21ae1c75bac35a33!2sHawk%20Taekwondo%20Training%20Centre!5e0!3m2!1sen!2sin!4v1738435123456!5m2!1sen!2sin" 
                    className="w-full h-full border-0" 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Hawk Taekwondo Location"
                    onError={(e) => {
                      console.log('Map failed to load, showing fallback')
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div class="text-center p-8">
                            <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                            </svg>
                            <p class="text-gray-600 font-medium">Map temporarily unavailable</p>
                            <p class="text-gray-500 text-sm mt-2">Please use the address below</p>
                          </div>
                        </div>
                      `
                    }}
                  ></iframe>
                </div>
                
                {/* Address Bar below Map */}
                <div className="p-5 bg-[#252525] text-white">
                  <p className="font-bold text-gray-100 mb-1">Hawk Taekwondo Training Centre</p>
                  <p className="text-gray-300 text-sm mb-2">{schoolInfo.address}</p>
                  <a 
                    href={schoolInfo.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-secondary hover:underline transition-colors"
                  >
                    <MapPin size={12} /> View on Google Maps
                  </a>
                </div>
              </div>
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <h2 className="font-heading text-3xl font-bold text-primary mb-6">
              Send a Message
            </h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: .9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600">
                  We’ll get back to you shortly.
                </p>
              </motion.div>
            ) : (

              <form onSubmit={handleSubmit} className="space-y-6">

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="input-field"
                />

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="input-field"
                />

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="input-field"
                />

                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Program</option>
                  {programOptions}
                </select>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Your message..."
                  className="input-field resize-none"
                />

                <button 
                  type="submit"
                  className="btn-primary w-full flex justify-center gap-2 hover:scale-105 transition-transform"
                >
                  Send via WhatsApp <Send className="w-5 h-5" />
                </button>

              </form>
            )}
          </motion.div>

        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary to-gray-800 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Ready to Begin?
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <a 
              href={`tel:${schoolInfo.phone}`} 
              className="bg-white text-primary hover:bg-gray-100 px-6 py-3 text-lg font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
            
            <a 
              href={`https://wa.me/918487829291?text=Hello! I'm interested in joining, Please share more details.`} 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 px-6 py-3 text-lg font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

    </motion.div>
  )
}

const IconWrap = memo(({ icon: Icon }) => {
  return (
    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
      <Icon className="w-6 h-6 text-secondary" />
    </div>
  )
})

const Info = memo(({ icon, title, text }) => {
  return (
    <div className="flex gap-4">
      <IconWrap icon={icon} />
      <div>
        <h3 className="font-semibold text-primary mb-1">{title}</h3>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  )
})
