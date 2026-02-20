import { shouldUseInfiniteLoops } from '../utils/devicePerformance.js'
import { SkeletonFeatureCard } from './LoadingSkeleton'

export default function LoadingFallback({ message = "Loading..." }) {
  // Modern loading for all devices
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-red-50 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-100/30 rounded-full blur-3xl bg-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-200/30 rounded-full blur-3xl bg-pulse-delayed" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 fade-in">
        {/* Modern spinner with logo concept */}
        <div className="relative w-24 h-24">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 border-4 border-gray-200 border-t-red-600 rounded-full spinner-rotate" />
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg inner-pulse" />
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full shadow-md dot-pulse" />
          </div>
        </div>

        {/* Loading text with modern animation */}
        <div className="text-center space-y-3">
          <p className="text-gray-900 font-bold text-xl tracking-wide text-pulse">
            {message}
          </p>
          
          {/* Animated dots */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full dot-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-red-600 rounded-full dot-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-red-600 rounded-full dot-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes dotPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
          }
        }
        
        @keyframes textPulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes bgPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.5;
          }
        }
        
        @keyframes dotBounce {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .spinner-rotate {
          animation: spin 1.5s linear infinite;
        }
        
        .inner-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .dot-pulse {
          animation: dotPulse 1.5s ease-in-out infinite;
        }
        
        .text-pulse {
          animation: textPulse 2s ease-in-out infinite;
        }
        
        .bg-pulse {
          animation: bgPulse 4s ease-in-out infinite;
        }
        
        .bg-pulse-delayed {
          animation: bgPulse 4s ease-in-out infinite 2s;
        }
        
        .dot-bounce {
          animation: dotBounce 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export function PageLoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonFeatureCard count={4} />
      </div>
    </div>
  )
}
