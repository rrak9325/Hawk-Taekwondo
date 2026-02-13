# Pre-Deployment Checklist

Use this checklist before deploying to Render to ensure everything works correctly.

## ✅ Local Testing

- [ ] Backend starts without errors: `cd backend && npm start`
- [ ] Frontend builds successfully: `cd frontend && npm run build`
- [ ] Admin login works locally
- [ ] Image upload works locally
- [ ] Data saves persist locally

## ✅ Cloudinary Setup

- [ ] Cloudinary account created (free tier is fine)
- [ ] Credentials added to `backend/.env`:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- [ ] Initial data uploaded: `npm run deploy:upload-data`
- [ ] Verified in Cloudinary dashboard: `hawk-taekwondo/data/mockData.json` exists

## ✅ Code Repository

- [ ] All changes committed to Git
- [ ] `.env` files are in `.gitignore` (NOT committed)
- [ ] `package-lock.json` files are committed
- [ ] Code pushed to GitHub/GitLab

## ✅ Render Account

- [ ] Render account created (free tier is fine)
- [ ] GitHub/GitLab connected to Render
- [ ] Payment method added (required even for free tier)

## ✅ Environment Variables Ready

Have these values ready to add in Render Dashboard:

### Backend Service
```
NODE_ENV=production
ADMIN_USERNAME=________
ADMIN_PASSWORD_HASH=________
FRONTEND_URL=https://________.onrender.com
PORT=10000
CLOUDINARY_CLOUD_NAME=________
CLOUDINARY_API_KEY=________
CLOUDINARY_API_SECRET=________
```

### Generate Password Hash
```bash
cd backend
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourPassword', 10))"
```

## ✅ Deployment Configuration

- [ ] `render.yaml` exists in project root
- [ ] Build commands use `npm ci --omit=dev`
- [ ] Start command is `node backend/server.js`
- [ ] Frontend publish path is `./frontend/dist`

## ✅ Post-Deployment Verification

After deploying, verify:

- [ ] Backend service is running (check Render dashboard)
- [ ] Frontend service is running (check Render dashboard)
- [ ] Backend logs show: `✅ Cloudinary configured successfully`
- [ ] Backend logs show: `✅ Data loaded from Cloudinary`
- [ ] Can access frontend URL
- [ ] Can access backend API: `https://backend-url.onrender.com/api/data`
- [ ] Admin login works
- [ ] Can upload images
- [ ] Images appear in Cloudinary dashboard
- [ ] Data persists after service restart

## ✅ Test Data Persistence

Critical test for Render's ephemeral filesystem:

1. [ ] Login to admin panel
2. [ ] Make a small change (e.g., edit a program description)
3. [ ] Save changes
4. [ ] Check backend logs for: `✅ Data backed up to Cloudinary`
5. [ ] Wait 15 minutes for service to sleep OR manually restart service
6. [ ] Refresh frontend
7. [ ] Verify change is still there

If data persists, you're good to go! 🎉

## 🚨 Common Issues

### Build Fails
- Check `package-lock.json` is committed
- Verify all dependencies are in `package.json`
- Try: `rm -rf node_modules package-lock.json && npm install`

### Data Doesn't Persist
- Verify Cloudinary credentials in Render
- Check logs for "Data backed up to Cloudinary"
- Re-run: `npm run deploy:upload-data`

### Images Don't Load
- Check Cloudinary credentials
- Verify images in Cloudinary dashboard
- Check CORS settings in backend

### Service Won't Start
- Check Render logs for errors
- Verify environment variables are set
- Check Node version compatibility

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Render Support**: support@render.com (very responsive!)

## 🎯 Ready to Deploy?

If all checkboxes are checked, you're ready!

1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your repository
4. Add environment variables
5. Click "Apply"
6. Wait for deployment (5-10 minutes)
7. Test everything!

Good luck! 🚀
