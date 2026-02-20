import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const routeNameMap = {
  about: 'About',
  programs: 'Programs',
  schedule: 'Schedule',
  faculty: 'Faculty',
  contact: 'Contact',
  admin: 'Admin'
}

const Breadcrumbs = () => {
  const location = useLocation()
  
  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null
  }
  
  // Generate breadcrumb trail from path
  const pathSegments = location.pathname.split('/').filter(Boolean)
  
  const breadcrumbs = [
    { name: 'Home', path: '/', icon: Home }
  ]
  
  // Build breadcrumb trail
  let currentPath = ''
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`
    breadcrumbs.push({
      name: routeNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      path: currentPath
    })
  })
  
  return (
    <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm md:text-base">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            const Icon = crumb.icon
            
            return (
              <li key={crumb.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" aria-hidden="true" />
                )}
                
                {isLast ? (
                  <span
                    className="text-gray-900 font-medium"
                    aria-current="page"
                  >
                    {Icon && <Icon className="w-4 h-4 inline mr-1" aria-hidden="true" />}
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center"
                  >
                    {Icon && <Icon className="w-4 h-4 inline mr-1" aria-hidden="true" />}
                    {crumb.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

export default Breadcrumbs
