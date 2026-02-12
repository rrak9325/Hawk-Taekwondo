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
      gap: '1rem'
    }}
  >
    <div style={{ position: 'relative' }}>
      <div 
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid transparent',
          borderTop: '3px solid #DC143C',
          borderRight: '3px solid #1A1A1A',
          borderRadius: '50%',
          animation: 'spin 1.5s linear infinite'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '12px',
          height: '12px',
          background: 'linear-gradient(45deg, #DC143C, #1A1A1A)',
          borderRadius: '50%',
          animation: 'pulse 1.2s ease-in-out infinite'
        }}
      />
    </div>
    <div style={{ 
      color: '#1A1A1A', 
      fontSize: '14px', 
      fontWeight: '500',
      opacity: '0.8'
    }}>
      ✨ Loading...
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.7; }
      }
    `}</style>
  </div>
)

const App = () => {
  return (
    <>
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
