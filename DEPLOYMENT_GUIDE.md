# Sora Video Studio - Deployment Guide

## 📋 Project Overview

**Project Type:** Next.js 15.5.4 Application (React 19.1.0)  
**Framework:** Next.js with TypeScript  
**Purpose:** AI-powered video generation platform using OpenAI Sora Video API  
**Current Status:** ✅ Ready for deployment

### Key Features
- Generate videos using Sora-2 and Sora-2-Pro models
- Remix existing videos
- AI-powered prompt optimization
- Image generation for video inputs (DALL-E 2)
- User management and video history
- Real-time video polling and progress tracking
- Social media presets (Instagram, TikTok, YouTube, etc.)

### Tech Stack
- **Frontend:** React 19.1.0, Next.js 15.5.4, TypeScript
- **Styling:** Tailwind CSS 4, Radix UI components
- **API:** OpenAI SDK (Sora Video API)
- **State Management:** React hooks with localStorage persistence
- **Icons:** Lucide React

---

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Fastest) ⚡

**Time to Deploy:** ~5 minutes

Vercel is built for Next.js and provides the fastest deployment experience.

#### Steps:

1. **Prerequisites:**
   - GitHub/GitLab/Bitbucket account
   - Vercel account (free tier available)

2. **Push to Git Repository:**
   ```bash
   # If not already a git repository
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

3. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Configure:
     - **Framework Preset:** Next.js (auto-detected)
     - **Root Directory:** ./
     - **Build Command:** `npm run build` (auto-configured)
     - **Output Directory:** .next (auto-configured)
   - Add Environment Variable:
     - Key: `OPENAI_API_KEY`
     - Value: Your OpenAI API key
   - Click "Deploy"

4. **Post-Deployment:**
   - Vercel will provide a URL like `https://your-project.vercel.app`
   - Custom domain can be added in project settings

**Benefits:**
- Automatic CI/CD on git push
- Global CDN
- Automatic SSL
- Preview deployments for PRs
- Zero configuration needed
- Serverless functions for API routes

---

### Option 2: Netlify

**Time to Deploy:** ~7 minutes

#### Steps:

1. **Push to Git Repository** (same as Option 1)

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your repository
   - Configure:
     - **Build command:** `npm run build`
     - **Publish directory:** `.next`
   - Add Environment Variable:
     - `OPENAI_API_KEY`: Your OpenAI API key
   - Click "Deploy site"

**Note:** You may need to add a `netlify.toml` configuration file for Next.js runtime.

---

### Option 3: Docker Deployment

**Time to Deploy:** ~15 minutes

For self-hosting on any cloud provider (AWS, Azure, GCP, DigitalOcean, etc.)

#### Create Dockerfile:

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node server.js
```

#### Create docker-compose.yml:

```yaml
version: '3.8'

services:
  sora-video-studio:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
```

#### Update next.config.ts:

Add to `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  devIndicators: false,
  output: 'standalone', // Add this for Docker
};
```

#### Deploy:

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build and run manually
docker build -t sora-video-studio .
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key sora-video-studio
```

---

### Option 4: Traditional VPS (Ubuntu/Linux Server)

**Time to Deploy:** ~20 minutes

For deployment on DigitalOcean, Linode, AWS EC2, etc.

#### Prerequisites:
- Ubuntu 22.04+ server
- Domain name (optional)
- SSH access

#### Steps:

1. **SSH into your server:**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

3. **Install Nginx (optional, for reverse proxy):**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

4. **Clone and setup project:**
   ```bash
   cd /var/www
   git clone <your-repo-url> sora-video-studio
   cd sora-video-studio
   npm install
   ```

5. **Create .env.local:**
   ```bash
   nano .env.local
   ```
   Add:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

6. **Build the application:**
   ```bash
   npm run build
   ```

7. **Start with PM2:**
   ```bash
   pm2 start npm --name "sora-video-studio" -- start
   pm2 save
   pm2 startup
   ```

8. **Configure Nginx (optional):**
   ```bash
   sudo nano /etc/nginx/sites-available/sora-video-studio
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable:
   ```bash
   sudo ln -s /etc/nginx/sites-available/sora-video-studio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Setup SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 🔐 Environment Variables

Required environment variable:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key with Sora access | Yes | `sk-...` |
| `NEXT_PUBLIC_APP_URL` | Public app URL (optional) | No | `https://yourapp.com` |
| `VERCEL_URL` | Auto-set by Vercel | Auto | N/A |

**⚠️ SECURITY NOTE:** The `.env.local` file in your project contains an active API key. Make sure this file is:
1. Never committed to public repositories (it's in `.gitignore`)
2. Updated with your own key before deployment
3. Kept secure and rotated regularly

---

## 📊 Resource Requirements

### Minimum:
- **CPU:** 1 vCPU
- **RAM:** 1 GB
- **Storage:** 2 GB
- **Network:** Moderate bandwidth (video downloads)

### Recommended for Production:
- **CPU:** 2+ vCPUs
- **RAM:** 2-4 GB
- **Storage:** 10 GB
- **Network:** High bandwidth with CDN

---

## ✅ Pre-Deployment Checklist

- [ ] OpenAI API key with Sora API access obtained
- [ ] Environment variables configured
- [ ] Dependencies installed (`npm install`)
- [ ] Build successful (`npm run build`)
- [ ] No TypeScript or lint errors
- [ ] API key is secure and not in public repository
- [ ] Domain name configured (if applicable)
- [ ] SSL certificate setup (for production)

---

## 🧪 Testing Deployment

### Local Testing:
```bash
# Development mode
npm run dev

# Production build test
npm run build
npm start
```

### Post-Deployment Testing:
1. Visit your deployed URL
2. Test video generation with a simple prompt
3. Check video history persistence
4. Test remix functionality
5. Verify image generation
6. Check responsive design on mobile

---

## 🔄 Continuous Deployment

### Vercel/Netlify:
Automatic deployments on git push to main branch.

### Docker:
Set up CI/CD pipeline (GitHub Actions example):

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and push Docker image
        run: |
          docker build -t your-registry/sora-video-studio .
          docker push your-registry/sora-video-studio
```

---

## 🐛 Troubleshooting

### Build Failures:
- Ensure Node.js version is 18+ (recommended: 20)
- Clear `.next` folder and rebuild
- Check for TypeScript errors: `npm run lint`

### Runtime Errors:
- Verify `OPENAI_API_KEY` is set correctly
- Check API key has Sora API access
- Review browser console for client-side errors
- Check server logs for API errors

### Performance Issues:
- Enable caching in production
- Use CDN for static assets
- Optimize images in `/public`
- Consider adding Redis for session storage

---

## 📞 Support

For Sora API issues:
- [OpenAI Platform Docs](https://platform.openai.com/docs/guides/video-generation)
- [OpenAI Support](https://help.openai.com)

For deployment issues:
- Check deployment platform documentation
- Review Next.js deployment guide
- Check project GitHub issues

---

## 🎯 Recommended Deployment Strategy

**For Quick Team Access:** Use **Option 1 (Vercel)** - It's the fastest and requires minimal setup.

**Steps:**
1. Push code to GitHub
2. Connect to Vercel
3. Add `OPENAI_API_KEY` environment variable
4. Deploy (takes ~3 minutes)
5. Share the Vercel URL with your team

**Benefits for Team:**
- Instant access via URL
- Automatic HTTPS
- No server maintenance
- Free tier available
- Preview deployments for testing changes

---

## 📝 Notes

- This is a Next.js App Router application (not Pages Router)
- Uses React Server Components and Client Components
- API routes are protected with origin/referer checks (see `middleware.ts`)
- Video history is stored in browser localStorage (client-side only)
- No database required for basic functionality
- Consider adding authentication for production team use
