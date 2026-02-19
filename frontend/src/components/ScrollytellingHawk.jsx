import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollytellingHawk() {
  const hawkRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasLanded, setHasLanded] = useState(false)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const hawk = hawkRef.current
    const navbarEagle = document.querySelector('.navbar-eagle')
    const todaySection = document.querySelector('.today-section')
    
    if (!hawk || !todaySection) {
      if (import.meta.env.DEV) {
        console.log('Missing elements:', { hawk: !!hawk, todaySection: !!todaySection })
      }
      return
    }

    if (import.meta.env.DEV) {
      console.log('Eagle initialized!')
    }
    
    // Intersection Observer to pause animation when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    
    observer.observe(hawk)

    // Create zigzag timeline that goes to TODAY and STAYS there
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.about-page-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => {
          // Fade out navbar eagle when scrollytelling starts
          if (self.progress > 0.01) {
            setIsVisible(true)
            if (navbarEagle) navbarEagle.style.opacity = '0'
          }
          
          // Mark as landed when we reach 70% of the scroll
          if (self.progress >= 0.7 && !hasLanded) {
            if (import.meta.env.DEV) {
              console.log('🦅 EAGLE LANDED!')
            }
            setHasLanded(true)
          }
          
          if (import.meta.env.DEV) {
            console.log('Scroll progress:', self.progress)
          }
        }
      }
    })

    // Zigzag waypoints - FIXED to prevent upward movement
    // Start from a safe position below the navbar
    // All top values are constrained to stay within viewport
    tl.fromTo(hawk, 
      {
        left: '15vw',
        top: 'max(20vh, 100px)', // Ensure minimum distance from top
        scale: 0.8,
        rotation: 0,
        opacity: 0
      },
      {
        left: '15vw',
        top: 'max(20vh, 100px)',
        scale: 1,
        rotation: -10,
        opacity: 1,
        duration: 0.1,
        ease: 'power1.inOut'
      }
    )
    .to(hawk, {
      left: '75vw',
      top: 'max(30vh, 150px)', // Constrained minimum
      scale: 1.3,
      rotation: 15,
      duration: 0.12,
      ease: 'power1.inOut'
    })
    .to(hawk, {
      left: '25vw',
      top: 'max(45vh, 200px)', // Constrained minimum
      scale: 1.8,
      rotation: -12,
      duration: 0.12,
      ease: 'power1.inOut'
    })
    .to(hawk, {
      left: '70vw',
      top: 'max(60vh, 300px)', // Constrained minimum
      scale: 2.2,
      rotation: 10,
      duration: 0.12,
      ease: 'power1.inOut'
    })
    .to(hawk, {
      left: '35vw',
      top: 'max(75vh, 400px)', // Constrained minimum
      scale: 2.8,
      rotation: -5,
      duration: 0.12,
      ease: 'power1.inOut'
    })
    // Final landing position - eagle lands and STAYS at TODAY
    .to(hawk, {
      left: '50%',
      top: '50vh', // Fixed viewport position
      scale: 4,
      rotation: 0,
      duration: 0.12,
      ease: 'power2.out'
    })
    // Hold position for the remaining scroll
    .to(hawk, {
      left: '50%',
      top: '50vh',
      scale: 4,
      rotation: 0,
      duration: 0.3,
      ease: 'none'
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
      if (navbarEagle) navbarEagle.style.opacity = '1'
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div
        ref={hawkRef}
        className={`fixed z-50 pointer-events-none ${
          (isVisible || hasLanded) ? 'opacity-100' : 'opacity-0'
        } ${hasLanded ? 'eagle-landed' : (isInView ? 'eagle-flying' : '')}`}
        style={{
          left: '15vw',
          top: '20vh',
          width: '100px',
          height: '100px',
          transform: 'translate(-50%, -50%)',
          transition: 'opacity 0.3s'
        }}
      >
        <img
          src="https://res.cloudinary.com/dem7arres/image/upload/v1771347376/eagle-modified_n3g8to.png"
          alt="Eagle"
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 1)) drop-shadow(0 0 25px rgba(255, 255, 255, 1)) brightness(1.6) contrast(1.3)'
          }}
        />
      </div>

      <style>{`
        @keyframes wingFlap {
          0%, 100% { transform: scaleX(1) scaleY(1); }
          50% { transform: scaleX(1.2) scaleY(0.88); }
        }
        .eagle-flying {
          animation: wingFlap 0.4s ease-in-out infinite;
        }
        .eagle-landed {
          animation: none !important;
        }
      `}</style>
    </>
  )
}
