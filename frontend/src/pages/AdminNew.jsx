import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Menu, Plus, LogOut, Upload, Trash2, Moon, Sun, X, Info, Video, Package, Users, MessageSquare, Image as ImageIcon, Calendar } from 'lucide-react'
import { authService, dataService, uploadService } from '../services/index.js'
import { currentAnimationConfig, shouldUseInfiniteLoops } from '../utils/devicePerformance.js'
import AdminCard from '../components/admin/AdminCard'
import AdminInput from '../components/admin/AdminInput'
import MediaUpload from '../components/admin/MediaUpload'
import Toast from '../components/admin/Toast'

// Helper to immutably update nested state (faster than deep clone every time)
const setNestedProperty = (obj, path, value) => {
  const keys = path.split('.')
  const newObj = { ...obj }

  let current = newObj
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    current[key] = { ...current[key] }
    current = current[key]
  }

  current[keys[keys.length - 1]] = value
  return newObj
}

export default function AdminNew() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])
  const [activeTab, setActiveTab] = useState(localStorage.getItem('adminActiveTab') || 'school')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') !== 'false')
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      setIsAuthenticated(authenticated)
      setShowLogin(!authenticated)
      if (authenticated) {
        fetchData()
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    
    try {
      const result = await authService.login(loginForm)
      if (result.success) {
        setIsAuthenticated(true)
        setShowLogin(false)
        addToast('success', 'Login successful!')
        fetchData()
      } else {
        addToast('error', result.error || 'Login failed')
      }
    } catch (error) {
      addToast('error', 'Login failed: ' + error.message)
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setIsAuthenticated(false)
      setShowLogin(true)
      setData(null)
      // Reset to first section on logout
      setActiveTab('school')
      localStorage.setItem('adminActiveTab', 'school')
      // Clear login form fields
      setLoginForm({ username: '', password: '' })
      setShowPassword(false)
      addToast('success', 'Logged out successfully')
    } catch (error) {
      addToast('error', 'Logout failed')
    }
  }

  const addToast = useCallback((type, text) => {
    const id = Date.now()
    setToasts(prev => [{ id, type, text }])

    const timeout = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const result = await dataService.getSchoolData(false)
      
      if (result.success) {
        let data = result.data
        
        // Normalize all object-based arrays to proper arrays
        // 1. School hours
        if (data?.schoolInfo?.hours && !Array.isArray(data.schoolInfo.hours)) {
          data.schoolInfo.hours = Object.values(data.schoolInfo.hours)
        }
        
        // 2. Schedule batches
        if (data?.classSchedule?.batches && !Array.isArray(data.classSchedule.batches)) {
          data.classSchedule.batches = Object.values(data.classSchedule.batches)
          
          // Also normalize days within each batch
          data.classSchedule.batches = data.classSchedule.batches.map(batch => ({
            ...batch,
            days: Array.isArray(batch.days) ? batch.days : Object.values(batch.days || {})
          }))
        }
        
        // 2. Daily schedule
        if (data?.classSchedule?.dailySchedule && !Array.isArray(data.classSchedule.dailySchedule)) {
          data.classSchedule.dailySchedule = Object.values(data.classSchedule.dailySchedule).map(day => ({
            ...day,
            classes: Array.isArray(day.classes) ? day.classes : Object.values(day.classes || {})
          }))
        }
        
        // 3. Testimonials
        if (data?.testimonials && !Array.isArray(data.testimonials)) {
          data.testimonials = Object.values(data.testimonials)
        }
        
        // 4. About stats
        if (data?.about?.stats && !Array.isArray(data.about.stats)) {
          data.about.stats = Object.values(data.about.stats)
        }
        
        // 5. About values
        if (data?.about?.values && !Array.isArray(data.about.values)) {
          data.about.values = Object.values(data.about.values)
        }
        
        // 6. Gallery featured
        if (data?.gallery?.featured && !Array.isArray(data.gallery.featured)) {
          data.gallery.featured = Object.values(data.gallery.featured)
        }
        
        setData(data)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Helper function to update daily schedule based on batches
  const updateDailySchedule = useCallback((batches) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const dailySchedule = days.map(day => ({
      day,
      classes: batches
        .filter(batch => (batch.days || []).includes(day))
        .map(batch => ({
          name: batch.name,
          time: batch.time,
          ageGroup: batch.ageGroup,
          type: batch.ageGroup?.includes('18+') ? 'Adult' : 'Youth'
        }))
    }))
    
    return dailySchedule
  }, [])

  // Better update function — no deep clone needed every time
  const updateField = useCallback((path, value) => {
    setData(prev => {
      if (!prev) return prev
      
      let updated = setNestedProperty(prev, path, value)
      
      // If updating schedule batches, ensure we convert to array format and update daily schedule
      if (path.startsWith('classSchedule.batches')) {
        // Ensure batches is always an array
        let batches = updated.classSchedule?.batches
        if (!Array.isArray(batches)) {
          batches = Object.values(batches || {})
          updated.classSchedule = {
            ...updated.classSchedule,
            batches: batches
          }
        }
        
        const dailySchedule = updateDailySchedule(batches)
        updated.classSchedule = {
          ...updated.classSchedule,
          dailySchedule: dailySchedule
        }
      }
      
      return updated
    })
  }, [updateDailySchedule])

  const handleSave = async () => {
    if (!data) {
      addToast('error', 'No data to save')
      return
    }
    
    setSaving(true)
    
    try {
      // Ensure data is in the correct format before saving
      const dataToSave = { ...data }
      
      // Ensure schedule batches are in array format for consistency
      if (dataToSave.classSchedule?.batches && !Array.isArray(dataToSave.classSchedule.batches)) {
        dataToSave.classSchedule.batches = Object.values(dataToSave.classSchedule.batches)
      }
      
      const result = await dataService.updateSchoolData(dataToSave)
      
      if (result.success) {
        if (result.mode === 'download') {
          addToast('success', 'Downloaded mockData.json. Replace public/mockData.json and redeploy.')
        } else {
          addToast('success', 'Data saved successfully! Changes are now live.')
          await fetchData()
        }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      addToast('error', `Save failed: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = useCallback(async (path, e) => {
    // Check if this is from the new MediaUpload component with result
    if (e.result) {
      // New optimized upload system - store both URL and publicId
      const currentValue = getNestedValue(data, path)
      
      // If there's an old file, delete it from Cloudinary
      if (currentValue && typeof currentValue === 'string' && currentValue.includes('cloudinary')) {
        try {
          await uploadService.deleteFile(currentValue)
        } catch (err) {
          // Silently handle deletion failure
        }
      }
      
      updateField(path, e.result.url)
      addToast('success', `🔥 BEAST MODE: ${e.result.savings} compression! Format: ${e.result.format}`)
      
      // Auto-save after upload
      setTimeout(async () => {
        try {
          const updatedData = setNestedProperty(data, path, e.result.url)
          const result = await dataService.updateSchoolData(updatedData)
          if (result.success) {
            // Auto-save successful
          }
        } catch (err) {
          // Silently handle auto-save failure
        }
      }, 500)
      
      return
    }

    // Legacy upload handling
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/mov']
    if (!validTypes.includes(file.type)) {
      addToast('error', 'Only images & videos (mp4/webm/mov) allowed')
      return
    }

    if (file.size > 200 * 1024 * 1024) {
      addToast('error', `File too big (${(file.size / 1024 / 1024).toFixed(1)}MB) — max 200MB`)
      return
    }

    try {
      addToast('info', `🚀 Uploading ${file.name}...`)
      
      // Delete old file from Cloudinary if exists
      const currentValue = getNestedValue(data, path)
      if (currentValue && typeof currentValue === 'string' && currentValue.includes('cloudinary')) {
        try {
          await uploadService.deleteFile(currentValue)
        } catch (err) {
          // Silently handle deletion failure
        }
      }
      
      const result = await uploadService.uploadFile(file)
      if (result.success) {
        const newUrl = result.data.url
        updateField(path, newUrl)
        addToast('success', `${file.name} uploaded to Cloudinary!`)
        
        // Auto-save after upload
        setTimeout(async () => {
          try {
            const updatedData = setNestedProperty(data, path, newUrl)
            const saveResult = await dataService.updateSchoolData(updatedData)
            if (saveResult.success) {
              addToast('success', '💾 Saved automatically!')
            }
          } catch (err) {
            addToast('warning', 'Upload successful but auto-save failed. Click Save Changes.')
          }
        }, 500)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      addToast('error', `Upload failed: ${error.message}`)
    }
  }, [data, updateField, addToast])

  // Helper to delete media from Cloudinary
  const handleDelete = useCallback(async (path) => {
    const currentValue = getNestedValue(data, path)
    
    if (currentValue && typeof currentValue === 'string' && currentValue.includes('cloudinary')) {
      try {
        await uploadService.deleteFile(currentValue)
        addToast('success', 'File deleted from Cloudinary')
      } catch (err) {
        addToast('warning', 'File removed from site (Cloudinary deletion failed)')
      }
    }
    
    updateField(path, '')
    
    // Auto-save after delete
    setTimeout(async () => {
      try {
        const updatedData = setNestedProperty(data, path, '')
        const result = await dataService.updateSchoolData(updatedData)
        if (result.success) {
          addToast('success', '💾 Saved automatically!')
        }
      } catch (err) {
        addToast('warning', 'Delete successful but auto-save failed. Click Save Changes.')
      }
    }, 500)
  }, [data, updateField, addToast])

  // Helper to get nested value
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  const navItems = useMemo(() => [
    { id: 'school', icon: Info, label: 'School Info', color: 'blue' },
    { id: 'media', icon: Video, label: 'Media', color: 'purple' },
    { id: 'about', icon: Info, label: 'About Page', color: 'indigo' },
    { id: 'programs', icon: Package, label: 'Programs', color: 'green' },
    { id: 'schedule', icon: Calendar, label: 'Schedule', color: 'orange' },
    { id: 'instructors', icon: Users, label: 'Instructors', color: 'pink' },
    { id: 'testimonials', icon: MessageSquare, label: 'Testimonials', color: 'yellow' },
    { id: 'gallery', icon: ImageIcon, label: 'Gallery', color: 'cyan' }
  ], [])

  const colorMap = useMemo(() => ({
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    indigo: 'from-indigo-500 to-purple-500',
    green: 'from-green-500 to-emerald-500',
    pink: 'from-pink-500 to-rose-500',
    yellow: 'from-yellow-500 to-orange-500',
    cyan: 'from-cyan-500 to-blue-500',
    orange: 'from-orange-500 to-red-500'
  }), [])

  if (loading) {
    // Use CSS-only spinner on low-end devices
    if (!shouldUseInfiniteLoops()) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-400 border-r-pink-400 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 text-xl font-bold mb-2">Loading admin...</div>
              <div className="text-purple-300/60 text-sm">🔐 Preparing your dashboard</div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="w-16 h-16 border-4 border-transparent border-t-purple-400 border-r-pink-400 rounded-full" />
            </motion.div>
            
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
            </motion.div>
          </div>

          <motion.div
            className="text-center"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-purple-400 text-xl font-bold mb-2">Loading admin...</div>
            <div className="text-purple-300/60 text-sm">🔐 Preparing your dashboard</div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (showLogin || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4">
        <Toast toasts={toasts} onClose={removeToast} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
              <p className="text-slate-400">Access the Hawk Taekwondo admin panel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter username"
                  required
                  disabled={loginLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                    placeholder="Enter password"
                    required
                    disabled={loginLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    disabled={loginLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Login
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'} transition-colors duration-300`}>
      <Toast toasts={toasts} onClose={removeToast} />

      {/* Desktop Sidebar - Fixed */}
      <aside className={`fixed left-0 top-0 h-screen w-64 ${darkMode ? 'bg-slate-900/95' : 'bg-white'} backdrop-blur-xl border-r ${darkMode ? 'border-slate-800' : 'border-slate-200'} hidden lg:flex flex-col z-50 overflow-hidden`}>
        {/* Header */}
        <div className={`p-6 flex items-center gap-3 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'} flex-shrink-0`}>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Hawk Admin</span>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  localStorage.setItem('adminActiveTab', item.id)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${colorMap[item.color]} text-white shadow-lg`
                    : `${darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer - Fixed at bottom */}
        <div className={`p-4 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'} space-y-2 flex-shrink-0`}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
          <button
            onClick={() => {
              const newMode = !darkMode
              setDarkMode(newMode)
              localStorage.setItem('darkMode', newMode)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
          >
            {darkMode ? <Sun size={20} className="flex-shrink-0" /> : <Moon size={20} className="flex-shrink-0" />}
            <span className="font-medium">{darkMode ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu - Full overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className={`absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] ${darkMode ? 'bg-slate-900' : 'bg-white'} shadow-2xl flex flex-col overflow-hidden`}>
            {/* Header */}
            <div className={`p-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'} flex-shrink-0`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold text-xl">H</span>
                  </div>
                  <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Hawk Admin
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} flex-shrink-0`}
                >
                  <X size={24} className={darkMode ? 'text-white' : 'text-slate-900'} />
                </button>
              </div>
            </div>

            {/* Navigation - Scrollable */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map(item => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      localStorage.setItem('adminActiveTab', item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${colorMap[item.color]} text-white shadow-lg`
                        : `${darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`
                    }`}
                  >
                    <Icon size={22} className="flex-shrink-0" />
                    <span className="font-medium text-lg">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Footer - Fixed at bottom */}
            <div className={`p-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'} space-y-2 flex-shrink-0`}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <LogOut size={22} className="flex-shrink-0" />
                <span className="font-medium text-lg">Logout</span>
              </button>
              <button
                onClick={() => {
                  const newMode = !darkMode
                  setDarkMode(newMode)
                  localStorage.setItem('darkMode', newMode)
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl ${
                  darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {darkMode ? <Sun size={22} className="flex-shrink-0" /> : <Moon size={22} className="flex-shrink-0" />}
                <span className="font-medium text-lg">{darkMode ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Properly offset for sidebar */}
      <main className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header - Sticky */}
        <header className={`sticky top-0 z-40 ${darkMode ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-xl border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'} flex-shrink-0`}>
          <div className="px-4 lg:px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`lg:hidden p-2 rounded-lg ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} flex-shrink-0`}
              >
                <Menu size={24} className={darkMode ? 'text-white' : 'text-slate-900'} />
              </button>
              <h1 className={`text-lg lg:text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} truncate`}>
                {navItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 lg:px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 text-sm lg:text-base whitespace-nowrap flex-shrink-0"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </header>

        {/* Content - Scrollable with proper spacing */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
            {activeTab === 'school' && data && (
              <AdminCard title="School Information" darkMode={darkMode}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {['name', 'tagline', 'email', 'phone', 'address', 'mission'].map(field => (
                    <AdminInput
                      key={field}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={data.schoolInfo?.[field] || ''}
                      onChange={v => updateField(`schoolInfo.${field}`, v)}
                      isTextarea={['address', 'mission'].includes(field)}
                      darkMode={darkMode}
                    />
                  ))}
                  
                  <div className="lg:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      Operating Hours
                    </label>
                    <div className="space-y-2">
                      {(Array.isArray(data.schoolInfo?.hours) ? data.schoolInfo.hours : []).map((hour, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={hour || ''}
                            onChange={(e) => {
                              const newHours = [...(Array.isArray(data.schoolInfo?.hours) ? data.schoolInfo.hours : [])]
                              newHours[index] = e.target.value
                              updateField('schoolInfo.hours', newHours)
                            }}
                            placeholder="e.g., Mon-Fri: 3:00 PM - 9:00 PM"
                            className={`flex-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                          />
                          <button
                            onClick={() => {
                              const newHours = [...(Array.isArray(data.schoolInfo?.hours) ? data.schoolInfo.hours : [])]
                              newHours.splice(index, 1)
                              updateField('schoolInfo.hours', newHours)
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newHours = [...(Array.isArray(data.schoolInfo?.hours) ? data.schoolInfo.hours : []), '']
                          updateField('schoolInfo.hours', newHours)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                      >
                        <Plus size={16} />
                        Add Hours
                      </button>
                    </div>
                  </div>
                </div>
              </AdminCard>
            )}

            {activeTab === 'media' && data && (
              <div className="space-y-6">
                {Object.keys(data).filter(key => data[key]?.hero).map(page => (
                  <AdminCard key={page} title={`${page} Hero`} darkMode={darkMode}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <MediaUpload
                        label="Background Image"
                        value={data[page].hero.backgroundImage}
                        onUpload={e => handleUpload(`${page}.hero.backgroundImage`, e)}
                        onDelete={() => handleDelete(`${page}.hero.backgroundImage`)}
                        darkMode={darkMode}
                      />
                      <MediaUpload
                        label="Video"
                        value={data[page].hero.videoUrl}
                        onUpload={e => handleUpload(`${page}.hero.videoUrl`, e)}
                        onDelete={() => handleDelete(`${page}.hero.videoUrl`)}
                        isVideo
                        darkMode={darkMode}
                      />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                      <AdminInput
                        label="Title Main"
                        value={data[page].hero.titleMain || ''}
                        onChange={v => updateField(`${page}.hero.titleMain`, v)}
                        darkMode={darkMode}
                      />
                      <AdminInput
                        label="Title Highlight"
                        value={data[page].hero.titleHighlight || ''}
                        onChange={v => updateField(`${page}.hero.titleHighlight`, v)}
                        darkMode={darkMode}
                      />
                      <div className="lg:col-span-2">
                        <AdminInput
                          label="Subtitle"
                          value={data[page].hero.subtitle || ''}
                          onChange={v => updateField(`${page}.hero.subtitle`, v)}
                          isTextarea
                          darkMode={darkMode}
                        />
                      </div>
                    </div>
                  </AdminCard>
                ))}
              </div>
            )}

            {activeTab === 'about' && data && (
              <div className="space-y-6">
                <AdminCard title="About Page Hero" darkMode={darkMode}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <MediaUpload
                      label="Background Image"
                      value={data.about?.hero?.backgroundImage}
                      onUpload={e => handleUpload('about.hero.backgroundImage', e)}
                      onDelete={() => handleDelete('about.hero.backgroundImage')}
                      darkMode={darkMode}
                    />
                    <MediaUpload
                      label="Video"
                      value={data.about?.hero?.videoUrl}
                      onUpload={e => handleUpload('about.hero.videoUrl', e)}
                      onDelete={() => handleDelete('about.hero.videoUrl')}
                      isVideo
                      darkMode={darkMode}
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                    <AdminInput
                      label="Title Main"
                      value={data.about?.hero?.titleMain || ''}
                      onChange={v => updateField('about.hero.titleMain', v)}
                      darkMode={darkMode}
                    />
                    <AdminInput
                      label="Title Highlight"
                      value={data.about?.hero?.titleHighlight || ''}
                      onChange={v => updateField('about.hero.titleHighlight', v)}
                      darkMode={darkMode}
                    />
                    <div className="lg:col-span-2">
                      <AdminInput
                        label="Subtitle"
                        value={data.about?.hero?.subtitle || ''}
                        onChange={v => updateField('about.hero.subtitle', v)}
                        isTextarea
                        darkMode={darkMode}
                      />
                    </div>
                  </div>
                </AdminCard>

                <AdminCard title="Statistics" darkMode={darkMode}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(Array.isArray(data.about?.stats) ? data.about.stats : Object.values(data.about?.stats || {})).map((stat, index) => (
                      <div key={index} className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                        <AdminInput
                          label="Number"
                          value={stat.number || ''}
                          onChange={v => updateField(`about.stats.${index}.number`, v)}
                          placeholder="e.g., 15+"
                          darkMode={darkMode}
                        />
                        <AdminInput
                          label="Label"
                          value={stat.label || ''}
                          onChange={v => updateField(`about.stats.${index}.label`, v)}
                          placeholder="e.g., Years Experience"
                          darkMode={darkMode}
                        />
                      </div>
                    ))}
                  </div>
                </AdminCard>

                <AdminCard title="Core Values" darkMode={darkMode}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(Array.isArray(data.about?.values) ? data.about.values : Object.values(data.about?.values || {})).map((value, index) => (
                      <div key={index} className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                        <AdminInput
                          label="Icon Name"
                          value={value.icon || ''}
                          onChange={v => updateField(`about.values.${index}.icon`, v)}
                          placeholder="e.g., Shield, Heart, Target, Users"
                          darkMode={darkMode}
                        />
                        <AdminInput
                          label="Title"
                          value={value.title || ''}
                          onChange={v => updateField(`about.values.${index}.title`, v)}
                          darkMode={darkMode}
                        />
                        <AdminInput
                          label="Description"
                          value={value.description || ''}
                          onChange={v => updateField(`about.values.${index}.description`, v)}
                          isTextarea
                          darkMode={darkMode}
                        />
                      </div>
                    ))}
                  </div>
                </AdminCard>

                <AdminCard title="Call to Action" darkMode={darkMode}>
                  <div className="space-y-4">
                    <AdminInput
                      label="Title"
                      value={data.about?.cta?.title || ''}
                      onChange={v => updateField('about.cta.title', v)}
                      darkMode={darkMode}
                    />
                    <AdminInput
                      label="Text"
                      value={data.about?.cta?.text || ''}
                      onChange={v => updateField('about.cta.text', v)}
                      isTextarea
                      darkMode={darkMode}
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <AdminInput
                        label="Button Label"
                        value={data.about?.cta?.buttonLabel || ''}
                        onChange={v => updateField('about.cta.buttonLabel', v)}
                        darkMode={darkMode}
                      />
                      <AdminInput
                        label="Button Link"
                        value={data.about?.cta?.buttonLink || ''}
                        onChange={v => updateField('about.cta.buttonLink', v)}
                        placeholder="e.g., /contact"
                        darkMode={darkMode}
                      />
                    </div>
                  </div>
                </AdminCard>
              </div>
            )}

            {activeTab === 'programs' && data && (
              <div className="space-y-6">
                <button
                  onClick={() => {
                    const newProgram = {
                      id: Date.now(),
                      name: 'New Program',
                      description: '',
                      benefits: [],
                      image: ''
                    }
                    
                    const currentPrograms = Object.values(data.programs || {})
                    const updatedPrograms = [newProgram, ...currentPrograms]
                    
                    const programsObject = {}
                    updatedPrograms.forEach((program, index) => {
                      programsObject[index.toString()] = program
                    })
                    
                    setData(prev => ({
                      ...prev,
                      programs: programsObject
                    }))
                    
                    addToast('success', 'New program added!')
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg hover:shadow-green-500/30 transition-all"
                >
                  <Plus size={18} className="inline mr-2" /> Add Program
                </button>

                {Object.entries(data.programs || {}).map(([key, program], index) => (
                  <AdminCard
                    key={program.id || key}
                    title={program.name || 'Unnamed Program'}
                    darkMode={darkMode}
                    onDelete={() => {
                      if (!confirm('Delete this program?')) return
                      
                      const currentPrograms = Object.values(data.programs || {})
                      currentPrograms.splice(index, 1)
                      
                      const programsObject = {}
                      currentPrograms.forEach((prog, idx) => {
                        programsObject[idx.toString()] = prog
                      })
                      
                      setData(prev => ({
                        ...prev,
                        programs: programsObject
                      }))
                      
                      addToast('success', 'Program deleted!')
                    }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <MediaUpload
                        value={program.image}
                        onUpload={e => handleUpload(`programs.${key}.image`, e)}
                        onDelete={() => handleDelete(`programs.${key}.image`)}
                        darkMode={darkMode}
                      />
                      <div className="space-y-4">
                        <AdminInput
                          label="Name"
                          value={program.name || ''}
                          onChange={v => updateField(`programs.${key}.name`, v)}
                          darkMode={darkMode}
                        />
                        <AdminInput
                          label="Description"
                          value={program.description || ''}
                          onChange={v => updateField(`programs.${key}.description`, v)}
                          isTextarea
                          darkMode={darkMode}
                        />
                      </div>
                    </div>
                  </AdminCard>
                ))}
              </div>
            )}

            {activeTab === 'instructors' && data && (
              <div className="space-y-6">
                <button
                  onClick={() => {
                    const newInstructor = {
                      id: Date.now(),
                      name: 'New Instructor',
                      rank: '',
                      specialization: '',
                      experience: '',
                      bio: '',
                      image: ''
                    }
                    
                    const currentInstructors = Object.values(data.instructors || {})
                    const updatedInstructors = [newInstructor, ...currentInstructors]
                    
                    const instructorsObject = {}
                    updatedInstructors.forEach((instructor, index) => {
                      instructorsObject[index.toString()] = instructor
                    })
                    
                    setData(prev => ({
                      ...prev,
                      instructors: instructorsObject
                    }))
                    
                    addToast('success', 'New instructor added!')
                  }}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg hover:shadow-pink-500/30 transition-all"
                >
                  <Plus size={18} className="inline mr-2" /> Add Instructor
                </button>

                {Object.entries(data.instructors || {}).map(([key, instructor], index) => (
                  <AdminCard
                    key={instructor.id || key}
                    title={instructor.name || 'Unnamed Instructor'}
                    darkMode={darkMode}
                    onDelete={() => {
                      if (!confirm('Delete this instructor?')) return
                      
                      const currentInstructors = Object.values(data.instructors || {})
                      currentInstructors.splice(index, 1)
                      
                      const instructorsObject = {}
                      currentInstructors.forEach((inst, idx) => {
                        instructorsObject[idx.toString()] = inst
                      })
                      
                      setData(prev => ({
                        ...prev,
                        instructors: instructorsObject
                      }))
                      
                      addToast('success', 'Instructor deleted!')
                    }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <MediaUpload
                        value={instructor.image}
                        onUpload={e => handleUpload(`instructors.${key}.image`, e)}
                        onDelete={() => handleDelete(`instructors.${key}.image`)}
                        rounded
                        darkMode={darkMode}
                      />
                      <div className="lg:col-span-2 space-y-4">
                        <AdminInput
                          label="Name"
                          value={instructor.name || ''}
                          onChange={v => updateField(`instructors.${key}.name`, v)}
                          darkMode={darkMode}
                        />
                        <AdminInput
                          label="Rank"
                          value={instructor.rank || ''}
                          onChange={v => updateField(`instructors.${key}.rank`, v)}
                          darkMode={darkMode}
                        />
                        <AdminInput
                          label="Specialization"
                          value={instructor.specialization || ''}
                          onChange={v => updateField(`instructors.${key}.specialization`, v)}
                          placeholder="e.g., Chief Instructor, Assistant Coach"
                          darkMode={darkMode}
                        />
                        <AdminInput
                          label="Experience"
                          value={instructor.experience || ''}
                          onChange={v => updateField(`instructors.${key}.experience`, v)}
                          placeholder="e.g., 25 years, 10 years"
                          darkMode={darkMode}
                        />
                        <AdminInput
                          label="Bio"
                          value={instructor.bio || ''}
                          onChange={v => updateField(`instructors.${key}.bio`, v)}
                          isTextarea
                          darkMode={darkMode}
                        />
                      </div>
                    </div>
                  </AdminCard>
                ))}
              </div>
            )}

            {activeTab === 'testimonials' && data && (
              <div className="space-y-6">
                <button
                  onClick={() => {
                    const newTestimonial = {
                      id: Date.now(),
                      name: 'New Student',
                      program: 'Adult Program',
                      rating: 5,
                      comment: '',
                      image: ''
                    }
                    setData(prev => {
                      const currentTestimonials = Array.isArray(prev.testimonials) 
                        ? prev.testimonials 
                        : Object.values(prev.testimonials || {})
                      
                      return {
                        ...prev,
                        testimonials: [newTestimonial, ...currentTestimonials]
                      }
                    })
                    addToast('success', 'New testimonial added!')
                  }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  <Plus size={18} className="inline mr-2" /> Add Testimonial
                </button>

                {(Array.isArray(data.testimonials) ? data.testimonials : Object.values(data.testimonials || {})).map((testimonial, index) => (
                  <AdminCard
                    key={testimonial.id}
                    title={testimonial.name || 'Anonymous'}
                    darkMode={darkMode}
                    onDelete={() => {
                      if (!confirm('Delete this testimonial?')) return
                      setData(prev => {
                        const currentTestimonials = Array.isArray(prev.testimonials) 
                          ? prev.testimonials 
                          : Object.values(prev.testimonials || {})
                        const newList = [...currentTestimonials]
                        newList.splice(index, 1)
                        return { ...prev, testimonials: newList }
                      })
                      addToast('success', 'Testimonial deleted!')
                    }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <MediaUpload
                        value={testimonial.image}
                        onUpload={e => handleUpload(`testimonials.${index}.image`, e)}
                        onDelete={() => handleDelete(`testimonials.${index}.image`)}
                        rounded
                        darkMode={darkMode}
                      />
                      <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <AdminInput
                            label="Name"
                            value={testimonial.name || ''}
                            onChange={v => updateField(`testimonials.${index}.name`, v)}
                            darkMode={darkMode}
                          />
                          <AdminInput
                            label="Program"
                            value={testimonial.program || ''}
                            onChange={v => updateField(`testimonials.${index}.program`, v)}
                            darkMode={darkMode}
                          />
                        </div>
                        <AdminInput
                          label="Rating (1-5)"
                          type="number"
                          value={testimonial.rating ?? 5}
                          onChange={v => updateField(`testimonials.${index}.rating`, Number(v))}
                          darkMode={darkMode}
                          min="1"
                          max="5"
                        />
                        <AdminInput
                          label="Comment"
                          value={testimonial.comment || ''}
                          onChange={v => updateField(`testimonials.${index}.comment`, v)}
                          isTextarea
                          darkMode={darkMode}
                        />
                      </div>
                    </div>
                  </AdminCard>
                ))}
              </div>
            )}

            {activeTab === 'schedule' && data && (
              <div className="space-y-6">
                <AdminCard title="Class Schedule Management" darkMode={darkMode}>
                  <div className="space-y-8">
                    <div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Class Batches
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => {
                              if (import.meta.env.DEV) {
                                console.log('🔄 Refreshing daily schedule...')
                              }
                              setData(prev => {
                                const currentBatches = Array.isArray(prev.classSchedule?.batches) 
                                  ? prev.classSchedule.batches 
                                  : Object.values(prev.classSchedule?.batches || {})
                                const dailySchedule = updateDailySchedule(currentBatches)
                                const updated = {
                                  ...prev,
                                  classSchedule: {
                                    ...prev.classSchedule,
                                    dailySchedule: dailySchedule
                                  }
                                }
                                if (import.meta.env.DEV) {
                                  console.log('📅 Daily schedule refreshed:', updated.classSchedule.dailySchedule)
                                }
                                return updated
                              })
                              addToast('success', 'Schedule refreshed!')
                            }}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-blue-500/30 transition-all whitespace-nowrap"
                          >
                            🔄 Refresh Schedule
                          </button>
                          <button
                            onClick={() => {
                              if (import.meta.env.DEV) {
                                console.log('🔄 Adding new batch...')
                              }
                              const newBatch = {
                                name: 'New Batch',
                                days: ['Monday'],
                                time: '6:00 PM - 7:00 PM',
                                ageGroup: 'Ages 18+',
                                description: 'New class batch'
                              }
                              setData(prev => {
                                const currentBatches = Array.isArray(prev.classSchedule?.batches) 
                                  ? prev.classSchedule.batches 
                                  : Object.values(prev.classSchedule?.batches || {})
                                const newBatches = [...currentBatches, newBatch]
                                const dailySchedule = updateDailySchedule(newBatches)
                                
                                const updated = {
                                  ...prev,
                                  classSchedule: {
                                    ...prev.classSchedule,
                                    batches: newBatches,
                                    dailySchedule: dailySchedule
                                  }
                                }
                                return updated
                              })
                              addToast('success', 'New batch added!')
                            }}
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-orange-500/30 transition-all whitespace-nowrap"
                          >
                            <Plus size={18} className="inline mr-2" /> Add Batch
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-6">
                        {(Array.isArray(data.classSchedule?.batches) ? data.classSchedule.batches : Object.values(data.classSchedule?.batches || {})).map((batch, index) => (
                          <div
                            key={index}
                            className={`p-6 rounded-2xl border ${
                              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                            } shadow-lg`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Batch {index + 1}
                              </h4>
                              <button
                                onClick={() => {
                                  if (!confirm('Delete this batch?')) return
                                  setData(prev => {
                                    const currentBatches = Array.isArray(prev.classSchedule?.batches) 
                                      ? prev.classSchedule.batches 
                                      : Object.values(prev.classSchedule?.batches || {})
                                    const newBatches = [...currentBatches]
                                    newBatches.splice(index, 1)
                                    const dailySchedule = updateDailySchedule(newBatches)
                                    
                                    const updated = {
                                      ...prev,
                                      classSchedule: {
                                        ...prev.classSchedule,
                                        batches: newBatches,
                                        dailySchedule: dailySchedule
                                      }
                                    }
                                    return updated
                                  })
                                  addToast('success', 'Batch deleted!')
                                }}
                                className={`p-2 rounded-lg ${
                                  darkMode ? 'hover:bg-slate-700 text-red-400' : 'hover:bg-gray-100 text-red-500'
                                } transition-colors`}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <AdminInput
                                label="Batch Name"
                                value={batch.name || ''}
                                onChange={v => updateField(`classSchedule.batches.${index}.name`, v)}
                                darkMode={darkMode}
                              />
                              <AdminInput
                                label="Time"
                                value={batch.time || ''}
                                onChange={v => updateField(`classSchedule.batches.${index}.time`, v)}
                                placeholder="e.g., 6:00 PM - 7:00 PM"
                                darkMode={darkMode}
                              />
                              <AdminInput
                                label="Age Group"
                                value={batch.ageGroup || ''}
                                onChange={v => updateField(`classSchedule.batches.${index}.ageGroup`, v)}
                                placeholder="e.g., Ages 18+"
                                darkMode={darkMode}
                              />
                              <div>
                                <label className={`block text-sm font-medium mb-2 ${
                                  darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  Training Days
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                    <label key={day} className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={(batch.days || []).includes(day)}
                                        onChange={(e) => {
                                          const currentDays = batch.days || []
                                          const newDays = e.target.checked
                                            ? [...currentDays, day]
                                            : currentDays.filter(d => d !== day)
                                          updateField(`classSchedule.batches.${index}.days`, newDays)
                                        }}
                                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 flex-shrink-0"
                                      />
                                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {day.substring(0, 3)}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4">
                              <AdminInput
                                label="Description"
                                value={batch.description || ''}
                                onChange={v => updateField(`classSchedule.batches.${index}.description`, v)}
                                isTextarea
                                darkMode={darkMode}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Schedule Preview
                      </h3>
                      <div className={`p-6 rounded-2xl ${
                        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
                      } border overflow-x-auto`}>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 min-w-[600px]">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                            const batches = Array.isArray(data.classSchedule?.batches) ? data.classSchedule.batches : Object.values(data.classSchedule?.batches || {})
                            const dayClasses = batches.filter(batch => (batch.days || []).includes(day))
                            
                            return (
                              <div key={day} className={`p-3 rounded-xl ${
                                dayClasses.length > 0 
                                  ? darkMode ? 'bg-slate-700' : 'bg-white' 
                                  : darkMode ? 'bg-slate-900' : 'bg-gray-100'
                              }`}>
                                <h4 className={`font-bold text-sm mb-2 ${
                                  darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {day.substring(0, 3)}
                                </h4>
                                {dayClasses.length > 0 ? (
                                  <div className="space-y-2">
                                    {dayClasses.map((batch, i) => (
                                      <div key={i} className={`text-xs p-2 rounded ${
                                        batch.ageGroup?.includes('18+')
                                          ? 'bg-orange-100 text-orange-800'
                                          : 'bg-pink-100 text-pink-800'
                                      }`}>
                                        <div className="font-medium">{batch.time}</div>
                                        <div className="opacity-75">{batch.ageGroup}</div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Rest Day
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </AdminCard>
              </div>
            )}

            {activeTab === 'gallery' && data && (
              <AdminCard title="Gallery" darkMode={darkMode}>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <label className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-3 rounded-xl font-medium cursor-pointer shadow-lg hover:shadow-cyan-500/30 transition-all justify-center">
                    <Upload size={18} className="flex-shrink-0" /> Upload Images & Videos
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || [])
                        if (!files.length) return

                        addToast('info', `Uploading ${files.length} file(s) to Cloudinary...`)
                        const uploaded = []
                        
                        for (const file of files) {
                          try {
                            const res = await uploadService.uploadFile(file)
                            if (res.success) {
                              uploaded.push({
                                id: Date.now() + Math.random(),
                                image: res.data.url,
                                publicId: res.data.publicId,
                                title: ''
                              })
                            } else {
                              throw new Error(res.error)
                            }
                          } catch (err) {
                            addToast('error', `Failed: ${file.name}`)
                          }
                        }

                        if (uploaded.length > 0) {
                          const newGalleryData = {
                            ...data,
                            gallery: {
                              ...data.gallery,
                              featured: [
                                ...uploaded, 
                                ...(Array.isArray(data.gallery?.featured) 
                                  ? data.gallery.featured 
                                  : Object.values(data.gallery?.featured || {})
                                )
                              ]
                            }
                          }
                          
                          setData(newGalleryData)
                          addToast('success', `${uploaded.length} file(s) uploaded to Cloudinary!`)
                          
                          setTimeout(async () => {
                            try {
                              const result = await dataService.updateSchoolData(newGalleryData)
                              if (result.success) {
                                if (import.meta.env.DEV) {
                                  console.log('✅ Gallery auto-saved')
                                }
                                addToast('success', '💾 Gallery saved automatically!')
                              }
                            } catch (err) {
                              addToast('warning', 'Upload successful but auto-save failed. Click Save Changes.')
                            }
                          }, 500)
                        }
                      }}
                    />
                  </label>

                  <button
                    onClick={async () => {
                      if (!confirm('This will delete all unused images/videos from Cloudinary that are not being used on the website. Continue?')) return
                      try {
                        addToast('info', '🔍 Scanning Cloudinary for unused files...')
                        const res = await uploadService.cleanupOrphanFiles()
                        if (res.success) {
                          if (res.data.deletedCount > 0) {
                            addToast('success', `🎉 Cleaned ${res.data.deletedCount} unused files from Cloudinary!`)
                          } else {
                            addToast('success', '✨ No unused files found - everything is clean!')
                          }
                          fetchData()
                        } else {
                          throw new Error(res.error)
                        }
                      } catch (error) {
                        addToast('error', error.message || 'Cleanup failed')
                      }
                    }}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg hover:shadow-orange-500/30 transition-all whitespace-nowrap"
                  >
                    <Trash2 size={18} className="inline mr-2" /> Clean Unused Media
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {(Array.isArray(data.gallery?.featured) ? data.gallery.featured : Object.values(data.gallery?.featured || {})).map((media, index) => (
                    <div
                      key={media.id}
                      className={`aspect-square rounded-2xl overflow-hidden relative group ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}
                    >
                      {/* Optimized image with thumbnail */}
                      <img
                        src={media.image.includes('cloudinary') 
                          ? media.image.replace('/upload/', '/upload/w_300,h_300,c_fill,f_auto,q_auto/') 
                          : media.image
                        }
                        className="w-full h-full object-cover transition-opacity duration-300"
                        alt="gallery"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          // Fallback to original image if optimized version fails
                          if (e.target.src !== media.image) {
                            e.target.src = media.image
                          }
                        }}
                      />
                      
                      {/* Loading placeholder */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse opacity-0 peer-loading:opacity-100" />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                        <button
                          onClick={async () => {
                            if (!confirm('Delete this image from Cloudinary?')) return
                            
                            if (media.image && media.image.includes('cloudinary')) {
                              try {
                                await uploadService.deleteFile(media.image)
                                addToast('success', 'Deleted from Cloudinary')
                              } catch (err) {
                                addToast('warning', 'Removed from gallery (Cloudinary deletion failed)')
                              }
                            }
                            
                            const currentFeatured = Array.isArray(data.gallery?.featured) 
                              ? data.gallery.featured 
                              : Object.values(data.gallery?.featured || {})
                            
                            const newGalleryData = {
                              ...data,
                              gallery: {
                                ...data.gallery,
                                featured: currentFeatured.filter((_, i) => i !== index)
                              }
                            }
                            
                            setData(newGalleryData)
                            
                            setTimeout(async () => {
                              try {
                                const result = await dataService.updateSchoolData(newGalleryData)
                                if (result.success) {
                                  addToast('success', '💾 Gallery saved automatically!')
                                }
                              } catch (err) {
                                addToast('warning', 'Delete successful but auto-save failed. Click Save Changes.')
                              }
                            }, 500)
                          }}
                          className="bg-white text-black p-3 rounded-xl hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </AdminCard>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}