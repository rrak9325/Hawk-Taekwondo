import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      // Return the mockData.json content
      const mockData = {
        "schoolInfo": {
          "name": "Hawk Taekwondo Training Centre",
          "tagline": "Find your strength. Build your confidence.",
          "mission": "We believe Taekwondo is for everyone. Our goal is to create a space where you can push your limits, learn discipline, and become the best version of yourself, all while being part of a great community.",
          "founded": 2010,
          "address": "First Floor, Mangalya Complex, above Vadwala Auto, opp. Anjali BRTS, Pankaj Society, Bhatta, Vasna, Ahmedabad, Gujarat 380007",
          "phone": "+91 8487829291",
          "email": "httc.tkd29@gmail.com",
          "mapLink": "https://www.google.com/maps/place/Hawk+Taekwondo+Training+Centre/@23.0039668,72.5541008,17z/data=!3m1!4b1!4m6!3m5!1s0x395e851bc7092e07:0x21ae1c75bac35a33!8m2!3d23.0039668!4d72.5541008!16s%2Fg%2F11d_tj5tvw?hl=en-GB&entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D",
          "hours": [
            "Monday - Friday: 4:00 PM - 9:00 PM",
            "Saturday: 8:00 AM - 2:00 PM",
            "Sunday: Closed"
          ]
        },
        "home": {
          "hero": {
            "titleMain": "Master the Art of",
            "titleHighlight": "Taekwondo",
            "subtitle": "Find your strength. Build your confidence.",
            "videoUrl": "/uploads/1769960053292-1000063195.mp4",
            "backgroundImage": "",
            "primaryButton": {
              "label": "Explore Programs",
              "link": "/programs"
            },
            "secondaryButton": {
              "label": "Start Free Trial",
              "link": "/contact"
            }
          }
        },
        "instructors": [
          {
            "id": 1770128800536,
            "name": "Master Yajuvendrasinh Rathod",
            "rank": "4th DAN Black Belt",
            "bio": "Chief Instructor with over 25 years of experience in Taekwondo. Asian Taekwondo Union Licensed Coach specializing in advanced techniques and competition training.",
            "image": "/uploads/1770038040858-1000063051.jpg"
          }
        ],
        "programs": [
          {
            "id": 1,
            "name": "Taekwondo",
            "description": "Traditional Korean martial art focusing on high kicks, jumping and spinning kicks, and fast kicking techniques.",
            "benefits": [
              "Improved flexibility and balance",
              "Enhanced cardiovascular fitness",
              "Mental discipline and focus",
              "Self-defense skills",
              "Stress relief and confidence building"
            ],
            "image": ""
          }
        ],
        "classSchedule": {
          "batches": [
            {
              "name": "Kids & Youth Batch",
              "days": ["Monday", "Wednesday", "Friday"],
              "time": "7:30 PM - 8:30 PM",
              "ageGroup": "Ages 4-17",
              "description": "Perfect for young martial artists to build discipline and confidence"
            },
            {
              "name": "Adults Batch",
              "days": ["Tuesday", "Thursday", "Saturday"],
              "time": "6:00 PM - 7:00 PM",
              "ageGroup": "Ages 18+",
              "description": "Comprehensive training for adult practitioners"
            }
          ]
        },
        "gallery": {
          "featured": [
            {
              "id": 1770193050603.39,
              "image": "/uploads/1770193050590-peakkk.jpg",
              "title": ""
            },
            {
              "id": 1770140135352.269,
              "image": "/uploads/1770140135346-_psp7619.jpg",
              "title": ""
            }
          ]
        }
      }
      
      return res.json(mockData)
    }
    
    if (req.method === 'POST') {
      // For saving data - require auth
      const token = req.headers.authorization
      if (!token || token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      
      // Just return success for now
      return res.json({ success: true, message: 'Data saved successfully' })
    }
    
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: error.message })
  }
}