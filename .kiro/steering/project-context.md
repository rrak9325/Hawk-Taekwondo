# Hawk Taekwondo Project Context

## Project Overview
Full-stack web application for Hawk Taekwondo martial arts school with admin panel and notification system.

## Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- Framer Motion for animations
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- File-based JSON database (mockData.json)
- Cloudinary for media uploads
- JWT authentication

## Project Structure

```
/backend
  /src
    /config       - Database and Cloudinary configuration
    /controllers  - Request handlers
    /middlewares  - Auth and error handling
    /routes       - API route definitions
    /services     - Business logic
    /utils        - Helper functions
    /validators   - Input validation
  server.js       - Express server entry point

/frontend
  /src
    /api          - API client configuration
    /components   - React components
    /pages        - Page components
    /services     - Frontend service layer
    /utils        - Helper utilities
    /styles       - Global styles
  App.jsx         - Main app component
```

## Key Features

1. **Admin Panel** - Content management for classes, instructors, testimonials
2. **Notification System** - Real-time notifications with scheduling
3. **Media Upload** - Image/video upload with Cloudinary integration
4. **Authentication** - JWT-based admin authentication
5. **Responsive Design** - Mobile-first approach with TailwindCSS

## Development Workflow

- Backend runs on port 3001
- Frontend proxies `/api` requests to backend
- Database: `backend/public/mockData.json`
- Tests: Jest for backend, Vitest for frontend
- Property-based testing with fast-check

## Important Conventions

- Use framer-motion for animations
- Minimum 44x44px touch targets for mobile
- Admin endpoints require authentication middleware
- Public endpoints filter by active/scheduled status
- All dates in ISO 8601 format
- IDs are UUIDs (v4)
