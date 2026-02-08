// Shared TypeScript types for school data
// Used by both frontend and backend for type safety

export interface SchoolInfo {
  name: string
  tagline: string
  mission: string
  founded: number
  address: string
  phone: string
  email: string
  hours: string[]
}

export interface HeroSection {
  titleMain: string
  titleHighlight: string
  subtitle: string
  videoUrl?: string
  backgroundImage?: string
  primaryButton?: { label: string; link: string }
  secondaryButton?: { label: string; link: string }
}

export interface Feature {
  icon: string
  title: string
  description: string
}

export interface Instructor {
  id: number
  name: string
  rank: string
  bio: string
  image: string
  specialization?: string
  experience?: string
}

export interface Program {
  id: number
  name: string
  description: string
  benefits: string[]
  image: string
}

export interface Testimonial {
  id: number
  name: string
  program: string
  rating: number
  comment: string
  image: string
}

export interface ClassBatch {
  name: string
  days: string[]
  time: string
  ageGroup: string
  description: string
}

export interface ClassSession {
  name: string
  time: string
  ageGroup: string
  type: 'Youth' | 'Adult'
}

export interface DailySchedule {
  day: string
  classes: ClassSession[]
}

export interface GalleryItem {
  id: number
  image: string
  title: string
}

export interface SchoolData {
  schoolInfo: SchoolInfo
  home: {
    hero: HeroSection
    features: Feature[]
  }
  about: {
    hero: HeroSection
    stats: Array<{ number: string; label: string }>
    values: Feature[]
    cta: {
      title: string
      text: string
      buttonLabel: string
      buttonLink: string
    }
  }
  programs: Program[]
  programsPage: { hero: HeroSection }
  schedulePage: { hero: HeroSection }
  contactPage: { hero: HeroSection }
  facultyPage: { hero: HeroSection }
  instructors: Instructor[]
  testimonials: Testimonial[]
  classSchedule: {
    batches: ClassBatch[]
    dailySchedule: DailySchedule[]
  }
  gallery: {
    featured: GalleryItem[]
  }
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token: string
  expiresIn: string
  message: string
}

export interface AuthUser {
  username: string
  role: 'admin'
  iat: number
}