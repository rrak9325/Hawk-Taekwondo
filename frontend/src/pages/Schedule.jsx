import { useEffect, useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Users, Calendar, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import Hero from '../components/Hero'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
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

          <AnimatePresence mode="wait">
            <motion.div
              key={currentDayIndex}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <MobileDayCard dayData={filteredDays[currentDayIndex]} />
            </motion.div>
          </AnimatePresence>

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Ready to Start Training?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Join Hawk Taekwondo and transform your life through martial arts.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-red-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
            >
              Book Your Free Trial
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Components
function FilterBtn({ active, onClick, label, color = 'gray', icon: Icon }) {
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
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${colors[color]}`}
    >
      {Icon && <Icon size={18} />}
      {label}
    </button>
  )
}

function MobileDayCard({ dayData }) {
  if (!dayData) return null
  const { day, classes, isToday } = dayData

  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${
      isToday ? 'ring-4 ring-red-500' : ''
    }`}>
      <div className={`p-6 text-center ${
        isToday 
          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' 
          : 'bg-gray-900 text-white'
      }`}>
        <h2 className="text-3xl font-black mb-1">{day}</h2>
        {isToday && (
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
            Today
          </span>
        )}
      </div>

      <div className="p-6 space-y-4 min-h-[300px]">
        {classes.length > 0 ? (
          classes.map((cls, i) => (
            <MobileClassCard key={i} cls={cls} />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
            <Calendar size={48} className="mb-3 opacity-50" />
            <p className="text-lg font-medium">No classes scheduled</p>
          </div>
        )}
      </div>
    </div>
  )
}

function MobileClassCard({ cls }) {
  const isAdult = cls.type?.toLowerCase().includes('adult')
  const colors = isAdult
    ? { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-600' }
    : { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-600' }

  return (
    <motion.div
      className={`${colors.bg} border-2 ${colors.border} rounded-xl p-5 hover:shadow-md transition-all`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`${colors.badge} p-2 rounded-lg`}>
            <Clock size={20} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{cls.time}</p>
            <p className={`text-sm font-semibold ${colors.text}`}>{cls.ageGroup}</p>
          </div>
        </div>
        <span className={`${colors.badge} text-white px-3 py-1 rounded-full text-xs font-bold uppercase`}>
          {isAdult ? 'Adults' : 'Kids'}
        </span>
      </div>
    </motion.div>
  )
}

function DesktopDayCard({ dayData }) {
  const { day, classes, isToday } = dayData

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all hover:shadow-xl ${
        isToday 
          ? 'border-red-500 ring-2 ring-red-200' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className={`p-4 text-center border-b-2 ${
        isToday 
          ? 'bg-red-600 text-white border-red-700' 
          : 'bg-gray-50 text-gray-900 border-gray-200'
      }`}>
        <h3 className="text-lg font-black">{day.substring(0, 3)}</h3>
        {isToday && (
          <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold uppercase">
            Today
          </span>
        )}
      </div>

      <div className="p-3 space-y-2 min-h-[400px]">
        {classes.length > 0 ? (
          classes.map((cls, i) => (
            <DesktopClassCard key={i} cls={cls} />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
            <Calendar size={32} className="mb-2 opacity-50" />
            <p className="text-xs font-medium">Rest Day</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function DesktopClassCard({ cls }) {
  const isAdult = cls.type?.toLowerCase().includes('adult')
  const colors = isAdult
    ? { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-600' }
    : { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-600' }

  return (
    <motion.div
      className={`${colors.bg} rounded-lg p-3 hover:shadow-md transition-all`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock size={14} className={colors.text} />
        <p className="text-sm font-bold text-gray-900">{cls.time}</p>
      </div>
      <p className="text-xs text-gray-600 mb-2">{cls.ageGroup}</p>
      <span className={`${colors.badge} text-white px-2 py-1 rounded text-[10px] font-bold uppercase inline-block`}>
        {isAdult ? 'Adults' : 'Kids'}
      </span>
    </motion.div>
  )
}
