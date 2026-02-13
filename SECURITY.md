# Security Guidelines

## ⚠️ CRITICAL: Environment Variables

This project requires sensitive credentials that must NEVER be committed to the repository.

### Required Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```bash
# Admin Credentials
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password

# Server Configuration
FRONTEND_URL=https://your-frontend-url.com
PORT=3001

# Cloudinary Configuration (for media uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Generating Password Hash

To generate a bcrypt password hash for the admin user:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your_secure_password';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

### Deployment

When deploying to Render or other platforms:

1. Set environment variables in the platform's dashboard
2. NEVER commit `.env` files to the repository
3. The `render.yaml` file uses `sync: false` to prevent exposing secrets
4. Set all required environment variables manually in Render dashboard

### Files That Should NEVER Be Committed

- `backend/.env` - Contains production secrets
- Any file with actual API keys or passwords
- `*.log` files
- `test.txt` or other temporary test files

### Verifying Security

Before pushing to GitHub:

```bash
# Check for accidentally staged .env files
git status

# If .env is shown, remove it:
git rm --cached backend/.env

# Verify .gitignore is working
git check-ignore backend/.env
# Should output: backend/.env
```

## Best Practices

1. Use strong, unique passwords for admin accounts
2. Rotate API keys periodically
3. Never log sensitive information (passwords, API keys, tokens)
4. Use HTTPS in production
5. Keep dependencies updated
6. Review code before deployment
