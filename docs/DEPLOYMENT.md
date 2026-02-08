# Deployment Guide

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start
```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Individual Services
```bash
# Frontend only
cd frontend && npm run dev

# Backend only  
cd backend && npm run dev
```

## Production Deployment

### Environment Variables
Create `.env` files in both frontend and backend directories:

**Backend `.env`:**
```
ADMIN_USER=your_admin_username
ADMIN_PASS_HASH=your_bcrypt_hash
FRONTEND_URL=https://your-frontend-domain.com
PORT=3001
NODE_ENV=production
```

**Frontend `.env`:**
```
VITE_API_URL=https://your-backend-domain.com
```

### Build Process
```bash
# Build frontend
cd frontend && npm run build

# Backend runs directly (no build needed)
cd backend && npm start
```

### Deployment Options

#### Option 1: Separate Deployment
- Deploy frontend build to static hosting (Vercel, Netlify)
- Deploy backend to server hosting (Railway, Render, DigitalOcean)

#### Option 2: Single Server
- Build frontend
- Copy frontend/dist to backend/public
- Deploy backend with static file serving

#### Option 3: Docker
```dockerfile
# Multi-stage build
FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
COPY --from=frontend /app/frontend/dist ./public
EXPOSE 3001
CMD ["npm", "start"]
```

## File Storage

### Development
- Uses local file system
- Data: `public/mockData.json`
- Uploads: `public/uploads/`

### Production Considerations
- Consider database migration (PostgreSQL, MongoDB)
- Use cloud storage for uploads (AWS S3, Cloudinary)
- Implement proper backup strategy

## Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong bcrypt hash for password
- [ ] Set up HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Regular security updates

## Monitoring

### Health Checks
- GET `/api/data` - Should return school data
- POST `/api/login` - Should reject invalid credentials
- Protected endpoints should require authentication

### Logs
- Backend logs to console
- Monitor for authentication failures
- Track upload/delete operations
- Monitor file storage usage