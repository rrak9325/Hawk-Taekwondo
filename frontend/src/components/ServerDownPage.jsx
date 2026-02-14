import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export default function ServerDownPage() {
  const [kickAnimation, setKickAnimation] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setKickAnimation(true)
      setTimeout(() => setKickAnimation(false), 1000)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-circle absolute top-20 left-10 w-32 h-32 bg-red-200/30 rounded-full" />
        <div className="floating-circle absolute top-40 right-20 w-24 h-24 bg-red-300/20 rounded-full" style={{ animationDelay: '1s' }} />
        <div className="floating-circle absolute bottom-32 left-1/4 w-40 h-40 bg-red-100/40 rounded-full" style={{ animationDelay: '2s' }} />
        <div className="floating-circle absolute bottom-20 right-1/3 w-28 h-28 bg-red-200/25 rounded-full" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          {/* Animated Taekwondo Fighter */}
          <div className="relative inline-block mb-8">
            <div className={`fighter-container ${kickAnimation ? 'kicking' : ''}`}>
              {/* Head */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full border-4 border-white shadow-lg">
                {/* Eyes */}
                <div className="absolute top-5 left-3 w-2 h-2 bg-white rounded-full animate-blink" />
                <div className="absolute top-5 right-3 w-2 h-2 bg-white rounded-full animate-blink" />
                {/* Mouth */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full" />
              </div>

              {/* Body */}
              <div className="relative mt-16 w-20 h-24 mx-auto bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-xl">
                {/* Belt */}
                <div className="absolute top-1/2 left-0 right-0 h-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 transform -translate-y-1/2" />
              </div>

              {/* Arms */}
              <div className="arm-left absolute top-20 left-8 w-12 h-4 bg-gradient-to-r from-red-600 to-red-700 rounded-full transform origin-left rotate-45" />
              <div className="arm-right absolute top-20 right-8 w-12 h-4 bg-gradient-to-l from-red-600 to-red-700 rounded-full transform origin-right -rotate-45" />

              {/* Legs */}
              <div className="leg-left absolute bottom-0 left-6 w-5 h-16 bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg" />
              <div className="leg-right absolute bottom-0 right-6 w-5 h-16 bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg kick-leg" />

              {/* Kick effect */}
              <div className="kick-effect absolute -right-20 top-1/2 transform -translate-y-1/2">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping" />
                  <div className="absolute inset-2 bg-red-600/40 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-5xl md:text-7xl font-black text-red-600 mb-6 animate-bounce-slow">
            Server Down!
          </h1>
          
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 animate-fade-in">
            Our dojo is temporarily closed
          </p>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            We're practicing our moves and will be back stronger! 🥋
          </p>

          {/* Retry Button */}
          <button
            onClick={() => window.location.reload()}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-full text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>

          {/* Fun Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="stat-card bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-red-100">
              <div className="text-4xl font-black text-red-600 mb-2 counter">503</div>
              <div className="text-sm text-gray-600 font-semibold">Error Code</div>
            </div>
            <div className="stat-card bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-red-100" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-black text-red-600 mb-2 counter">∞</div>
              <div className="text-sm text-gray-600 font-semibold">Kicks Practiced</div>
            </div>
            <div className="stat-card bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-red-100" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-black text-red-600 mb-2 counter">100%</div>
              <div className="text-sm text-gray-600 font-semibold">Coming Back</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        @keyframes kick {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          50% { transform: rotate(-45deg) translateX(30px); }
        }

        @keyframes kickEffect {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes blink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes floatingCircle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          33% { transform: translate(30px, -30px) scale(1.1); opacity: 0.5; }
          66% { transform: translate(-20px, 20px) scale(0.9); opacity: 0.4; }
        }

        @keyframes statCard {
          from { opacity: 0; transform: translateY(30px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .floating-circle {
          animation: floatingCircle 8s ease-in-out infinite;
        }

        .fighter-container {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto;
          animation: float 3s ease-in-out infinite;
        }

        .fighter-container.kicking .kick-leg {
          animation: kick 1s ease-in-out;
        }

        .fighter-container.kicking .kick-effect {
          animation: kickEffect 1s ease-in-out;
        }

        .animate-blink {
          animation: blink 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }

        .stat-card {
          animation: statCard 0.6s ease-out forwards;
          opacity: 0;
        }

        .counter {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </div>
  )
}
