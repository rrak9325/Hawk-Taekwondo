# 🚀 Hawk Taekwondo - Available Commands

## 📋 Quick Start Commands

### 🏃‍♂️ Start Everything (Development)
```bash
npm start
```
**What it does:**
- Starts both frontend (http://localhost:5173) and backend (http://localhost:3001)
- Uses development mode with hot reload
- Perfect for development work

### 🏃‍♂️ Alternative Development Start
```bash
npm run dev
```
**What it does:**
- Same as `npm start` - starts both frontend and backend
- Uses development mode with hot reload

## 🔧 Individual Component Commands

### Frontend Only
```bash
npm run start:frontend
# or
npm run dev:frontend
```

### Backend Only
```bash
npm run start:backend
# or  
npm run dev:backend
```

## 🏗️ Build Commands

### Build Everything
```bash
npm run build
```
**What it does:**
- Builds the frontend for production
- Prepares backend (no build needed for Node.js)

### Full Build (with dependencies)
```bash
npm run build:full
```
**What it does:**
- Installs all dependencies
- Builds everything for production

### Frontend Build Only
```bash
npm run build:frontend
```

### Preview Production Build
```bash
npm run preview
```
**What it does:**
- Builds frontend and serves it locally
- Preview how it will look in production

## 📦 Setup Commands

### Install All Dependencies
```bash
npm run install:all
```
**What it does:**
- Installs root dependencies
- Installs frontend dependencies
- Installs backend dependencies

### Clean Everything
```bash
npm run clean
```
**What it does:**
- Removes all node_modules folders
- Removes build artifacts
- Fresh start for troubleshooting

## 🧹 Quality Commands

### Lint Everything
```bash
npm run lint
```

### Lint Frontend Only
```bash
npm run lint:frontend
```

### Lint Backend Only
```bash
npm run lint:backend
```

## 🌐 Deployment Commands

### Vercel Build
```bash
npm run vercel-build
```
**What it does:**
- Builds frontend for Vercel deployment
- Used automatically by Vercel

## 📊 Command Summary

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm start` | Start both frontend & backend | **Main development command** |
| `npm run dev` | Same as start | Alternative development |
| `npm run build` | Build for production | **Main build command** |
| `npm run build:full` | Install deps + build | Clean production build |
| `npm run install:all` | Install all dependencies | **First time setup** |
| `npm run preview` | Preview production build | Test before deployment |
| `npm run clean` | Clean all artifacts | Troubleshooting |
| `npm run lint` | Check code quality | Code review |

## 🎯 Most Common Workflows

### 🆕 First Time Setup
```bash
npm run install:all
npm start
```

### 💻 Daily Development
```bash
npm start
```

### 🚀 Production Build
```bash
npm run build:full
```

### 🧹 Troubleshooting
```bash
npm run clean
npm run install:all
npm start
```

## 🌟 Pro Tips

- **Use `npm start`** for daily development - it's the simplest
- **Frontend runs on**: http://localhost:5173
- **Backend runs on**: http://localhost:3001  
- **Admin panel**: http://localhost:5173/admin
- **Both servers auto-restart** when you make changes
- **Use Ctrl+C** to stop both servers at once

## 🔥 What's Running When You Use `npm start`

```
┌─────────────────────────────────────────┐
│  🚀 npm start                           │
├─────────────────────────────────────────┤
│  Frontend (Vite Dev Server)            │
│  ├─ Port: 5173                         │
│  ├─ Hot Reload: ✅                      │
│  └─ Proxy to Backend: ✅               │
│                                         │
│  Backend (Express Server)              │
│  ├─ Port: 3001                         │
│  ├─ Auto Restart: ✅                   │
│  ├─ API Endpoints: ✅                  │
│  └─ File Upload: ✅                    │
└─────────────────────────────────────────┘
```

**Everything works perfectly with just `npm start`!** 🎉