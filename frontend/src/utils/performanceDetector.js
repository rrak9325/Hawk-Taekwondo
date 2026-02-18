// Performance Detection Utility
// Detects device capabilities and provides adaptive performance tiers

class PerformanceDetector {
  constructor() {
    this.tier = null
    this.capabilities = null
    this.reducedMotion = false
    this.init()
  }

  init() {
    this.detectReducedMotion()
    this.detectCapabilities()
    this.determineTier()
  }

  detectReducedMotion() {
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.reducedMotion = mediaQuery.matches
    
    // Listen for changes
    mediaQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches
    })
  }

  detectCapabilities() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      this.capabilities = { tier: 'low' }
      return
    }

    const capabilities = {
      // CPU cores
      cores: navigator.hardwareConcurrency || 2,
      
      // Memory (in GB) - only available in Chrome
      memory: navigator.deviceMemory || 4,
      
      // Connection speed
      connection: this.getConnectionSpeed(),
      
      // Screen size
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      
      // Pixel ratio
      pixelRatio: window.devicePixelRatio || 1,
      
      // Touch device
      isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      
      // Mobile detection
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    }

    this.capabilities = capabilities
  }

  getConnectionSpeed() {
    if (typeof navigator === 'undefined' || !navigator.connection) {
      return 'unknown'
    }

    const conn = navigator.connection
    const effectiveType = conn.effectiveType || 'unknown'
    
    // Map to simple categories
    const speedMap = {
      'slow-2g': 'slow',
      '2g': 'slow',
      '3g': 'medium',
      '4g': 'fast',
      '5g': 'fast'
    }
    
    return speedMap[effectiveType] || 'medium'
  }

  determineTier() {
    if (this.reducedMotion) {
      this.tier = 'minimal'
      return
    }

    const { cores, memory, isMobile, screenWidth } = this.capabilities

    // High-end: Desktop with good specs
    if (!isMobile && cores >= 8 && memory >= 8 && screenWidth >= 1920) {
      this.tier = 'high'
    }
    // Medium: Good mobile or average desktop
    else if (cores >= 4 && memory >= 4) {
      this.tier = 'medium'
    }
    // Low: Budget devices
    else {
      this.tier = 'low'
    }
  }

  getTier() {
    return this.tier
  }

  shouldAnimate() {
    return !this.reducedMotion && this.tier !== 'minimal'
  }

  getAnimationConfig() {
    if (this.reducedMotion || this.tier === 'minimal') {
      return {
        duration: 0,
        enabled: false,
        particleCount: 0,
        complexAnimations: false
      }
    }

    switch (this.tier) {
      case 'high':
        return {
          duration: 1,
          enabled: true,
          particleCount: 15,
          complexAnimations: true,
          orbCount: 8
        }
      case 'medium':
        return {
          duration: 0.6,
          enabled: true,
          particleCount: 8,
          complexAnimations: false,
          orbCount: 4
        }
      case 'low':
        return {
          duration: 0.3,
          enabled: true,
          particleCount: 3,
          complexAnimations: false,
          orbCount: 2
        }
      default:
        return {
          duration: 0.3,
          enabled: true,
          particleCount: 3,
          complexAnimations: false,
          orbCount: 2
        }
    }
  }

  // FPS Monitor
  startFPSMonitor(callback) {
    if (typeof window === 'undefined') return

    let lastTime = performance.now()
    let frames = 0
    let fps = 60

    const measureFPS = (currentTime) => {
      frames++
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime))
        frames = 0
        lastTime = currentTime
        
        if (callback) callback(fps)
        
        // Auto-downgrade if FPS drops below 30
        if (fps < 30 && this.tier !== 'low') {
          console.warn('Low FPS detected, downgrading performance tier')
          this.tier = 'low'
        }
      }
      
      requestAnimationFrame(measureFPS)
    }

    requestAnimationFrame(measureFPS)
  }
}

// Singleton instance
const performanceDetector = new PerformanceDetector()

export default performanceDetector
