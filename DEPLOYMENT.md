# Deployment Guide - Hawk Taekwondo

## Critical Information About Render Free Tier

### Ephemeral Filesystem
Render's free tier uses an **ephemeral filesystem** - this means:
- All files are deleted when the service restarts
- Services restart after 15 minutes of inactivity
- Services restart during deployments
- Any data stored in local files will be lost

### Solution: Cloudinary for Persistence
This app uses Cloudinary to persist data across restarts:
- **Images/Videos**: Uploaded directly to Cloudinary
- **JSON Data**: Backed up to Cloudinary on every save
- **On Restart**: Data is automatically restored from Cloudinary

## Pre-Deployment Checklist

### 1. Cloudinary Setup
Ensure you have a Cloudinary account and credentials:
- Cloud Name
- API Key
- API Secret

### 2. Initial Data Upload
Before deploying, upload your initial mockData.json to Cloudinary:

```bash
# Install Cloudinary CLI (one-time)
npm install -g cloudinary-cli

# Configure Cloudinary
cld config

# Upload initial data
cld uploader upload hawk-taekwondo/public/mockData.json --public-id hawk-taekwondo/data/mockData.json --resource-type raw
```

Or use the Cloudinary web interface:
1. Go to https://cloudinary.com/console
2. Navigate to Media Library
3. Create folder: `hawk-taekwondo/data`
4. Upload `mockData.json` as a raw file

## Render Configuration

### Backend Service Environment Variables
Set these in Render Dashboard:

```
NODE_ENV=production
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=your_bcrypt_hash
FRONTEND_URL=https://your-frontend-url.onrender.com
PORT=10000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Generate Password Hash
```bash
cd hawk-taekwondo/backend
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your_password', 10))"
```

## Deployment Steps

### Option 1: Deploy via Render Dashboard
1. Connect your GitHub repository
2. Create two services:
   - **Backend**: Web Service (Node)
   - **Frontend**: Static Site
3. Use the settings from `render.yaml`
4. Add environment variables
5. Deploy

### Option 2: Deploy via render.yaml
1. Push code to GitHub
2. In Render Dashboard, click "New +"
3. Select "Blueprint"
4. Connect repository
5. Render will read `render.yaml` automatically
6. Add environment variables (they're not in the YAML for security)
7. Deploy

## Post-Deployment Verification

### 1. Check Backend Health
```bash
curl https://your-backend-url.onrender.com/api/data
```

Should return your school data.

### 2. Check Cloudinary Connection
Look for these logs in Render:
```
✅ Cloudinary configured successfully
📦 Cloud Name: your_cloud_name
```

### 3. Test Data Persistence
1. Login to admin panel
2. Make a small change
3. Check Render logs for: `✅ Data backed up to Cloudinary`
4. Restart the service (it will sleep after 15 min anyway)
5. Verify data is still there after restart

### 4. Test Image Upload
1. Upload an image via admin panel
2. Check Cloudinary Media Library
3. Verify image appears in `hawk-taekwondo/images/` folder

## Troubleshooting

### Build Fails
**Error**: `npm ci` fails
**Solution**: 
- Check `package.json` for correct dependencies
- Ensure `package-lock.json` is committed
- Try `npm ci --omit=dev` in render.yaml

### Data Not Persisting
**Error**: Data resets after restart
**Solution**:
- Verify Cloudinary credentials in Render environment variables
- Check logs for "Data backed up to Cloudinary"
- Manually upload mockData.json to Cloudinary

### Images Not Loading
**Error**: Images return 404
**Solution**:
- Check Cloudinary credentials
- Verify images are in Cloudinary Media Library
- Check CORS settings in backend

### Service Sleeps
**Behavior**: Service becomes unresponsive after 15 minutes
**Solution**: This is normal on free tier. Options:
- Upgrade to paid plan ($7/month)
- Use a ping service (e.g., UptimeRobot) to keep it awake
- Accept the cold start delay (15-30 seconds)

## Monitoring

### Check Service Status
- Render Dashboard: https://dashboard.render.com
- View logs in real-time
- Set up email notifications for failures

### Cloudinary Usage
- Monitor storage: https://cloudinary.com/console
- Free tier: 25 GB storage, 25 GB bandwidth/month
- Check usage regularly

## Backup Strategy

### Automatic Backups
- Every data save creates a `.bak` file locally (ephemeral)
- Every data save uploads to Cloudinary (persistent)

### Manual Backup
Download from Cloudinary periodically:
```bash
# Get the data file URL from Cloudinary
curl https://res.cloudinary.com/your_cloud/raw/upload/hawk-taekwondo/data/mockData.json > backup.json
```

## Cost Considerations

### Free Tier Limits
- **Render**: 750 hours/month (enough for 1 service 24/7)
- **Cloudinary**: 25 GB storage, 25 GB bandwidth
- **Total Cost**: $0/month

### When to Upgrade
Consider upgrading when:
- Service sleeps too often (upgrade Render to $7/month)
- Storage exceeds 25 GB (upgrade Cloudinary)
- Need custom domain (Render paid plan)

## Security Notes

1. **Never commit** `.env` files with real credentials
2. **Use environment variables** in Render for all secrets
3. **Rotate credentials** periodically
4. **Enable 2FA** on Cloudinary and Render accounts
5. **Monitor access logs** for suspicious activity

## Support

If you encounter issues:
1. Check Render logs first
2. Verify Cloudinary credentials
3. Test locally with production environment variables
4. Contact Render support (they're very responsive)
