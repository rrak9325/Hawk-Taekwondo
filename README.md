# Hawk Taekwondo

Professional website for Hawk Taekwondo martial arts school.

## Project Structure

```
hawk-taekwondo/
├── frontend/          # React + Vite frontend
├── backend/           # Express.js API
├── shared/            # Shared types and constants
├── public/            # Static assets
└── docs/              # Documentation
```

## Quick Start

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

## Features

- 🎨 Modern responsive design
- 🔐 Secure admin panel
- 📸 Image/video upload and optimization
- 📅 Dynamic class schedule
- 👥 Instructor profiles
- 📱 Mobile-friendly
- ⚡ Fast performance

## Admin Access

Navigate to `/admin` and login to manage:
- Hero section media
- Programs and classes
- Instructors
- Schedule
- Gallery
- Contact info

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router

**Backend:**
- Node.js
- Express.js
- JWT authentication
- Sharp (image processing)
- Rate limiting

## Security

- Brute-force protection (3 attempts = 30 min lockout)
- Rate limiting on all endpoints
- JWT-based authentication
- Secure file uploads
- CORS configuration

## Deployment

See individual README files:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## License

Private project for Hawk Taekwondo
