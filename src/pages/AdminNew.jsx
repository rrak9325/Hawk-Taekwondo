import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Menu, Plus, LogOut, Upload, Trash2, Moon, Sun, X, Info, Video, Package, Users, MessageSquare, Image as ImageIcon, Calendar } from 'lucide-react'
import apiService from '../services/api.js'
import AdminCard from '../components/admin/AdminCard'
import AdminInput from '../components/admin/AdminInput'
import MediaUpload from '../components/admin/MediaUpload'
import Toast from '../components/admin/Toast'

// Helper to immutably update nested state (faster than deep clone every time)
const updateNested = (obj, path, value) => {
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
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('adminToken'))
  const [toasts, setToasts] = useState([])
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState(localStorage.getItem('adminActiveTab') || 'school')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') !== 'false')

  const addToast = useCallback((type, text) => {
    const id = Date.now()
    setToasts(prev => [{ id, type, text }])

    const timeout = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const response = await apiService.adminRequest('/data')
      const result = await response.json()
      setData(result)
    } catch (error) {
      addToast('error', error.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    if (isAuthenticated) fetchData()
  }, [isAuthenticated, fetchData])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const result = await apiService.login(loginForm)
      sessionStorage.setItem('adminToken', result.token)
      setIsAuthenticated(true)
      addToast('success', 'Welcome back boss')
    } catch (error) {
      addToast('error', error.message || 'Login failed')
    }
  }

  // Better update function — no deep clone needed every time
  const updateField = useCallback((path, value) => {
    setData(prev => {
      if (!prev) return prev
      return updateNested(prev, path, value)
    })
  }, [])

  const handleSave = async () => {
    if (!data) return
    setSaving(true)
    try {
      await apiService.saveData(data)
      addToast('success', 'Saved! Site content updated 🔥')
    } catch (error) {
      addToast('error', `Save failed: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = useCallback(async (path, e) => {
    // Check if this is from the new MediaUpload component with result
    if (e.result) {
      // New optimized upload system
      updateField(path, e.result.url)
      addToast('success', `🔥 BEAST MODE: ${e.result.savings} compression! Format: ${e.result.format}`)
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

    if (file.size > 200 * 1024 * 1024) { // Increased to 200MB for BEAST MODE
      addToast('error', `File too big (${(file.size / 1024 / 1024).toFixed(1)}MB) — max 200MB`)
      return
    }

    try {
      addToast('info', `🚀 BEAST MODE uploading ${file.name}...`)
      const result = await apiService.uploadFile(file)
      updateField(path, result.url)
      
      // Show compression stats if available
      if (result.compressionRatio) {
        addToast('success', `🔥 ${file.name} uploaded! ${result.savings} compression (${result.format})`)
      } else {
        addToast('success', `${file.name} uploaded!`)
      }
    } catch (error) {
      addToast('error', `Upload failed: ${error.message}`)
    }
  }, [updateField, addToast])

  const handleLogout = () => {
    if (!confirm('Logout for real?')) return
    sessionStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setActiveTab('school')
    localStorage.setItem('adminActiveTab', 'school')
  }

  const navItems = useMemo(() => [
    { id: 'school', icon: Info, label: 'School Info', color: 'blue' },
    { id: 'media', icon: Video, label: 'Media', color: 'purple' },
    { id: 'programs', icon: Package, label: 'Programs', color: 'green' },
    { id: 'schedule', icon: Calendar, label: 'Schedule', color: 'orange' },
    { id: 'instructors', icon: Users, label: 'Instructors', color: 'pink' },
    { id: 'testimonials', icon: MessageSquare, label: 'Testimonials', color: 'yellow' },
    { id: 'gallery', icon: ImageIcon, label: 'Gallery', color: 'cyan' }
  ], [])

  const colorMap = useMemo(() => ({
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    pink: 'from-pink-500 to-rose-500',
    yellow: 'from-yellow-500 to-orange-500',
    cyan: 'from-cyan-500 to-blue-500'
  }), [])

  if (loading && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Cute admin loader */}
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4">
        <Toast toasts={toasts} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/60 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-purple-500/30 w-full max-w-md shadow-2xl"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-600/40">
              <Lock className="text-white" size={32} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-2">Admin Zone</h2>
          <p className="text-slate-400 text-center mb-8 text-sm">Welcome back</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <AdminInput
              label="Username"
              value={loginForm.username}
              onChange={v => setLoginForm(prev => ({ ...prev, username: v }))}
              darkMode={true}
            />

            <div className="relative">
              <AdminInput
                label="Password"
                type={showPassword ? "text" : "password"}
                value={loginForm.password}
                onChange={v => setLoginForm(prev => ({ ...prev, password: v }))}
                darkMode={true}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-4 top-[42px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-3.5 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Signing in..." : "Enter"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-8">
            Wrong link? Just bounce back.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'} transition-colors duration-300`}>
      <Toast toasts={toasts} />

      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 ${darkMode ? 'bg-slate-900/95' : 'bg-white'} backdrop-blur-xl border-r ${darkMode ? 'border-slate-800' : 'border-slate-200'} hidden lg:flex flex-col z-50`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Hawk Admin</span>
        </div>

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
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => {
              const newMode = !darkMode
              setDarkMode(newMode)
              localStorage.setItem('darkMode', newMode)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">{darkMode ? 'Light' : 'Dark'} Mode</span>
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className={`absolute left-0 top-0 bottom-0 w-80 ${darkMode ? 'bg-slate-900' : 'bg-white'} shadow-2xl`}>
            <div className={`p-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">H</span>
                  </div>
                  <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Hawk Admin
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                >
                  <X size={24} className={darkMode ? 'text-white' : 'text-slate-900'} />
                </button>
              </div>
            </div>

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
                    <Icon size={22} />
                    <span className="font-medium text-lg">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            <div className={`p-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'} space-y-2`}>
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
                {darkMode ? <Sun size={22} /> : <Moon size={22} />}
                <span className="font-medium text-lg">{darkMode ? 'Light' : 'Dark'} Mode</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  handleLogout()
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl ${
                  darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LogOut size={22} />
                <span className="font-medium text-lg">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <header className={`sticky top-0 z-40 ${darkMode ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-xl border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'} px-4 lg:px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`lg:hidden p-2 rounded-lg ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              >
                <Menu size={24} className={darkMode ? 'text-white' : 'text-slate-900'} />
              </button>
              <h1 className={`text-lg lg:text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {navItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 lg:px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 text-sm lg:text-base"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </header>

        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Memoize content per tab to avoid re-creating on every render */}
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
                      onDelete={() => updateField(`${page}.hero.backgroundImage`, '')}
                      darkMode={darkMode}
                    />
                    <MediaUpload
                      label="Video"
                      value={data[page].hero.videoUrl}
                      onUpload={e => handleUpload(`${page}.hero.videoUrl`, e)}
                      onDelete={() => updateField(`${page}.hero.videoUrl`, '')}
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
                  setData(prev => ({
                    ...prev,
                    programs: [newProgram, ...(prev.programs || [])]
                  }))
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg hover:shadow-green-500/30 transition-all"
              >
                <Plus size={18} className="inline mr-2" /> Add Program
              </button>

              {(data.programs || []).map((program, index) => (
                <AdminCard
                  key={program.id}
                  title={program.name || 'Unnamed Program'}
                  darkMode={darkMode}
                  onDelete={() => {
                    if (!confirm('Delete this program?')) return
                    setData(prev => {
                      const newPrograms = [...prev.programs]
                      newPrograms.splice(index, 1)
                      return { ...prev, programs: newPrograms }
                    })
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <MediaUpload
                      value={program.image}
                      onUpload={e => handleUpload(`programs.${index}.image`, e)}
                      onDelete={() => updateField(`programs.${index}.image`, '')}
                      darkMode={darkMode}
                    />
                    <div className="space-y-4">
                      <AdminInput
                        label="Name"
                        value={program.name || ''}
                        onChange={v => updateField(`programs.${index}.name`, v)}
                        darkMode={darkMode}
                      />
                      <AdminInput
                        label="Description"
                        value={program.description || ''}
                        onChange={v => updateField(`programs.${index}.description`, v)}
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
                    bio: '',
                    image: ''
                  }
                  setData(prev => ({
                    ...prev,
                    instructors: [newInstructor, ...(prev.instructors || [])]
                  }))
                }}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg hover:shadow-pink-500/30 transition-all"
              >
                <Plus size={18} className="inline mr-2" /> Add Instructor
              </button>

              {(data.instructors || []).map((instructor, index) => (
                <AdminCard
                  key={instructor.id}
                  title={instructor.name || 'Unnamed'}
                  darkMode={darkMode}
                  onDelete={() => {
                    if (!confirm('Delete this instructor?')) return
                    setData(prev => {
                      const newList = [...prev.instructors]
                      newList.splice(index, 1)
                      return { ...prev, instructors: newList }
                    })
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <MediaUpload
                      value={instructor.image}
                      onUpload={e => handleUpload(`instructors.${index}.image`, e)}
                      onDelete={() => updateField(`instructors.${index}.image`, '')}
                      rounded
                      darkMode={darkMode}
                    />
                    <div className="lg:col-span-2 space-y-4">
                      <AdminInput
                        label="Name"
                        value={instructor.name || ''}
                        onChange={v => updateField(`instructors.${index}.name`, v)}
                        darkMode={darkMode}
                      />
                      <AdminInput
                        label="Rank"
                        value={instructor.rank || ''}
                        onChange={v => updateField(`instructors.${index}.rank`, v)}
                        darkMode={darkMode}
                      />
                      <AdminInput
                        label="Bio"
                        value={instructor.bio || ''}
                        onChange={v => updateField(`instructors.${index}.bio`, v)}
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
                  setData(prev => ({
                    ...prev,
                    testimonials: [newTestimonial, ...(prev.testimonials || [])]
                  }))
                }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg hover:shadow-orange-500/30 transition-all"
              >
                <Plus size={18} className="inline mr-2" /> Add Testimonial
              </button>

              {(data.testimonials || []).map((testimonial, index) => (
                <AdminCard
                  key={testimonial.id}
                  title={testimonial.name || 'Anonymous'}
                  darkMode={darkMode}
                  onDelete={() => {
                    if (!confirm('Delete this testimonial?')) return
                    setData(prev => {
                      const newList = [...prev.testimonials]
                      newList.splice(index, 1)
                      return { ...prev, testimonials: newList }
                    })
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <MediaUpload
                      value={testimonial.image}
                      onUpload={e => handleUpload(`testimonials.${index}.image`, e)}
                      onDelete={() => updateField(`testimonials.${index}.image`, '')}
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
                  {/* Batches Management */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Class Batches
                      </h3>
                      <button
                        onClick={() => {
                          const newBatch = {
                            name: 'New Batch',
                            days: ['Monday'],
                            time: '6:00 PM - 7:00 PM',
                            ageGroup: 'Ages 18+',
                            description: 'New class batch'
                          }
                          setData(prev => ({
                            ...prev,
                            classSchedule: {
                              ...prev.classSchedule,
                              batches: [...(prev.classSchedule?.batches || []), newBatch]
                            }
                          }))
                        }}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-orange-500/30 transition-all"
                      >
                        <Plus size={18} className="inline mr-2" /> Add Batch
                      </button>
                    </div>

                    <div className="grid gap-6">
                      {(data.classSchedule?.batches || []).map((batch, index) => (
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
                                  const newBatches = [...prev.classSchedule.batches]
                                  newBatches.splice(index, 1)
                                  return {
                                    ...prev,
                                    classSchedule: {
                                      ...prev.classSchedule,
                                      batches: newBatches
                                    }
                                  }
                                })
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
                              <div className="grid grid-cols-4 gap-2">
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
                                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
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

                  {/* Quick Schedule Preview */}
                  <div>
                    <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Schedule Preview
                    </h3>
                    <div className={`p-6 rounded-2xl ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
                    } border`}>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                          const dayClasses = (data.classSchedule?.batches || []).filter(batch => 
                            (batch.days || []).includes(day)
                          )
                          
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
                <label className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-3 rounded-xl font-medium cursor-pointer shadow-lg hover:shadow-cyan-500/30 transition-all">
                  <Upload size={18} /> Upload Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || [])
                      if (!files.length) return

                      const uploaded = []
                      for (const file of files) {
                        try {
                          const res = await apiService.uploadFile(file)
                          uploaded.push({
                            id: Date.now() + Math.random(),
                            image: res.url,
                            title: ''
                          })
                        } catch (err) {
                          addToast('error', `Failed: ${file.name}`)
                        }
                      }

                      if (uploaded.length > 0) {
                        setData(prev => ({
                          ...prev,
                          gallery: {
                            ...prev.gallery,
                            featured: [...uploaded, ...(prev.gallery?.featured || [])]
                          }
                        }))
                        addToast('success', `${uploaded.length} image${uploaded.length > 1 ? 's' : ''} added`)
                      }
                    }}
                  />
                </label>

                <button
                  onClick={async () => {
                    if (!confirm('Clean unused media files?')) return
                    try {
                      const res = await apiService.cleanupFiles()
                      addToast('success', `Cleaned ${res.deletedCount} files`)
                      fetchData()
                    } catch {
                      addToast('error', 'Cleanup failed')
                    }
                  }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  <Trash2 size={18} className="inline mr-2" /> Clean Media
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {(data.gallery?.featured || []).map((media, index) => (
                  <div
                    key={media.id}
                    className={`aspect-square rounded-2xl overflow-hidden relative group ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}
                  >
                    <img
                      src={media.image}
                      className="w-full h-full object-cover"
                      alt="gallery"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          if (!confirm('Delete this image?')) return
                          setData(prev => {
                            const newFeatured = [...prev.gallery.featured]
                            newFeatured.splice(index, 1)
                            return {
                              ...prev,
                              gallery: { ...prev.gallery, featured: newFeatured }
                            }
                          })
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
      </main>
    </div>
  )
}