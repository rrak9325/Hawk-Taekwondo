import { useEffect, useState } from 'react'
import { Clock, Users, Calendar, Filter, X, Zap } from 'lucide-react'
import Hero from '../components/Hero'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Schedule() {
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'adult', 'kids'
  const [selectedClass, setSelectedClass] = useState(null)

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

  if (!data) return null

  const { classSchedule, schedulePage } = data
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <Hero {...schedulePage.hero} />

      {/* HEADER WITH FILTER */}
      <section className="pt-14 pb-8 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900">
          Weekly Training Schedule
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Structured sessions designed for every age and skill level
        </p>

        {/* FILTER BUTTONS */}
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter size={16} />
            <span className="font-medium">Filter by:</span>
          </div>
          
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label="All Classes"
            color="gray"
          />
          <FilterButton
            active={filter === 'adult'}
            onClick={() => setFilter('adult')}
            label="Adult Training"
            color="blue"
          />
          <FilterButton
            active={filter === 'kids'}
            onClick={() => setFilter('kids')}
            label="Kids & Teens"
            color="purple"
          />
        </div>
      </section>

      {/* LEGEND */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <LegendItem color="blue" label="Adult Training" icon={Users} />
            <LegendItem color="purple" label="Kids & Teens" icon={Calendar} />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-green-500 ring-2 ring-green-200"></div>
              <span>Today's sessions</span>
            </div>
          </div>
        </div>
      </section>

      {/* DESKTOP TIMELINE */}
      <section className="hidden xl:block px-8 pb-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-7 gap-4">
          {DAYS.map(day => {
            const dayData = classSchedule.dailySchedule.find(d => d.day === day)
            const classes = dayData?.classes || []
            const isToday = day === today
            
            const filteredClasses = classes.filter(cls => {
              if (filter === 'all') return true
              if (filter === 'adult') return cls.type === 'Adult'
              if (filter === 'kids') return cls.type === 'Youth'
              return true
            })

            return (
              <div
                key={day}
                className={`rounded-2xl border-2 backdrop-blur bg-white shadow-lg
                  transition-all duration-300 hover:shadow-xl
                  ${isToday 
                    ? 'border-green-400 ring-4 ring-green-100' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                {/* Day Header */}
                <div className={`px-6 py-4 border-b-2 text-center
                  ${isToday ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}
                `}>
                  <div className="text-sm uppercase tracking-wider font-bold text-gray-700">
                    {day}
                  </div>
                  {isToday && (
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      Today
                    </div>
                  )}
                </div>

                {/* Classes */}
                <div className="p-4 space-y-3 min-h-[420px]">
                  {filteredClasses.length ? (
                    filteredClasses.map((cls, i) => (
                      <TimeBlock 
                        key={i} 
                        cls={cls} 
                        isToday={isToday}
                        onClick={() => setSelectedClass(cls)}
                        clickable={true}
                      />
                    ))
                  ) : (
                    <EmptyTimeline hasFilter={filter !== 'all'} />
                  )}
                </div>

                {/* Class Count */}
                {filteredClasses.length > 0 && (
                  <div className="px-4 pb-4 text-center text-xs text-gray-500">
                    {filteredClasses.length} session{filteredClasses.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* MOBILE – VIEW-ONLY CARDS */}
      <section className="xl:hidden px-4 pb-20">
        <div className="space-y-5 max-w-2xl mx-auto">
          {DAYS.map(day => {
            const dayData = classSchedule.dailySchedule.find(d => d.day === day)
            const classes = dayData?.classes || []
            const isToday = day === today
            
            const filteredClasses = classes.filter(cls => {
              if (filter === 'all') return true
              if (filter === 'adult') return cls.type === 'Adult'
              if (filter === 'kids') return cls.type === 'Youth'
              return true
            })

            if (filteredClasses.length === 0 && filter !== 'all') return null

            return (
              <div 
                key={day} 
                className={`
                  rounded-3xl overflow-hidden shadow-xl border-2
                  ${isToday 
                    ? 'border-green-400 ring-4 ring-green-100 bg-green-50/50' 
                    : 'border-gray-200 bg-white'
                  }
                `}
              >
                {/* Day Header */}
                <div className={`
                  px-5 py-4 border-b-2
                  ${isToday 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-400' 
                    : 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-300'
                  }
                `}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                      {day}
                      {isToday && (
                        <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white text-green-600 font-black uppercase">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Today
                        </span>
                      )}
                    </h2>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur">
                      <Calendar size={14} className="text-white" />
                      <span className="text-sm font-bold text-white">
                        {filteredClasses.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Classes Grid */}
                <div className="p-4 space-y-3">
                  {filteredClasses.length ? (
                    filteredClasses.map((cls, i) => (
                      <MobileTimeCard 
                        key={i} 
                        cls={cls} 
                        isToday={isToday}
                      />
                    ))
                  ) : (
                    <EmptyTimeline hasFilter={filter !== 'all'} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CLASS DETAIL MODAL */}
      {selectedClass && (
        <ClassModal cls={selectedClass} onClose={() => setSelectedClass(null)} />
      )}

      {/* CTA */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        
        <div className="relative z-10 px-4">
          <h2 className="text-4xl md:text-5xl font-black">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-5 text-xl opacity-90 max-w-2xl mx-auto">
            Join our community and experience world-class training
          </p>
          <a
            href="/contact"
            className="inline-block mt-10 px-12 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            Book Your Free Trial
          </a>
        </div>
      </section>
    </div>
  )
}

/* ---------------- COMPONENTS ---------------- */

function FilterButton({ active, onClick, label, color }) {
  const colors = {
    gray: 'bg-gray-600 hover:bg-gray-700 ring-gray-200',
    blue: 'bg-blue-600 hover:bg-blue-700 ring-blue-200',
    purple: 'bg-purple-600 hover:bg-purple-700 ring-purple-200'
  }

  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300
        ${active 
          ? `${colors[color]} text-white ring-4 scale-105` 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
    >
      {label}
    </button>
  )
}

function LegendItem({ color, label, icon: Icon }) {
  const colors = {
    blue: 'from-blue-500 to-blue-700',
    purple: 'from-purple-500 to-purple-700'
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
        <Icon size={16} className="text-white" />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  )
}

function TimeBlock({ cls, isToday, onClick, clickable = false }) {
  const isAdult = cls.type === 'Adult'
  
  const content = (
    <>
      {/* Animated Glow */}
      <div className={`absolute inset-0 transition-opacity duration-300
        bg-gradient-to-br from-white/20 to-transparent pointer-events-none
        ${clickable ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}
      `} />

      {/* Shine Effect */}
      {clickable && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
          bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full
          pointer-events-none" style={{ transition: 'transform 0.8s ease-in-out' }} />
      )}

      <div className="relative z-10">
        {/* Type Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold uppercase tracking-wide">
            <Users size={12} />
            {isAdult ? 'Adult' : 'Kids & Teens'}
          </span>
          {isToday && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ring-2 ring-white/50"></div>
          )}
        </div>

        {/* Time */}
        <div className="flex items-center gap-2 mb-2">
          <Clock size={18} className="flex-shrink-0" />
          <span className="text-2xl md:text-3xl font-black">
            {cls.time}
          </span>
        </div>

        {/* Age Group */}
        <div className="text-sm font-medium opacity-90 bg-black/10 rounded-lg px-3 py-1.5 inline-block">
          {cls.ageGroup}
        </div>

        {/* Hover Indicator - Only for clickable */}
        {clickable && (
          <div className="mt-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
            Click for details →
          </div>
        )}
      </div>
    </>
  )

  if (!clickable) {
    return (
      <div
        className={`
          relative overflow-hidden rounded-xl p-4 w-full
          ${isToday ? 'ring-2 ring-white/50' : ''}
          ${isAdult
            ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
            : 'bg-gradient-to-br from-purple-500 to-purple-700 text-white'}
        `}
      >
        {content}
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-xl p-4 w-full text-left
        transition-all duration-300 transform
        hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.02]
        ${isToday ? 'ring-2 ring-white/50' : ''}
        ${isAdult
          ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
          : 'bg-gradient-to-br from-purple-500 to-purple-700 text-white'}
      `}
    >
      {content}
    </button>
  )
}

function EmptyTimeline({ hasFilter }) {
  return (
    <div className="h-40 flex flex-col items-center justify-center text-gray-400 text-center px-4">
      <Calendar size={32} className="mb-2 opacity-50" />
      <p className="text-sm font-medium">
        {hasFilter ? 'No sessions match this filter' : 'No sessions scheduled'}
      </p>
    </div>
  )
}

function MobileTimeCard({ cls, isToday }) {
  const isAdult = cls.type === 'Adult'

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-5
        border-2 shadow-lg
        ${isAdult
          ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-blue-400'
          : 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 border-purple-400'}
        ${isToday ? 'ring-4 ring-green-200' : ''}
      `}
    >
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-12"></div>

      <div className="relative z-10 text-white">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-sm border border-white/30">
            <Users size={14} />
            <span className="text-xs font-black uppercase tracking-wider">
              {isAdult ? 'Adult' : 'Kids & Teens'}
            </span>
          </div>
          
          {isToday && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-400 text-green-900">
              <Zap size={12} className="animate-pulse" />
              <span className="text-xs font-black uppercase">Live</span>
            </div>
          )}
        </div>

        {/* Time Display */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-sm">
              <Clock size={24} />
            </div>
            <div className="text-4xl font-black tracking-tight">
              {cls.time}
            </div>
          </div>
        </div>

        {/* Age Group Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 backdrop-blur-sm border border-white/20">
          <Calendar size={16} />
          <span className="font-bold text-sm">
            {cls.ageGroup}
          </span>
        </div>

        {/* Bottom Accent */}
        <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
          <span className="text-xs font-semibold opacity-75 uppercase tracking-wide">
            Training Session
          </span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white/60"></div>
            <div className="w-2 h-2 rounded-full bg-white/80"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ClassModal({ cls, onClose }) {
  const isAdult = cls.type === 'Adult'

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={`
          relative max-w-md w-full rounded-2xl shadow-2xl overflow-hidden
          transform transition-all duration-300 scale-100
          ${isAdult 
            ? 'bg-gradient-to-br from-blue-500 to-blue-700' 
            : 'bg-gradient-to-br from-purple-500 to-purple-700'
          }
          text-white
        `}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur text-sm font-bold uppercase tracking-wide mb-4">
            <Users size={16} />
            {isAdult ? 'Adult Training' : 'Kids & Teens'}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Clock size={32} />
            <h3 className="text-4xl font-black">{cls.time}</h3>
          </div>

          <div className="space-y-4 bg-white/10 backdrop-blur rounded-xl p-6">
            <div>
              <div className="text-sm opacity-75 uppercase tracking-wide mb-1">Age Group</div>
              <div className="text-xl font-bold">{cls.ageGroup}</div>
            </div>

            <div>
              <div className="text-sm opacity-75 uppercase tracking-wide mb-1">Session Type</div>
              <div className="text-xl font-bold">{cls.type} Training</div>
            </div>
          </div>

          <a
            href="/contact"
            className="mt-8 w-full block text-center px-8 py-4 rounded-xl bg-white text-gray-900 font-bold text-lg hover:scale-105 transition-transform duration-300"
          >
            Book This Session
          </a>
        </div>
      </div>
    </div>
  )
}