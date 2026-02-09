# Vercel Deployment Guide

## 🚀 Quick Deploy Steps

### 1. Push to GitHub (Already Done ✅)
Your code is already on GitHub at `rrak9325/Hawk-Taekwondo`

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import `rrak9325/Hawk-Taekwondo` repository
5. Click **"Import"**

### 3. Configure Project Settings

**Framework Preset:** Other (or Vite)

**Root Directory:** Leave as `.` (root)

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
frontend/dist
```

**Install Command:**
```bash
npm install && cd frontend && npm install && cd ../backend && npm install
```

### 4. Environment Variables

Click **"Environment Variables"** and add these:

#### Required Variables:

| Name | Value | Notes |
|------|-------|-------|
| `NODE_ENV` | `production` | Sets production mode |
| `ADMIN_USER` | `yaju9325` | Your admin username |
| `ADMIN_PASS_HASH` | `$2b$10$r.ueC.ssjKhXSg4aqJE8ee0TaDu61nVFIOCvj/euL9a1/FXYe10EC` | Your hashed password |
| `FRONTEND_URL` | `https://your-domain.vercel.app` | Will be provided after first deploy |
| `PORT` | `3001` | Backend port |

**Important:** After first deployment, go back and update `FRONTEND_URL` with your actual Vercel URL!

### 5. Deploy

Click **"Deploy"** and wait 2-3 minutes

### 6. Post-Deployment Setup

After deployment completes:

1. Copy your Vercel URL (e.g., `https://hawk-taekwondo.vercel.app`)
2. Go to **Project Settings → Environment Variables**
3. Update `FRONTEND_URL` to your Vercel URL
4. Click **"Redeploy"** to apply changes

## 📁 File Upload Configuration

**Important:** Vercel has a serverless architecture with read-only filesystem. For file uploads, you have two options:

### Option A: Use External Storage (Recommended)
- Set up Cloudinary, AWS S3, or Vercel Blob
- Update upload service to use cloud storage

### Option B: Keep Current Setup (Limited)
- Uploads will work during session
- Files will be lost on next deployment
- Good for testing, not production

## 🔒 Security Checklist

- ✅ Brute-force protection enabled (3 attempts, 30 min lockout)
- ✅ Rate limiting configured
- ✅ CORS properly set
- ✅ Helmet security headers
- ✅ Environment variables secured
- ⚠️ **Change admin password after deployment!**

## 🧪 Testing After Deployment

1. Visit your Vercel URL
2. Check all pages load correctly
3. Test admin login at `/admin`
4. Try uploading an image (note: will be temporary)
5. Update some content and save
6. Verify changes appear on frontend

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies in package.json
- Ensure environment variables are set

### API Not Working
- Check `FRONTEND_URL` matches your Vercel domain
- Verify backend environment variables
- Check Vercel function logs

### Admin Login Fails
- Verify `ADMIN_USER` and `ADMIN_PASS_HASH` are correct
- Check browser console for errors
- Ensure cookies/session storage enabled

### Images Not Loading
- Check if images are in `public/` folder
- Verify upload paths in code
- Remember: Vercel filesystem is read-only

## 📊 Monitoring

After deployment, monitor:
- Vercel Analytics (automatic)
- Function logs in Vercel dashboard
- Error tracking in browser console

## 🔄 Future Deployments

Every time you push to GitHub main branch:
1. Vercel automatically detects changes
2. Builds and deploys new version
3. Takes 2-3 minutes
4. Zero downtime deployment

## 💡 Pro Tips

1. **Custom Domain:** Add your own domain in Vercel project settings
2. **Preview Deployments:** Every branch gets a preview URL
3. **Rollback:** Can instantly rollback to previous deployment
4. **Environment Variables:** Can have different values for production/preview
5. **Analytics:** Enable Vercel Analytics for visitor insights

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Check deployment logs in Vercel dashboard
