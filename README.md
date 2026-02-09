# Hawk Taekwondo Training Centre Website

A modern, responsive website for Hawk Taekwondo Training Centre built with React, Vite, and Express.

## Features

- 🥋 Modern martial arts website design
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔐 Admin panel for content management
- 🖼️ Image optimization with Sharp
- 📅 Dynamic class scheduling
- 🎨 Beautiful animations with Framer Motion
- 📊 Gallery management system

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js
- **Image Processing**: Sharp
- **Authentication**: bcryptjs
- **Deployment**: Vercel

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials:
   ```
   ADMIN_USER=your_username
   ADMIN_PASS_HASH=your_bcrypt_hashed_password
   FRONTEND_URL=http://localhost:5173
   PORT=3001
   ```

5. Start development server:
   ```bash
   npm start
   ```

## Building for Production

```bash
npm run build
```

## Deployment to Vercel

1. Push to GitHub (private repository)
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## Environment Variables

- `ADMIN_USER`: Admin username
- `ADMIN_PASS_HASH`: Bcrypt hashed admin password
- `FRONTEND_URL`: Frontend URL (for CORS)
- `PORT`: Server port (optional, defaults to 3001)

## Admin Panel

Access the admin panel at `/admin` with your configured credentials.

Features:
- School information management
- Media upload and optimization
- Program management
- Schedule editing
- Instructor profiles
- Testimonials
- Gallery management

## License

Private - All rights reserved