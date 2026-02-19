# Hawk Taekwondo Deployment Guide

## 🌐 Domain: hawktaekwondo.com

This guide will help you deploy your Hawk Taekwondo website to production.

---

## 📋 Prerequisites

- Domain: `hawktaekwondo.com` (purchased and configured)
- Backend hosting (e.g., Render, Railway, Heroku, VPS)
- Frontend hosting (e.g., Netlify, Vercel, Cloudflare Pages)
- Cloudinary account (for media storage)

---

## 🔧 Configuration Steps

### 1. Backend Configuration

#### Option A: Backend on Same Domain (hawktaekwondo.com/api)
This is the simplest setup - your backend serves the API at `/api` routes.

**Frontend `.env.production`:**
```env
VITE_API_URL=https://hawktaekwondo.com
```

**Backend Configuration:**
- Deploy backend to handle routes at `/api/*`
- Configure your hosting to route `/api/*` to backend server

#### Option B: Backend on Subdomain (api.hawktaekwondo.com)
Separate subdomain for API - cleaner separation.

**Frontend `.env.production`:**
```env
VITE_API_URL=https://api.hawktaekwondo.com
```

**DNS Configuration:**
- Create A or CNAME record: `api.hawktaekwondo.com` → your backend server IP/domain

**Backend Configuration:**
- Deploy backend to `api.hawktaekwondo.com`
- Enable CORS for `hawktaekwondo.com`

#### Option C: Backend on Different Domain (CURRENT SETUP)
If using a service like Render with their domain.

**Frontend `.env.production`:**
```env
VITE_API_URL=https://hawktaekwondo.onrender.com
```

**Your Current Setup:**
- Backend deployed on Render: `https://hawktaekwondo.onrender.com`
- Frontend served from same backend server
- API endpoints: `https://hawktaekwondo.onrender.com/api/*`
- Health check: `https://hawktaekwondo.onrender.com/health`

---

### 2. Environment Variables Setup

#### Frontend Environment Variables

Create `Hawk-Taekwondo/frontend/.env.production`:

```env
# Backend API URL - Choose one based on your setup:

# Option A: Same domain
VITE_API_URL=https://hawktaekwondo.com

# Option B: Subdomain
# VITE_API_URL=https://api.hawktaekwondo.com

# Option C: Different domain
# VITE_API_URL=https://your-backend.onrender.com
```

#### Backend Environment Variables

Update `Hawk-Taekwondo/.env` (or your backend hosting environment):

```env
# Admin Credentials
ADMIN_USERNAME=yaju9325
ADMIN_PASSWORD_HASH=$2b$10$T1T/FKnaSpNnlam4z91Co.2.9UW4D9i6yz1fx71/x2pei9WluBt.2

# Server Configuration
PORT=3001
NODE_ENV=production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dem7arres
CLOUDINARY_API_KEY=267337995938546
CLOUDINARY_API_SECRET=syFRfi-IhPf5oQQyqnGlnKut2no

# CORS Configuration - Add your frontend domain
FRONTEND_URL=https://hawktaekwondo.com
```

---

### 3. Backend CORS Configuration

Make sure your backend allows requests from your frontend domain.

**In `backend/src/app.js` or similar:**

```javascript
import cors from 'cors'

const allowedOrigins = [
  'https://hawktaekwondo.com',
  'https://www.hawktaekwondo.com',
  'http://localhost:5173', // For local development
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
```

---

### 4. Build and Deploy

#### Frontend Build

```bash
cd Hawk-Taekwondo/frontend

# Install dependencies
npm install

# Build for production
npm run build

# Output will be in: frontend/dist/
```

#### Backend Build

```bash
cd Hawk-Taekwondo/backend

# Install dependencies
npm install

# Start production server
npm start
```

---

### 5. Hosting Platform Specific Instructions

#### Netlify (Frontend)

1. Connect your GitHub repository
2. Build settings:
   - **Base directory**: `Hawk-Taekwondo/frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Environment variables:
   - Add `VITE_API_URL` with your backend URL
4. Deploy!

#### Vercel (Frontend)

1. Import your GitHub repository
2. Framework preset: **Vite**
3. Root directory: `Hawk-Taekwondo/frontend`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variables:
   - Add `VITE_API_URL` with your backend URL
7. Deploy!

#### Render (Backend)

1. Create new Web Service
2. Connect your GitHub repository
3. Settings:
   - **Root directory**: `Hawk-Taekwondo/backend`
   - **Build command**: `npm install`
   - **Start command**: `npm start`
4. Environment variables:
   - Add all backend env vars from `.env`
5. Deploy!

#### Railway (Backend)

1. Create new project from GitHub
2. Settings:
   - **Root directory**: `Hawk-Taekwondo/backend`
   - **Start command**: `npm start`
3. Environment variables:
   - Add all backend env vars
4. Deploy!

---

### 6. DNS Configuration

#### For hawktaekwondo.com

**A Records:**
```
@ (root)    → Your frontend hosting IP
www         → Your frontend hosting IP
```

**CNAME Records (if using subdomain for API):**
```
api         → your-backend.onrender.com
```

**Example with Netlify + Render:**
```
@           → 75.2.60.5 (Netlify IP)
www         → hawktaekwondo.netlify.app
api         → hawk-backend.onrender.com
```

---

### 7. SSL/HTTPS Configuration

Most hosting platforms (Netlify, Vercel, Render) provide automatic SSL certificates.

**Verify:**
- ✅ `https://hawktaekwondo.com` works
- ✅ `https://www.hawktaekwondo.com` works
- ✅ `https://api.hawktaekwondo.com` works (if using subdomain)
- ✅ No mixed content warnings

---

### 8. Testing Checklist

After deployment, test:

- [ ] Homepage loads correctly
- [ ] All images load from Cloudinary
- [ ] Navigation works
- [ ] Admin login works at `/admin`
- [ ] Admin can upload images
- [ ] Admin can edit content
- [ ] Admin can save changes
- [ ] Contact form works (if implemented)
- [ ] Mobile responsive
- [ ] Performance is good (test with Lighthouse)

---

### 9. Common Issues & Solutions

#### Issue: "Failed to fetch" or CORS errors
**Solution**: 
- Check `VITE_API_URL` in frontend `.env.production`
- Verify backend CORS configuration includes your frontend domain
- Check backend is running and accessible

#### Issue: Images not loading
**Solution**:
- Verify Cloudinary credentials in backend `.env`
- Check Cloudinary URLs in mockData.json
- Verify CSP headers allow Cloudinary domain

#### Issue: Admin login fails
**Solution**:
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` in backend `.env`
- Check backend `/api/auth/login` endpoint is accessible
- Verify session storage is working

#### Issue: Build fails
**Solution**:
- Run `npm install` in both frontend and backend
- Check Node version (should be 18+)
- Clear `node_modules` and reinstall if needed

---

### 10. Monitoring & Maintenance

**Backend Monitoring:**
- Check backend logs regularly
- Monitor API response times
- Set up uptime monitoring (e.g., UptimeRobot)

**Frontend Monitoring:**
- Use Lighthouse for performance checks
- Monitor Core Web Vitals
- Check for console errors

**Cloudinary:**
- Monitor storage usage
- Check bandwidth usage
- Clean unused media regularly via admin panel

---

## 🚀 Quick Start Commands

### Local Development
```bash
# Terminal 1 - Backend
cd Hawk-Taekwondo/backend
npm install
npm start

# Terminal 2 - Frontend
cd Hawk-Taekwondo/frontend
npm install
npm run dev
```

### Production Build
```bash
# Frontend
cd Hawk-Taekwondo/frontend
npm run build

# Backend
cd Hawk-Taekwondo/backend
npm start
```

---

## 📞 Support

If you encounter issues:
1. Check the console for errors
2. Verify all environment variables are set correctly
3. Check backend logs
4. Verify DNS propagation (can take 24-48 hours)

---

## ✅ Deployment Complete!

Once everything is configured:
- Your site will be live at `https://hawktaekwondo.com`
- Admin panel at `https://hawktaekwondo.com/admin`
- API at your configured backend URL

Good luck with your deployment! 🥋
