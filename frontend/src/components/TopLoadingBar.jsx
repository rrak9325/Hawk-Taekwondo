import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const TopLoadingBar = () => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const location = useLocation()

  useEffect(() => {
    setLoading(true)
    setProgress(0)
    
    // Simulate progress
    const progressSteps = [30, 70, 95]
    const timings = [100, 400, 700]
    
    const timers = progressSteps.map((step, i) => 
      setTimeout(() => setProgress(step), timings[i])
    )
    
    const hideTimer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setLoading(false), 300)
    }, 800)
    
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(hideTimer)
    }
  }, [location])

  if (!loading) return null

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] bg-gradient-to-r from-red-600 via-secondary to-red-600 loading-bar"
      style={{ 
        width: `${progress}%`,
        opacity: progress === 100 ? 0 : 1
      }}
    >
      <style>{`
        .loading-bar {
          transition: width 0.3s ease-out, opacity 0.3s ease-out;
          box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
        }
      `}</style>
    </div>
  )
}

export default TopLoadingBar
