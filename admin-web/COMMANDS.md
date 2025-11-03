# Admin Web Panel - Command Reference

## Installation

```bash
# Navigate to admin-web directory
cd admin-web

# Install all dependencies
npm install
```

## Development

```bash
# Start development server (opens at http://localhost:3000)
npm run dev

# Start on different port
# Edit vite.config.js and change port number
```

## Building

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Deployment

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Netlify
```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Build the project
npm run build

# Deploy
firebase deploy
```

## Maintenance

```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force
```

## Troubleshooting

```bash
# If port 3000 is in use
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Fix permission issues
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Quick Start (Copy-Paste)

```bash
# Complete setup and run
cd admin-web
npm install
npm run dev
```

## Environment Variables (Optional)

Create `.env` file in admin-web directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

Then update `src/firebase.js` to use environment variables.

## Testing

```bash
# Run in development mode and test manually
npm run dev

# Build and test production version
npm run build
npm run preview
```

## File Structure Commands

```bash
# View project structure
tree -I 'node_modules|dist'

# Count lines of code
find src -name '*.jsx' -o -name '*.css' | xargs wc -l

# Search for specific code
grep -r "searchTerm" src/
```

## Git Commands

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Add web-based admin panel"

# Push to repository
git push origin main
```

## Package Management

```bash
# Add new package
npm install package-name

# Add dev dependency
npm install -D package-name

# Remove package
npm uninstall package-name

# List installed packages
npm list --depth=0
```

## Performance

```bash
# Analyze bundle size
npm run build
# Check dist folder size

# Run lighthouse audit
npx lighthouse http://localhost:3000 --view
```

## Common Issues & Fixes

### Issue: Module not found
```bash
npm install
```

### Issue: Port already in use
```bash
# Change port in vite.config.js
server: { port: 3001 }
```

### Issue: Firebase connection error
```bash
# Check firebase.js configuration
# Verify Firebase project settings
```

### Issue: Build fails
```bash
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

---

**Quick Reference Card**

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `vercel` | Deploy to Vercel |
| `netlify deploy` | Deploy to Netlify |
| `firebase deploy` | Deploy to Firebase |

---

For more details, see README.md
