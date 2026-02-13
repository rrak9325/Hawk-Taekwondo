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

3. Create `backend/.env` file (see SECURITY.md for details):
   ```bash
   cp backend/.env.example backend/.env
   ```

4. Update `backend/.env` with your credentials:
   ```
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password
   FRONTEND_URL=http://localhost:5173
   PORT=3001
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. Start development server:
   ```bash
   npm start
   ```

## Security

⚠️ **IMPORTANT**: Never commit `.env` files or expose API keys. See [SECURITY.md](./SECURITY.md) for detailed security guidelines.

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

See [SECURITY.md](./SECURITY.md) for complete security guidelines.

Required environment variables (set in Render dashboard):
- `ADMIN_USERNAME`: Admin username
- `ADMIN_PASSWORD_HASH`: Bcrypt hashed admin password
- `FRONTEND_URL`: Frontend URL (for CORS)
- `PORT`: Server port (optional, defaults to 3001)
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

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