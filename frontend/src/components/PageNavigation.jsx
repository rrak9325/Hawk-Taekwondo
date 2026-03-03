import { Link, useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const PAGE_SEQUENCE = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/programs', label: 'Programs' },
  { path: '/faculty', label: 'Faculty' },
  { path: '/schedule', label: 'Schedule' },
  { path: '/contact', label: 'Contact' }
]

export default function PageNavigation() {
  const location = useLocation()
  
  // Find current page index
  const currentIndex = PAGE_SEQUENCE.findIndex(page => page.path === location.pathname)
  
  // Get next page - loop back to home if at the end
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % PAGE_SEQUENCE.length
  const nextPage = PAGE_SEQUENCE[nextIndex]
  
  return (
    <section className="bg-gradient-to-r from-primary to-primary/90 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm md:text-base mb-2">Explore More</p>
            <h3 className="text-white text-2xl md:text-3xl font-bold">
              Continue to <span className="text-secondary">{nextPage.label}</span>
            </h3>
          </div>
          
          <Link
            to={nextPage.path}
            className="group flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transition-all hover:gap-3 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <span className="hidden sm:inline">Next Page</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
