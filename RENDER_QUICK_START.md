# Render Deployment - Quick Start

## 🚨 IMPORTANT: Data Persistence

Render's free tier has an **ephemeral filesystem** - all files are deleted on restart (every 15 min of inactivity or on deploy).

**Solution**: This app uses Cloudinary to persist data and media.

## Before You Deploy

### 1. Upload Initial Data to Cloudinary
```bash
npm run deploy:upload-data
```

This uploads your `mockData.json` to Cloudinary so it persists across restarts.

### 2. Verify Upload
Check Cloudinary dashboard: https://cloudinary.com/console
- Look for: `hawk-taekwondo/data/mockData.json`

## Deploy to Render

### Method 1: Blueprint (Recommended)
1. Push code to GitHub
2. Go to https://dashboard.render.com
3. Click "New +" → "Blueprint"
4. Connect your repository
5. Render reads `render.yaml` automatically
6. Add environment variables (see below)
7. Click "Apply"

### Method 2: Manual
1. Create Backend Service:
   - Type: Web Service
   - Environment: Node
   - Build Command: `cd backend && npm ci --omit=dev`
   - Start Command: `node backend/server.js`

2. Create Frontend Service:
   - Type: Static Site
   - Build Command: `cd frontend && npm ci --omit=dev && npm run build`
   - Publish Directory: `./frontend/dist`

## Environment Variables (Backend)

Add these in Render Dashboard → Backend Service → Environment:

```
NODE_ENV=production
ADMIN_USERNAME=your_username
ADMIN_PASSWORD_HASH=your_bcrypt_hash
FRONTEND_URL=https://your-frontend.onrender.com
PORT=10000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Generate Password Hash
```bash
cd hawk-taekwondo/backend
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourPassword123', 10))"
```

## Verify Deployment

### 1. Check Backend
```bash
curl https://your-backend.onrender.com/api/data
```

Should return your school data.

### 2. Check Logs
Look for these messages:
```
✅ Cloudinary configured successfully
✅ Data loaded from Cloudinary
```

### 3. Test Persistence
1. Login to admin panel
2. Make a change
3. Wait for service to sleep (15 min) or manually restart
4. Verify change persists

## Common Issues

### Build Failed
**Check**: 
- `package-lock.json` is committed
- All dependencies are in `package.json`
- Node version compatibility

**Fix**: 
```bash
# Locally
cd backend
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

### Data Not Persisting
**Check**:
- Cloudinary credentials in Render environment variables
- Initial data was uploaded: `npm run deploy:upload-data`
- Logs show: "Data backed up to Cloudinary"

**Fix**:
```bash
# Re-upload data
npm run deploy:upload-data

# Verify in Cloudinary dashboard
# Then restart Render service
```

### Images Not Loading
**Check**:
- Cloudinary credentials are correct
- Images uploaded successfully (check Cloudinary dashboard)
- CORS is configured in backend

**Fix**: Images should upload to Cloudinary automatically. Check upload logs.

## Service Sleep Behavior

Free tier services sleep after 15 minutes of inactivity:
- First request after sleep takes 15-30 seconds (cold start)
- Data persists because it's in Cloudinary
- Images persist because they're in Cloudinary

**Options**:
1. Accept the cold start (free)
2. Use a ping service like UptimeRobot (free)
3. Upgrade to paid plan ($7/month, no sleep)

## Monitoring

- **Render Dashboard**: https://dashboard.render.com
- **Cloudinary Dashboard**: https://cloudinary.com/console
- **Set up email alerts** in Render for deployment failures

## Need Help?

1. Check `DEPLOYMENT.md` for detailed guide
2. Check Render logs for errors
3. Verify Cloudinary credentials
4. Test locally with production env vars

## Quick Commands

```bash
# Upload initial data to Cloudinary
npm run deploy:upload-data

# Test backend locally
cd backend && npm start

# Test frontend locally
cd frontend && npm run dev

# Build frontend
cd frontend && npm run build

# Generate password hash
cd backend && node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('password', 10))"
```
