import { useEffect, useState, useMemo, useCallback, memo } from 'react'
import { Clock, Users, Calendar, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import Hero from '../components/Hero'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Memoized Filter Button
const FilterBtn = memo(({ active, onClick, label, color = 'gray', icon: Icon }) => {
  const colors = {
    gray: active 
      ? 'bg-gray-900 text-white shadow-lg scale-105' 
      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200',
    purple: active 
      ? 'bg-purple-600 text-white shadow-lg scale-105' 
      : 'bg-white text-purple-600 hover:bg-purple-50 border-2 border-purple-200',
    blue: active 
      ? 'bg-blue-600 text-white shadow-lg scale-105' 
      : 'bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-200'
  }

  return (
    <button 
      onClick={onClick} 
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-400 ${colors[color]}`}
      style={{ transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {Icon && <Icon size={18} />}
      {label}
    </button>
  )
})

FilterBtn.displayName = 'FilterBtn'

// Memoized Mobile Day Card
const MobileDayCard = memo(({ dayData }) => {
  if (!dayData) return null
  const { day, classes, isToday } = dayData

  return (
    <div className={`mobile-day-card ${isToday ? 'today' : ''}`}>
      <div className={`day-header ${isToday ? 'today' : ''}`}>
        <h2 className="day-title">{day}</h2>
        {isToday && (
          <span className="today-badge">
            Today
          </span>
        )}
      </div>

      <div className="classes-container">
        {classes.length > 0 ? (
          classes.map((cls, i) => (
            <MobileClassCard key={i} cls={cls} index={i} />
          ))
        ) : (
          <div className="no-classes">
            <Calendar size={48} className="no-classes-icon" />
            <p className="no-classes-text">No classes scheduled</p>
          </div>
        )}
      </div>
      
      <style>{`
        .mobile-day-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          opacity: 0;
          animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .mobile-day-card.today {
          ring: 4px;
          ring-color: #dc2626;
        }
        
        .day-header {
          padding: 1.5rem;
          text-align: center;
          background: #111827;
          color: white;
        }
        
        .day-header.today {
          background: linear-gradient(to right, #dc2626, #b91c1c);
        }
        
        .day-title {
          font-size: 1.875rem;
          font-weight: 900;
          margin-bottom: 0.25rem;
        }
        
        .today-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .classes-container {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 300px;
        }
        
        .no-classes {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-center;
          color: #9ca3af;
          padding: 3rem 0;
        }
        
        .no-classes-icon {
          margin-bottom: 0.75rem;
          opacity: 0.5;
        }
        
        .no-classes-text {
          font-size: 1.125rem;
          font-weight: 500;
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
})

MobileDayCard.displayName = 'MobileDayCard'

// Memoized Mobile Class Card
const MobileClassCard = memo(({ cls, index }) => {
  const isAdult = cls.type?.toLowerCase().includes('adult')
  const colors = isAdult
    ? { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-600' }
    : { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-600' }

  return (
    <div
      className={`mobile-class-card ${colors.bg} ${colors.border}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="class-header">
        <div className="class-time-wrapper">
          <div className={`class-icon ${colors.badge}`}>
            <Clock size={20} className="icon" />
          </div>
          <div>
            <p className="class-time">{cls.time}</p>
            <p className={`class-age ${colors.text}`}>{cls.ageGroup}</p>
          </div>
        </div>
        <span className={`class-badge ${colors.badge}`}>
          {isAdult ? 'Adults' : 'Kids'}
        </span>
      </div>
      
      <style>{`
        .mobile-class-card {
          border: 2px solid;
          border-radius: 12px;
          padding: 1.25rem;
          transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .mobile-class-card:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .class-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        
        .class-time-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .class-icon {
          padding: 0.5rem;
          border-radius: 8px;
        }
        
        .icon {
          color: white;
        }
        
        .class-time {
          font-size: 1.5rem;
          font-weight: 900;
          color: #111827;
        }
        
        .class-age {
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .class-badge {
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        
        @keyframes fadeInUp {
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
})

MobileClassCard.displayName = 'MobileClassCard'

// Memoized Desktop Day Card
const DesktopDayCard = memo(({ dayData }) => {
  const { day, classes, isToday } = dayData

  return (
    <div className={`desktop-day-card ${isToday ? 'today' : ''}`}>
      <div className={`desktop-day-header ${isToday ? 'today' : ''}`}>
        <h3 className="desktop-day-title">{day.substring(0, 3)}</h3>
        {isToday && (
          <span className="desktop-today-badge">
            Today
          </span>
        )}
      </div>

      <div className="desktop-classes-container">
        {classes.length > 0 ? (
          classes.map((cls, i) => (
            <DesktopClassCard key={i} cls={cls} index={i} />
          ))
        ) : (
          <div className="desktop-no-classes">
            <Calendar size={32} className="desktop-no-classes-icon" />
            <p className="desktop-no-classes-text">Rest Day</p>
          </div>
        )}
      </div>
      
      <style>{`
        .desktop-day-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          border: 2px solid #e5e7eb;
          transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .desktop-day-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
        }
        
        .desktop-day-card.today {
          border-color: #dc2626;
          ring: 2px;
          ring-color: rgba(220, 38, 38, 0.2);
        }
        
        .desktop-day-header {
          padding: 1rem;
          text-align: center;
          border-bottom: 2px solid #e5e7eb;
          background: #f9fafb;
          color: #111827;
        }
        
        .desktop-day-header.today {
          background: #dc2626;
          color: white;
          border-bottom-color: #b91c1c;
        }
        
        .desktop-day-title {
          font-size: 1.125rem;
          font-weight: 900;
        }
        
        .desktop-today-badge {
          display: inline-block;
          margin-top: 0.25rem;
          padding: 0.125rem 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        
        .desktop-classes-container {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-height: 400px;
        }
        
        .desktop-no-classes {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          padding: 2rem 0;
        }
        
        .desktop-no-classes-icon {
          margin-bottom: 0.5rem;
          opacity: 0.5;
        }
        
        .desktop-no-classes-text {
          font-size: 0.75rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  )
})

DesktopDayCard.displayName = 'DesktopDayCard'

// Memoized Desktop Class Card
const DesktopClassCard = memo(({ cls, index }) => {
  const isAdult = cls.type?.toLowerCase().includes('adult')
  const colors = isAdult
    ? { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-600' }
    : { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-600' }

  return (
    <div
      className={`desktop-class-card ${colors.bg}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="desktop-class-time">
        <Clock size={14} className={colors.text} />
        <p className="desktop-time-text">{cls.time}</p>
      </div>
      <p className="desktop-age-text">{cls.ageGroup}</p>
      <span className={`desktop-class-badge ${colors.badge}`}>
        {isAdult ? 'Adults' : 'Kids'}
      </span>
      
      <style>{`
        .desktop-class-card {
          border-radius: 8px;
          padding: 0.75rem;
          transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .desktop-class-card:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .desktop-class-time {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .desktop-time-text {
          font-size: 0.875rem;
          font-weight: 700;
          color: #111827;
        }
        
        .desktop-age-text {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }
        
        .desktop-class-badge {
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          display: inline-block;
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
})

DesktopClassCard.displayName = 'DesktopClassCard'

export default function Schedule() {
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState('all')
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const todayIndex = useMemo(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
    return DAYS.indexOf(today)
  }, [])

  useEffect(() => {
    if (todayIndex !== -1) setCurrentDayIndex(todayIndex)
  }, [todayIndex])

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
        setData(json)
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }
    
    fetchData()
  }, [])

  const handleTouchStart = useCallback((e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    
    if (isLeftSwipe) {
      setCurrentDayIndex(i => (i + 1) % DAYS.length)
    }
    if (isRightSwipe) {
      setCurrentDayIndex(i => (i - 1 + DAYS.length) % DAYS.length)
    }
  }, [touchStart, touchEnd])

  const nextDay = useCallback(() => setCurrentDayIndex(i => (i + 1) % DAYS.length), [])
  const prevDay = useCallback(() => setCurrentDayIndex(i => (i - 1 + DAYS.length) % DAYS.length), [])

  const filteredDays = useMemo(() => {
    if (!data || !data.classSchedule) return []
    
    const classSchedule = data.classSchedule
    
    return DAYS.map(day => {
      // Handle both array and object formats for dailySchedule
      let dayData = { classes: [] }
      
      if (Array.isArray(classSchedule?.dailySchedule)) {
        // If dailySchedule is an array, use find
        dayData = classSchedule.dailySchedule.find(d => d.day === day) || { classes: [] }
      } else if (classSchedule?.dailySchedule) {
        // If dailySchedule is an object with numeric keys, iterate through values
        const dailyScheduleValues = Object.values(classSchedule.dailySchedule)
        const foundDay = dailyScheduleValues.find(d => d.day === day)
        dayData = foundDay || { classes: [] }
      }
      
      // Ensure classes is always an array before filtering
      const classesArray = Array.isArray(dayData.classes) ? dayData.classes : Object.values(dayData.classes || {})
      const filtered = classesArray.filter(cls => {
        if (filter === 'all') return true
        if (filter === 'kids') return cls.type?.toLowerCase().includes('youth') || cls.type?.toLowerCase().includes('kids')
        if (filter === 'adults') return cls.type?.toLowerCase().includes('adult')
        return false
      })
      return {
        day,
        classes: filtered,
        isToday: day === DAYS[todayIndex]
      }
    })
  }, [data, filter, todayIndex])

  if (!data) return null

  const schedulePage = data.schedulePage || { hero: {} }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <Hero {...schedulePage.hero} />

      {/* Header Section */}
      <section className="py-12 bg-white border-b border-gray-200 relative overflow-hidden">
        {/* Background Design */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
          
          {/* Clock Pattern */}
          <div className="absolute top-20 right-20 opacity-5">
            <svg width="80" height="80" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="#6b7280" strokeWidth="2" fill="none" />
              <line x1="50" y1="50" x2="50" y2="20" stroke="#6b7280" strokeWidth="3" />
              <line x1="50" y1="50" x2="70" y2="50" stroke="#6b7280" strokeWidth="2" />
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Weekly Training <span className="text-red-600">Schedule</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect class time that fits your week. All sessions led by certified instructors.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <FilterBtn 
              active={filter === 'all'} 
              onClick={() => setFilter('all')} 
              label="All Classes" 
              icon={Calendar}
            />
            <FilterBtn 
              active={filter === 'kids'} 
              onClick={() => setFilter('kids')} 
              label="Kids & Teens" 
              color="purple"
              icon={Users}
            />
            <FilterBtn 
              active={filter === 'adults'} 
              onClick={() => setFilter('adults')} 
              label="Adults" 
              color="blue"
              icon={Zap}
            />
          </div>
        </div>
      </section>

      {/* Mobile: Swipeable Day Cards */}
      <div 
        className="lg:hidden py-8 px-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative max-w-md mx-auto">
          {/* Day Navigation Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {DAYS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentDayIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentDayIndex 
                    ? 'w-8 bg-red-600' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <div className="schedule-mobile-card-container">
            <MobileDayCard dayData={filteredDays[currentDayIndex]} />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevDay}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg p-3 rounded-full text-gray-700 hover:bg-gray-50 transition z-10"
            aria-label="Previous day"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextDay}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg p-3 rounded-full text-gray-700 hover:bg-gray-50 transition z-10"
            aria-label="Next day"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Desktop: Full Week Grid */}
      <div className="hidden lg:block py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-7 gap-4">
            {filteredDays.map(dayData => (
              <DesktopDayCard key={dayData.day} dayData={dayData} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="cta-content">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Ready to Start Training?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Join Hawk Taekwondo and transform your life through martial arts.
            </p>
            <a
              href="/contact#form"
              className="inline-block bg-white text-red-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
            >
              Contact Us
            </a>
          </div>
        </div>
        
        <style>{`
          .cta-content {
            opacity: 0;
            animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
          }
          
          @keyframes fadeInUp {
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
      </section>
    </div>
  )
}

