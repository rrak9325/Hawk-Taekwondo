import { useState } from 'react'
import { Upload, Trash2, CheckCircle, AlertCircle, Zap } from 'lucide-react'

export default function MediaUpload({ 
  label, 
  value, 
  onUpload, 
  onDelete, 
  isVideo, 
  rounded, 
  darkMode 
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [compressionStats, setCompressionStats] = useState(null)

  // Debug logging - removed for production

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadProgress(0)
    setCompressionStats(null)

    try {
      // Simulate progress for user feedback
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Create FormData and upload
      const formData = new FormData()
      formData.append('file', file)

      // Use the API client for consistent handling
      const uploadService = (await import('../../services/uploadService.js')).default
      const result = await uploadService.uploadFile(file)

      if (!result.success) {
        throw new Error(result.error || 'Upload failed')
      }

      // Complete progress
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Set compression stats if available
      if (result.data.compressionRatio) {
        setCompressionStats({
          savings: result.data.savings || `${result.data.compressionRatio}%`,
          originalSize: result.data.originalSize,
          optimizedSize: result.data.optimizedSize,
          format: result.data.format
        })
      }

      // Call the original upload handler with the result
      if (onUpload) {
        // Create a mock event with the result
        const mockEvent = {
          target: {
            files: [file]
          },
          result: result.data
        }
        await onUpload(mockEvent)
      }

      // Show success briefly
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 1500)

    } catch (error) {
      console.error('Upload error:', error)
      setUploading(false)
      setUploadProgress(0)
      setCompressionStats(null)
      
      // Show error to user
      alert(`Upload failed: ${error.message}`)
    }
  }

  return (
    <div>
      {label && (
        <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">
          {label}
        </label>
      )}
      
      <div className={`relative aspect-video ${
        rounded ? 'aspect-square rounded-full' : 'rounded-xl'
      } ${
        darkMode ? 'bg-slate-800' : 'bg-slate-200'
      } overflow-hidden group cursor-pointer border-2 border-dashed ${
        uploading ? 'border-primary animate-pulse' : 'border-transparent'
      }`}>
        
        {/* Upload Progress Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
            <div className="w-16 h-16 mb-4">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-slate-600"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - uploadProgress / 100)}`}
                  className="text-primary transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{uploadProgress}%</span>
              </div>
            </div>
            <div className="text-white text-sm font-medium">
              {uploadProgress < 90 ? 'Uploading...' : 'Optimizing...'}
            </div>
            {uploadProgress === 100 && (
              <div className="flex items-center gap-2 mt-2 text-green-400">
                <CheckCircle size={16} />
                <span className="text-sm">Complete!</span>
              </div>
            )}
          </div>
        )}

        {value ? (
          <>
            {isVideo ? (
              <video 
                src={value} 
                className="w-full h-full object-cover" 
                muted 
                loop 
                autoPlay
                onError={(e) => {
                  console.error('Video load error:', e.target.src)
                }}
              />
            ) : (
              <img 
                src={value} 
                className="w-full h-full object-cover" 
                alt="Upload preview"
                loading="lazy"
                onError={(e) => {
                  console.error('Image load error:', e.target.src)
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', value)
                }}
              />
            )}
            
            {/* Hover Controls */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
              <button 
                onClick={onDelete} 
                className="bg-white text-black p-3 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-lg"
              >
                <Trash2 size={18} />
              </button>
              
              {/* Replace button */}
              <label className="bg-white text-black p-3 rounded-lg hover:bg-primary hover:text-white transition-all shadow-lg cursor-pointer">
                <Upload size={18} />
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleUpload} 
                  accept={isVideo ? "video/*" : "image/*"}
                />
              </label>
            </div>

            {/* Compression Stats Badge */}
            {compressionStats && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Zap size={12} />
                {compressionStats.savings}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0">
            {/* Mobile: Single gallery button */}
            <div className="md:hidden absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className={`p-4 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-300'} mb-2`}>
                <Upload size={32} className="text-slate-500" />
              </div>
              
              <label className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} cursor-pointer transition-colors`}>
                <div className="text-2xl">📱</div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Select from Gallery</span>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleUpload} 
                  accept={isVideo ? "video/*" : "image/*"}
                />
              </label>
              
              <span className="text-xs text-slate-400 text-center px-4">
                {isVideo ? 'Upload Video' : 'Upload Image'}<br/>
                {isVideo ? 'MP4, WebM, MOV, etc.' : 'JPG, PNG, WebP, etc.'} • No size limit
              </span>
            </div>

            {/* Desktop: Single upload button */}
            <label className="hidden md:flex absolute inset-0 flex-col items-center justify-center cursor-pointer hover:bg-slate-300/20 transition-colors">
              <div className={`p-4 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-300'} mb-3`}>
                <Upload size={32} className="text-slate-500" />
              </div>
              <span className="text-sm font-medium text-slate-500 mb-1">
                {isVideo ? 'Upload Video' : 'Upload Image'}
              </span>
              <span className="text-xs text-slate-400">
                {isVideo ? 'MP4, WebM, MOV, etc.' : 'JPG, PNG, WebP, etc.'}
              </span>
              <span className="text-xs text-slate-400 mt-1">
                No size limit
              </span>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleUpload} 
                accept={isVideo ? "video/*" : "image/*"} 
              />
            </label>
          </div>
        )}
      </div>

      {/* Upload Tips */}
      {!value && (
        <div className="mt-2 text-xs text-slate-400">
          💡 {isVideo ? 'Videos will be saved directly without processing' : 'Images will be automatically optimized and compressed'}
        </div>
      )}
    </div>
  )
}