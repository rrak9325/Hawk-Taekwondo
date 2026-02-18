import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// 🔹 Lazy-loaded layouts
const MainLayout = lazy(() => import('./layouts/MainLayout'))

// 🔹 Lazy-loaded public pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Programs = lazy(() => import('./pages/Programs'))
const Schedule = lazy(() => import('./pages/Schedule'))
const Faculty = lazy(() => import('./pages/Faculty'))
const Contact = lazy(() => import('./pages/Contact'))

// 🔹 Lazy-loaded admin & misc pages
const AdminNew = lazy(() => import('./pages/AdminNew'))
const NotFound = lazy(() => import('./pages/NotFound'))

// 🔹 Utilities
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary'
import WelcomeSplash from './components/WelcomeSplash'
// import QuantumParticles from './components/QuantumParticles'
// import performanceDetector from './utils/performanceDetector'

const PageLoader = () => (
  <div
    style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      gap: '1.5rem'
    }}
  >
    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
      {/* Center rotating block */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: '#DC143C',
          borderRadius: '8px',
          animation: 'centerSpin 2s ease-in-out infinite'
        }}
      />
      
      {/* Orbiting blocks */}
      {[0, 90, 180, 270].map((angle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '16px',
            height: '16px',
            background: '#1A1A1A',
            borderRadius: '4px',
            top: '50%',
            left: '50%',
            marginTop: '-8px',
            marginLeft: '-8px',
            animation: `orbit${i} 2s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`
          }}
        />
      ))}
    </div>
    
    <div style={{ 
      color: '#1A1A1A', 
      fontSize: '16px', 
      fontWeight: '600',
      opacity: '0.8',
      animation: 'fadeInOut 1.5s ease-in-out infinite'
    }}>
      Loading...
    </div>
    
    <style>{`
      @keyframes centerSpin {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(0.8) rotate(180deg); }
      }
      
      @keyframes orbit0 {
        0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        50% { transform: translate(${Math.cos(0) * 35}px, ${Math.sin(0) * 35}px) rotate(180deg) scale(1.2); }
      }
      
      @keyframes orbit1 {
        0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        50% { transform: translate(${Math.cos(Math.PI/2) * 35}px, ${Math.sin(Math.PI/2) * 35}px) rotate(180deg) scale(1.2); }
      }
      
      @keyframes orbit2 {
        0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        50% { transform: translate(${Math.cos(Math.PI) * 35}px, ${Math.sin(Math.PI) * 35}px) rotate(180deg) scale(1.2); }
      }
      
      @keyframes orbit3 {
        0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        50% { transform: translate(${Math.cos(3*Math.PI/2) * 35}px, ${Math.sin(3*Math.PI/2) * 35}px) rotate(180deg) scale(1.2); }
      }
      
      @keyframes fadeInOut {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
    `}</style>
  </div>
)

const App = () => {
  return (
    <>
      {/* Welcome Splash Screen */}
      <WelcomeSplash />
      
      {/* Quantum Particles - Only on capable devices */}
      {/* Temporarily disabled for debugging */}
      {/* {showQuantumParticles && <QuantumParticles />} */}
      
      {/* Runs once per navigation – lightweight */}
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* 🌐 Public website */}
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <MainLayout />
              </ErrorBoundary>
            }
          >
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="programs" element={<Programs />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="faculty" element={<Faculty />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* 🔐 Admin (no outer error boundary to avoid full crash screen) */}
          <Route path="/admin" element={<AdminNew />} />

          {/* ❌ 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
