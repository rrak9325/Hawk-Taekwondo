# Backend Verification Guide

## Your Backend URL
**Correct URL**: `https://hawktaekwondo.onrender.com`

## Quick Tests

### 1. Health Check
Open this URL in your browser:
```
https://hawktaekwondo.onrender.com/health
```

**Expected Response**: JSON with server status, uptime, memory usage, etc.

### 2. API Data Endpoint
Open this URL in your browser:
```
https://hawktaekwondo.onrender.com/api/data
```

**Expected Response**: JSON with your school data (hero, about, programs, etc.)

### 3. Frontend (if deployed on same server)
Open this URL in your browser:
```
https://hawktaekwondo.onrender.com
```

**Expected Response**: Your Hawk Taekwondo website homepage

---

## UptimeRobot Configuration

When setting up UptimeRobot monitoring:

**Monitor URL**: `https://hawktaekwondo.onrender.com/health`

This endpoint returns:
- Status 200 when healthy
- Status 503 when unhealthy
- Detailed server metrics

---

## Common Endpoints

| Endpoint | URL | Purpose |
|----------|-----|---------|
| Health Check | `/health` | Server status monitoring |
| Get Data | `/api/data` | Fetch school data |
| Update Data | `/api/data` | Update school data (POST) |
| Login | `/api/auth/login` | Admin authentication |
| Upload Media | `/api/upload` | Upload images/videos |
| Clean Media | `/api/upload/clean` | Remove unused media |

---

## Testing Commands

### Using curl (Windows CMD)
```cmd
curl https://hawktaekwondo.onrender.com/health
curl https://hawktaekwondo.onrender.com/api/data
```

### Using PowerShell
```powershell
Invoke-WebRequest -Uri "https://hawktaekwondo.onrender.com/health"
Invoke-WebRequest -Uri "https://hawktaekwondo.onrender.com/api/data"
```

---

## Next Steps

1. ✅ Verify backend is accessible at `https://hawktaekwondo.onrender.com/health`
2. ✅ Verify API endpoint works at `https://hawktaekwondo.onrender.com/api/data`
3. ✅ Rebuild frontend with correct `VITE_API_URL` in `.env.production`
4. ✅ Deploy updated frontend
5. ✅ Set up UptimeRobot with `/health` endpoint

---

## Troubleshooting

### If you get 404 errors:
- Make sure you're using `hawktaekwondo.onrender.com` (NOT `hawk-taekwondo-backend.onrender.com`)
- Check that your Render service is running
- Verify the service name in your Render dashboard

### If backend is slow to respond:
- Render free tier spins down after inactivity
- First request may take 30-60 seconds to wake up
- Consider upgrading to paid tier for always-on service

### If CORS errors occur:
- Backend already allows your domain in CORS config
- Make sure frontend uses correct `VITE_API_URL`
- Rebuild frontend after changing `.env.production`
