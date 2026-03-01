import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, MapPin, Phone, Mail, Facebook, Instagram, MessageCircle } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [schoolInfo, setSchoolInfo] = useState({
    address: '',
    phone: '',
    email: '',
    mapLink: '',
    hours: []
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response
        try {
          response = await fetch(`/api/data?t=${Date.now()}`)
          if (!response.ok) throw new Error('API failed')
        } catch (apiError) {
          console.warn('API failed, trying static file:', apiError)
          response = await fetch(`/mockData.json?t=${Date.now()}`)
        }
        
        const json = await response.json()
        setSchoolInfo(json.schoolInfo)
      } catch (err) {
        console.error('Error loading school info:', err)
      }
    }
    
    fetchData()
  }, [])

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="https://res.cloudinary.com/dem7arres/image/upload/v1771086460/2nd_logo_krdaqk.jpg" 
                className="w-12 h-12 rounded-full object-cover"
                alt="Hawk Taekwondo Logo" 
                loading="lazy"
              />
              <span className="font-heading text-xl font-bold">Hawk Taekwondo</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Building character, discipline, and confidence through the art of Taekwondo. Join our community today.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-secondary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-secondary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-gray-300 hover:text-secondary transition-colors text-sm">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-gray-300 hover:text-secondary transition-colors text-sm">
                  Schedule
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-secondary transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href={schoolInfo.mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-start space-x-2 text-sm group"
                >
                  <MapPin className="w-4 h-4 text-secondary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-300 group-hover:text-secondary transition-colors">
                    {schoolInfo.address || 'Loading...'}
                  </span>
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href={`tel:${schoolInfo.phone}`} className="text-gray-300 hover:text-secondary transition-colors">
                  {schoolInfo.phone || '(555) 123-4567'}
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href={`mailto:${schoolInfo.email}`} className="text-gray-300 hover:text-secondary transition-colors">
                  {schoolInfo.email || 'info@hawktkd.com'}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=100065009922743"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="instagram://user?username=hawktaekwondo"
                onClick={(e) => {
                  // Check if on desktop/browser (not mobile app)
                  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                  
                  if (!isMobile) {
                    
                    e.preventDefault();
                    window.open('https://www.instagram.com/hawktaekwondo/', '_blank');
                  }
                  // Mobile: let the instagram:// protocol handle it
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://wa.me/919898222359?text=Hello!%20I'm%20interested%20in%20joining%20your%20school.%20Please%20share%20more%20details."
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.158 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.892-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
              </a>
            </div>
            <div className="mt-6">
              <h4 className="font-medium text-sm mb-2">Operating Hours</h4>
              {Array.isArray(schoolInfo.hours) && schoolInfo.hours.length > 0 ? (
                schoolInfo.hours.map((hour, index) => (
                  <p key={index} className="text-gray-300 text-xs">{hour}</p>
                ))
              ) : (//     Sun: Closed
                <>
                  <p className="text-gray-300 text-xs">Mon - Fri: 5:00 PM - 7:00 PM</p>
                  <p className="text-gray-300 text-xs">Sat: 5:00 PM - 7:00 PM</p>
                  <p className="text-gray-300 text-xs">Sun: Closed</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Hawk Taekwondo • Building Champions, One Kick at a Time 🥋
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer