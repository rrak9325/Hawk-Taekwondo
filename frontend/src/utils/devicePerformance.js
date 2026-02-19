/**
 * DEVICE PERFORMANCE DETECTION
 * Detects device capabilities and returns performance tier
 * Used to adaptively scale animations and effects
 */

// Detect if device is low-end based on hardware specs
export const isLowEndDevice = (() => {
  // Check device memory (RAM)
  const hasLowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory <= 2
  
  // Check CPU cores
  const hasLowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4
  
  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  // If any indicator shows low-end, treat as low-end
  return hasLowMemory || hasLowCPU || prefersReducedMotion
})()

// Detect mid-tier devices
export const isMidTierDevice = (() => {
  if (isLowEndDevice) return false
  
  const memory = navigator.deviceMemory
  const cores = navigator.hardwareConcurrency
  
  // Mid-tier: 4GB RAM or 4-6 cores
  const isMidMemory = memory !== undefined && memory > 2 && memory <= 4
  const isMidCPU = cores !== undefined && cores > 4 && cores <= 6
  
  return isMidMemory || isMidCPU
})()

// High-end devices get full experience
export const isHighEndDevice = !isLowEndDevice && !isMidTierDevice

// Performance tier (1 = low, 2 = mid, 3 = high)
export const performanceTier = isLowEndDevice ? 1 : isMidTierDevice ? 2 : 3

// Animation configuration based on tier
export const animationConfig = {
  // Tier 1: Low-end - CSS only, no Framer Motion
  low: {
    useFramerMotion: false,
    useScrollAnimations: false,
    useInfiniteLoops: false,
    useBlur: false,
    useHeavyShadows: false,
    useParallax: false,
    transitionDuration: 0.2
  },
  
  // Tier 2: Mid - Entrance animations only
  mid: {
    useFramerMotion: true,
    useScrollAnimations: false,
    useInfiniteLoops: false,
    useBlur: false,
    useHeavyShadows: false,
    useParallax: false,
    transitionDuration: 0.3
  },
  
  // Tier 3: High-end - Full experience
  high: {
    useFramerMotion: true,
    useScrollAnimations: true,
    useInfiniteLoops: true,
    useBlur: true,
    useHeavyShadows: true,
    useParallax: true,
    transitionDuration: 0.5
  }
}

// Get current config based on device
export const currentAnimationConfig = 
  performanceTier === 1 ? animationConfig.low :
  performanceTier === 2 ? animationConfig.mid :
  animationConfig.high

// Helper to conditionally apply motion props
export const getMotionProps = (props) => {
  if (!currentAnimationConfig.useFramerMotion) {
    return {}
  }
  return props
}

// Helper for scroll animations
export const shouldUseScrollAnimations = () => currentAnimationConfig.useScrollAnimations

// Helper for infinite loops
export const shouldUseInfiniteLoops = () => currentAnimationConfig.useInfiniteLoops

// Log performance tier on load (dev only)
if (import.meta.env.DEV) {
  console.log('🎯 Performance Tier:', performanceTier)
  console.log('📊 Device Memory:', navigator.deviceMemory, 'GB')
  console.log('🔧 CPU Cores:', navigator.hardwareConcurrency)
  console.log('⚙️ Animation Config:', currentAnimationConfig)
}

export default {
  isLowEndDevice,
  isMidTierDevice,
  isHighEndDevice,
  performanceTier,
  animationConfig,
  currentAnimationConfig,
  getMotionProps,
  shouldUseScrollAnimations,
  shouldUseInfiniteLoops
}
