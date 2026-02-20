import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react'
import Hero from '../components/Hero'

// Memoized IconWrap component
const IconWrap = memo(({ icon: Icon }) => {
  return (
    <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 hover:bg-red-600/15">
      <Icon className="w-6 h-6 text-red-600" />
    </div>
  )
})

IconWrap.displayName = 'IconWrap'

// Memoized Info component
const Info = memo(({ icon, title, text }) => {
  return (
    <div className="flex gap-4">
      <IconWrap icon={icon} />
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  )
})

Info.displayName = 'Info'

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
  
  // Scroll to form if hash is #form
  useEffect(() => {
    if (window.location.hash === '#form') {
      setTimeout(() => {
        const formElement = document.getElementById('contact-form')
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300) // Wait for page to render
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
    
    // Show success message
    setSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        program: '',
        message: '',
      })
      setSubmitted(false)
    }, 3000)
  }, [formData])

  // Memoize program options to prevent re-computation
  const programOptions = useMemo(() => {
    if (!data?.programs) return []
    
    // Convert programs object to array and then map
    const programsArray = Object.values(data.programs)
    return programsArray.map(p => (
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

  const { schoolInfo, contactPage } = data

  return (
    <div
      className="bg-white"
      style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.5s' }}
    >

      <Hero {...contactPage.hero} />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12">

          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Contact Information
            </h2>

            <div className="space-y-6">

              <Info icon={MapPin} title="Address" text={schoolInfo.address} />
              <Info icon={Phone} title="Phone" text={schoolInfo.phone} />
              <Info icon={Mail} title="Email" text={schoolInfo.email} />

              <div className="flex gap-4">
                <IconWrap icon={Clock} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Operating Hours
                  </h3>
                  {Array.isArray(schoolInfo.hours) 
                    ? schoolInfo.hours.map((h, i) => (
                        <p key={i} className="text-gray-600">{h}</p>
                      ))
                    : Object.values(schoolInfo.hours).map((h, i) => (
                        <p key={i} className="text-gray-600">{h}</p>
                      ))
                  }
                </div>
              </div>

            </div>


            {/* MAP SECTION */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
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
                    className="inline-flex items-center gap-2 text-xs text-red-400 hover:underline transition-colors"
                  >
                    <MapPin size={12} /> View on Google Maps
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div id="contact-form" className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Send a Message
            </h2>

            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600">
                  We'll get back to you shortly.
                </p>
              </div>
            ) : (

              <form onSubmit={handleSubmit} className="space-y-6">

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                />

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                />

                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                />

                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all resize-none"
                />

                <button 
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  Send via WhatsApp <Send className="w-5 h-5" />
                </button>

              </form>
            )}
          </div>

        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-red-600 to-gray-800 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Begin?
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <a 
              href={`tel:${schoolInfo.phone}`} 
              className="bg-white text-red-600 hover:bg-gray-100 px-6 py-3 text-lg font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
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

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  )
}
