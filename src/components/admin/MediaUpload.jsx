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

      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': token
        },
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      // Complete progress
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Set compression stats if available
      if (result.compressionRatio) {
        setCompressionStats({
          savings: result.savings || `${result.compressionRatio}%`,
          originalSize: result.originalSize,
          optimizedSize: result.optimizedSize,
          format: result.format
        })
      }

      // Call the original upload handler with the result
      if (onUpload) {
        // Create a mock event with the result
        const mockEvent = {
          target: {
            files: [file]
          },
          result: result
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
              />
            ) : (
              <img 
                src={value} 
                className="w-full h-full object-cover" 
                alt="Upload preview"
                loading="lazy"
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
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-300/20 transition-colors">
            <div className={`p-4 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-300'} mb-3`}>
              <Upload size={32} className="text-slate-500" />
            </div>
            <span className="text-sm font-medium text-slate-500 mb-1">
              {isVideo ? 'Upload Video' : 'Upload Image'}
            </span>
            <span className="text-xs text-slate-400">
              {isVideo ? 'MP4, WebM, MOV' : 'JPG, PNG, WebP'}
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Max: {isVideo ? '200MB' : '50MB'}
            </span>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleUpload} 
              accept={isVideo ? "video/*" : "image/*"} 
            />
          </label>
        )}
      </div>

      {/* Upload Tips */}
      {!value && (
        <div className="mt-2 text-xs text-slate-400">
          💡 High-quality images will be automatically optimized and compressed
        </div>
      )}
    </div>
  )
}