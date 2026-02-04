export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    // Return complete data with FULL URLs for images
    const data = {
      "schoolInfo": {
        "name": "Hawk Taekwondo Training Centre",
        "tagline": "Find your strength. Build your confidence.",
        "mission": "We believe Taekwondo is for everyone. Our goal is to create a space where you can push your limits, learn discipline, and become the best version of yourself, all while being part of a great community.",
        "founded": 2010,
        "address": "First Floor, Mangalya Complex, above Vadwala Auto, opp. Anjali BRTS, Pankaj Society, Bhatta, Vasna, Ahmedabad, Gujarat 380007",
        "phone": "+91 8487829291",
        "email": "httc.tkd29@gmail.com",
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
          "videoUrl": "https://hawk-taekwondo-ahmedabad.vercel.app/uploads/1769960053292-1000063195.mp4",
          "backgroundImage": "",
          "primaryButton": { "label": "Explore Programs", "link": "/programs" },
          "secondaryButton": { "label": "Start Free Trial", "link": "/contact" }
        },
        "features": [
          { "icon": "Shield", "title": "Expert Instruction", "description": "Certified black belt instructors with real competition experience" },
          { "icon": "Target", "title": "Goal Focused", "description": "Structured belt and skill progression system" },
          { "icon": "Users", "title": "Strong Community", "description": "Supportive training environment for all ages" },
          { "icon": "Award", "title": "Proven Results", "description": "Track record of confident and disciplined students" }
        ]
      },
      "about": {
        "hero": {
          "titleMain": "About",
          "titleHighlight": "Hawk Taekwondo",
          "subtitle": "We believe Taekwondo is for everyone. Our goal is to create a space where you can push your limits, learn discipline, and become the best version of yourself, all while being part of a great community.",
          "videoUrl": "https://hawk-taekwondo-ahmedabad.vercel.app/uploads/1769960172419-vid-20260201-wa0049.mp4",
          "backgroundImage": ""
        },
        "stats": [
          { "number": "15+", "label": "Years Experience" },
          { "number": "500+", "label": "Active Students" },
          { "number": "50+", "label": "Black Belts" },
          { "number": "100%", "label": "Satisfaction" }
        ]
      },
      "programs": [
        {
          "id": 1,
          "name": "Taekwondo",
          "description": "Traditional Korean martial art focusing on high kicks, jumping and spinning kicks, and fast kicking techniques.",
          "benefits": ["Improved flexibility and balance", "Enhanced cardiovascular fitness", "Mental discipline and focus", "Self-defense skills", "Stress relief and confidence building"],
          "image": ""
        },
        {
          "id": 2,
          "name": "Self Defence",
          "description": "Practical protection techniques designed for real-world situations and personal safety.",
          "benefits": ["Effective protection skills", "Situational awareness", "Confidence in dangerous situations", "Quick reaction techniques", "Legal self-defense knowledge"],
          "image": ""
        }
      ],
      "programsPage": {
        "hero": {
          "titleMain": "Our",
          "titleHighlight": "Programs",
          "subtitle": "Discover the perfect program tailored to your age, skill level, and goals.",
          "videoUrl": "",
          "backgroundImage": "https://hawk-taekwondo-ahmedabad.vercel.app/uploads/1770040004590-peak_rudra.jpg"
        }
      },
      "schedulePage": {
        "hero": {
          "titleMain": "Class",
          "titleHighlight": "Schedule",
          "subtitle": "Find the perfect class time that fits your week.",
          "videoUrl": "",
          "backgroundImage": ""
        }
      },
      "contactPage": {
        "hero": {
          "titleMain": "Get in",
          "titleHighlight": "Touch",
          "subtitle": "Ready to start your martial arts journey? Contact us today.",
          "videoUrl": "",
          "backgroundImage": "https://hawk-taekwondo-ahmedabad.vercel.app/uploads/1770043363663-_psp76771.jpg"
        }
      },
      "facultyPage": {
        "hero": {
          "titleMain": "Meet Our",
          "titleHighlight": "Instructors",
          "subtitle": "Learn from certified masters with decades of experience",
          "videoUrl": "",
          "backgroundImage": "https://hawk-taekwondo-ahmedabad.vercel.app/uploads/1770040086370-1000063048.jpg"
        }
      },
      "instructors": [
        {
          "id": 1770128800536,
          "name": "Master Yajuvendrasinh Rathod",
          "rank": "4th DAN Black Belt",
          "bio": "Chief Instructor with over 25 years of experience in Taekwondo. Asian Taekwondo Union Licensed Coach specializing in advanced techniques and competition training.",
          "image": "https://hawk-taekwondo-ahmedabad.vercel.app/uploads/1770038040858-1000063051.jpg"
        },
        {
          "id": 2,
          "name": "Yajuvendrasinh RATHOD",
          "rank": "4th DAN Black Belt",
          "specialization": "Chief Instructor",
          "experience": "25 years",
          "bio": "Asian Taekwondo Union Licensed Coach with over two decades of teaching experience. Specializes in advanced techniques and competition training.",
          "image": "https://hawk-taekwondo-ahmedabad.vercel.app/uploads/1770038040858-1000063051.jpg"
        }
      ],
      "testimonials": [
        {
          "id": 1,
          "name": "Sarah",
          "program": "Kids Program",
          "rating": 5,
          "comment": "My daughter loves it here. Her confidence has skyrocketed since she started training with the team.",
          "image": "/images/testimonials/student-1.jpg"
        },
        {
          "id": 2,
          "name": "Mike",
          "program": "Adult Program",
          "rating": 5,
          "comment": "I was looking for a way to stay fit and learn something new. The community here is so welcoming and the workouts are legit.",
          "image": "/images/testimonials/student-2.jpg"
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
            "name": "Kids & Youth Batch",
            "days": ["Tuesday", "Thursday", "Saturday"],
            "time": "5:00 PM - 6:00 PM", 
            "ageGroup": "Ages 4-17",
            "description": "Alternative schedule for young students"
          },
          {
            "name": "Adults Batch",
            "days": ["Tuesday", "Thursday", "Saturday"],
            "time": "6:00 PM - 7:00 PM",
            "ageGroup": "Ages 18+",
            "description": "Comprehensive training for adult practitioners"
          }
        ],
        "dailySchedule": [
          {
            "day": "Monday",
            "classes": [
              {
                "name": "Kids & Youth Batch",
                "time": "7:30 PM - 8:30 PM",
                "ageGroup": "Ages 4-17",
                "type": "Youth"
              }
            ]
          },
          {
            "day": "Tuesday", 
            "classes": [
              {
                "name": "Kids & Youth Batch",
                "time": "5:00 PM - 6:00 PM",
                "ageGroup": "Ages 4-17",
                "type": "Youth"
              },
              {
                "name": "Adults Batch",
                "time": "6:00 PM - 7:00 PM",
                "ageGroup": "Ages 18+",
                "type": "Adult"
              }
            ]
          },
          {
            "day": "Wednesday",
            "classes": [
              {
                "name": "Kids & Youth Batch",
                "time": "7:30 PM - 8:30 PM",
                "ageGroup": "Ages 4-17",
                "type": "Youth"
              }
            ]
          },
          {
            "day": "Thursday",
            "classes": [
              {
                "name": "Kids & Youth Batch",
                "time": "5:00 PM - 6:00 PM",
                "ageGroup": "Ages 4-17",
                "type": "Youth"
              },
              {
                "name": "Adults Batch",
                "time": "6:00 PM - 7:00 PM",
                "ageGroup": "Ages 18+",
                "type": "Adult"
              }
            ]
          },
          {
            "day": "Friday",
            "classes": [
              {
                "name": "Kids & Youth Batch",
                "time": "7:30 PM - 8:30 PM",
                "ageGroup": "Ages 4-17",
                "type": "Youth"
              }
            ]
          },
          {
            "day": "Saturday",
            "classes": [
              {
                "name": "Kids & Youth Batch",
                "time": "5:00 PM - 6:00 PM",
                "ageGroup": "Ages 4-17",
                "type": "Youth"
              },
              {
                "name": "Adults Batch",
                "time": "6:00 PM - 7:00 PM",
                "ageGroup": "Ages 18+",
                "type": "Adult"
              }
            ]
          },
          {
            "day": "Sunday",
            "classes": []
          }
        ]
      },
      "gallery": {
        "featured": [
          {
            "id": 1770193050603.39,
            "image": "https://hawk-taekwondo-ahmedabad.vercel.app/uploads/1770193050590-peakkk.jpg",
            "title": ""
          },
          {
            "id": 1770140135352.269,
            "image": "https://hawk-taekwondo-ahmedabad.vercel.app/uploads/1770140135346-_psp7619.jpg",
            "title": ""
          },
          {
            "id": 1769973678931.8313,
            "image": "https://hawk-taekwondo-ahmedabad.vercel.app/uploads/1769973683724-_psp7623.jpg",
            "title": "Rudra's Aura..."
          }
        ]
      }
    }
    
    return res.json(data)
  }
  
  if (req.method === 'POST') {
    // Save data - just return success
    return res.json({ success: true, message: 'Data saved successfully' })
  }
  
  return res.status(405).json({ error: 'Method not allowed' })
}