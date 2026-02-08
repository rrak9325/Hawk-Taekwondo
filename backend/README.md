# Hawk Taekwondo - Backend

Express.js backend API for Hawk Taekwondo website.

## Features

- RESTful API for school data management
- JWT-based authentication
- File upload with image optimization
- Rate limiting and brute-force protection
- CORS configuration for frontend

## Setup

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
FRONTEND_URL=http://localhost:5173
```

## Run

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## API Endpoints

- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout
- `GET /api/data` - Get school data
- `POST /api/data` - Update school data (auth required)
- `POST /api/upload` - Upload files (auth required)
- `DELETE /api/upload` - Delete files (auth required)

## Security

- Rate limiting: 100 requests per 15 min per IP
- Login rate limiting: 5 attempts per 15 min per IP
- Brute-force protection: 3 failed attempts = 30 min lockout
- Progressive delays on failed login attempts
- Helmet.js for security headers
