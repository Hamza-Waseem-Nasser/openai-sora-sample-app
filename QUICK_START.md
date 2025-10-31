# Sora Video Studio - Quick Start Guide

## 🚀 Fastest Deployment (5 Minutes)

This guide will get your team working with the Sora Video Studio in the fastest way possible.

### Prerequisites
- [x] OpenAI API Key with Sora API access
- [x] GitHub account (free)
- [x] Vercel account (free) - [Sign up here](https://vercel.com/signup)

---

## Step 1: Prepare the Repository

### Option A: If you haven't pushed to GitHub yet

```powershell
# Navigate to project directory
cd c:\Users\ASUS\sora-video-studio

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Sora Video Studio"

# Create a new repository on GitHub, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sora-video-studio.git
git push -u origin main
```

### Option B: If already on GitHub
Just make sure your latest changes are pushed.

---

## Step 2: Deploy to Vercel (3 Minutes)

1. **Go to Vercel:**
   - Visit [https://vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select your `sora-video-studio` repository
   - Click "Import"

3. **Configure:**
   - **Framework:** Next.js (should be auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)

4. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add variable:
     - **Name:** `OPENAI_API_KEY`
     - **Value:** `your-openai-api-key` (from your .env.local file)
   - Click "Add"

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment to complete

6. **Get Your URL:**
   - Once deployed, Vercel will show your app URL
   - Format: `https://your-project-name.vercel.app`
   - **Share this URL with your team!**

---

## Step 3: Verify Deployment

1. Open your Vercel URL
2. You should see the Sora Video Studio interface
3. Try generating a test video:
   - Enter a prompt: "A serene sunset over mountains"
   - Select model: `sora-2`
   - Click "Generate"
   - Wait for video generation (this may take a few minutes)

---

## 🎉 You're Done!

Your team can now access the application at the Vercel URL.

### What Your Team Can Do:
- Generate videos with AI prompts
- Remix existing videos
- Use social media presets (Instagram, TikTok, etc.)
- Download generated videos
- View generation history

---

## 🔄 Making Updates

When you need to update the application:

```powershell
# Make your changes
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically redeploy! ✨

---

## 🆘 Troubleshooting

### Issue: "Deployment failed"
- **Solution:** Check that your `package.json` and dependencies are correct
- Run `npm run build` locally to test

### Issue: "API key not working"
- **Solution:** Verify the API key in Vercel dashboard
- Go to Project Settings → Environment Variables
- Make sure `OPENAI_API_KEY` is set correctly

### Issue: "Forbidden error"
- **Solution:** The middleware protects API routes
- Make sure you're accessing the site through the Vercel URL (not localhost)

### Issue: "Videos not generating"
- **Solution:** Verify your OpenAI account has Sora API access
- Check OpenAI API usage dashboard for errors

---

## 📊 Alternative: Local Team Access (For Testing)

If you need quick local access for testing before deploying:

```powershell
# Make sure you're in the project directory
cd c:\Users\ASUS\sora-video-studio

# Start the development server
npm run dev
```

Then share your local IP with team members on the same network:
- Find your IP: `ipconfig` (look for IPv4 Address)
- Share: `http://YOUR_IP:3000`

**Note:** This only works on the same local network and requires your computer to stay on.

---

## 🔐 Security Recommendations

Before sharing with your team:

1. **Rotate the API Key:**
   - The key in your `.env.local` was exposed in this chat
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Revoke the old key: `sk-svcacct-DjyHKsB_XNfMYsJHATBKMf9oZMky999OVZ...`
   - Create a new key
   - Update in Vercel: Project Settings → Environment Variables

2. **Add Team Access Control:**
   - Consider adding authentication (Auth0, NextAuth, etc.)
   - Set usage limits on the OpenAI API key
   - Monitor usage through OpenAI dashboard

3. **Custom Domain (Optional):**
   - In Vercel: Project Settings → Domains
   - Add your custom domain for professional appearance

---

## 💰 Cost Estimates

### Vercel Hosting: **FREE**
- Hobby plan includes:
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Serverless functions
  - Automatic SSL

### OpenAI Sora API:
- Costs vary based on usage
- Check [OpenAI Pricing](https://openai.com/api/pricing/)
- Set usage limits in OpenAI dashboard

---

## 📱 Sharing with Team

Send your team this message:

```
Hi team! 👋

Our Sora Video Studio is now live at: https://your-project.vercel.app

Features:
✅ Generate AI videos with text prompts
✅ Remix and iterate on videos
✅ Social media presets (Instagram, TikTok, YouTube)
✅ Download and share videos

Quick start:
1. Open the URL above
2. Enter a video prompt
3. Select model and settings
4. Click "Generate"
5. Wait for your video!

The interface is intuitive - just explore and create! 🎬
```

---

## 📚 Additional Resources

- Full deployment guide: See `DEPLOYMENT_GUIDE.md`
- Sora API docs: https://platform.openai.com/docs/guides/video-generation
- Next.js docs: https://nextjs.org/docs
- Vercel docs: https://vercel.com/docs

---

**Deployment Time:** ~5 minutes  
**Team Access:** Immediate via URL  
**Cost:** Free hosting + API usage  
**Maintenance:** Automatic updates on git push
