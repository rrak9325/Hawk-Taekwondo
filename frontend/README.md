# Hawk Taekwondo - Frontend

React + Vite frontend for Hawk Taekwondo website.

## Features

- Modern React with Hooks
- Tailwind CSS for styling
- React Router for navigation
- Admin panel for content management
- Image optimization and lazy loading
- Responsive design (mobile-first)

## Setup

```bash
cd frontend
npm install
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001
```

## Run Development

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Output in `dist/` folder

## Pages

- `/` - Home
- `/about` - About Us
- `/programs` - Programs & Classes
- `/schedule` - Class Schedule
- `/faculty` - Instructors
- `/contact` - Contact Us
- `/admin` - Admin Panel (login required)

## Admin Panel

Login at `/admin` to manage:
- Hero section (images/videos)
- Programs and classes
- Instructors
- Class schedule
- Gallery images/videos
- Contact information

## Tech Stack

- React 18
- Vite
- React Router v6
- Tailwind CSS
- Axios for API calls
