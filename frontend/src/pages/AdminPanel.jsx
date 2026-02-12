import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, Eye, EyeOff, Menu, Plus, LogOut, Upload, Trash2, Moon, Sun, X, 
  Info, Video, Package, Users, MessageSquare, Image as ImageIcon, 
  Calendar, Save, TestTube, Settings, Home
} from 'lucide-react'
import { authService, dataService, uploadService } from '../services/index.js'

// Toast Component
const Toast = ({ toasts }) => (
  <div className="fixed top-4 right-4 z-[9999] space-y-2">
    <AnimatePresence>
      {toasts.map(toast => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className={`p-4 rounded-lg shadow-lg max-w-sm ${
            toast.type === 'success' ? 'bg-green-500 text-white' :
            toast.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}
        >
          <div className="font-medium">{toast.type.toUpperCase()}</div>
          <div className="text-sm">{toast.text}</div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
)

// Media Preview Component
const MediaPreview = ({ src, type, alt, className = "" }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  if (!src) return null

  if (type === 'video' || src.includes('.mp4') || src.includes('.webm') || src.includes('.mov')) {
    return (
      <video
        src={src}
        className={`w-full h-full object-cover ${className}`}
        controls
        preload="metadata"
        onLoadStart={() => setLoading(true)}
        onLoadedData={() => setLoading(false)}
        onError={() => setError(true)}
      >
        Your browser does not support video playback.
      </video>
    )
  }

  return (
    <img
      src={src}
      alt={alt || 'Preview'}
      className={`w-full h-full object-cover ${className}`}
      loading="lazy"
      onLoad={() => setLoading(false)}
      onError={() => setError(true)}
    />
  )
}

// Upload Area Component
const UploadArea = ({ value, onUpload, onDelete, label, accept = "image/*,video/*" }) => {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await uploadService.uploadFile(file)
      if (result.success) {
        onUpload(result.data.url)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
      {value ? (
        <div className="relative group">
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
            <MediaPreview src={value} />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="bg-white text-black px-3 py-2 rounded cursor-pointer hover:bg-gray-100">
              <Upload size={16} />
              <input type="file" className="hidden" accept={accept} onChange={handleUpload} />
            </label>
            <button
              onClick={onDelete}
              className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-32 cursor-pointer">
          <Upload size={32} className="text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">{label || 'Upload Media'}</span>
          <input 
            type="file" 
            className="hidden" 
            accept={accept} 
            onChange={handleUpload}
            disabled={uploading}
          />
          {uploading && <div className="text-xs text-blue-500 mt-1">Uploading...</div>}
        </label>
      )}
    </div>
  )
}

// Input Component
const Input = ({ label, value, onChange, type = "text", placeholder, textarea = false, ...props }) => {
  const Component = textarea ? 'textarea' : 'input'
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Component
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={textarea ? 4 : undefined}
        {...props}
      />
    </div>
  )
}

// Card Component
const Card = ({ title, children, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {onDelete && (
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 p-1"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
    {children}
  </div>
)

export default function AdminPanel() {
  // State
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])
  const [activeTab, setActiveTab] = useState('school')
  const [sidebarOpen, setSidebarOpen] = useState(false)}