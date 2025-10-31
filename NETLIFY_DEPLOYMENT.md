# Netlify Deployment Guide for Sora Video Studio

## 🚀 Quick Deployment (7 Minutes)

This guide will walk you through deploying your Sora Video Studio to Netlify.

---

## Prerequisites

- ✅ Netlify account (free) - [Sign up here](https://app.netlify.com/signup)
- ✅ GitHub account
- ✅ OpenAI API key with Sora API access
- ✅ Code ready (you have this!)

---

## Step 1: Push to GitHub (2 minutes)

If you haven't already pushed your code to GitHub:

```powershell
# Navigate to your project directory (if not already there)
cd c:\Users\ASUS\sora-video-studio

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for Netlify deployment"

# Create a new repository on GitHub, then connect it:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sora-video-studio.git
git push -u origin main
```

---

## Step 2: Install Netlify Next.js Plugin (1 minute)

Add the Netlify Next.js plugin to your project:

```powershell
npm install -D @netlify/plugin-nextjs
```

Then commit and push:

```powershell
git add package.json package-lock.json
git commit -m "Add Netlify Next.js plugin"
git push
```

---

## Step 3: Deploy to Netlify (4 minutes)

### Option A: Deploy via Netlify UI (Recommended)

1. **Go to Netlify:**
   - Visit [https://app.netlify.com](https://app.netlify.com)
   - Sign in with your GitHub account

2. **Import Project:**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub
   - Select your `sora-video-studio` repository

3. **Configure Build Settings:**
   
   Netlify should auto-detect Next.js, but verify:
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Functions directory:** (leave empty - handled by plugin)

4. **Add Environment Variables:**
   - Click "Show advanced"
   - Click "New variable"
   - Add:
     ```
     Key: OPENAI_API_KEY
     Value: [Your new OpenAI API key - remember to rotate the old one!]
     ```

5. **Deploy:**
   - Click "Deploy site"
   - Wait 3-5 minutes for the build to complete
   - Netlify will show you the deployment progress

6. **Get Your URL:**
   - Once deployed, you'll get a URL like: `https://random-name-123456.netlify.app`
   - You can customize this in Site settings → Domain management

### Option B: Deploy via Netlify CLI

```powershell
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: sora-video-studio (or your choice)
# - Build command: npm run build
# - Publish directory: .next

# Set environment variable
netlify env:set OPENAI_API_KEY "your-new-api-key"

# Deploy
netlify deploy --prod
```

---

## Step 4: Verify Deployment

1. **Open your Netlify URL**
2. **Test the application:**
   - Interface should load properly
   - Try generating a test video
   - Verify video history works
   - Test download functionality

---

## 🔧 Troubleshooting

### Issue: "Build failed - Next.js plugin not found"

**Solution:**
```powershell
npm install -D @netlify/plugin-nextjs
git add package.json package-lock.json netlify.toml
git commit -m "Fix Netlify plugin"
git push
```
Then trigger a new deploy in Netlify dashboard.

### Issue: "Environment variable not working"

**Solution:**
1. Go to Netlify dashboard
2. Site settings → Environment variables
3. Add `OPENAI_API_KEY` with your new key
4. Trigger a new deploy

### Issue: "API routes returning 404"

**Solution:**
The `@netlify/plugin-nextjs` handles API routes automatically. Make sure:
1. The plugin is installed (`npm install -D @netlify/plugin-nextjs`)
2. `netlify.toml` exists with the plugin configuration
3. You've pushed these changes to GitHub

### Issue: "Functions timeout"

**Solution:**
Video generation can take time. Netlify functions have a 10-second timeout on free tier, 26 seconds on Pro.

For long-running operations:
1. Upgrade to Netlify Pro (if needed)
2. Or consider using background functions (Pro feature)
3. Or use Vercel instead (better for long-running operations)

### Issue: "Build succeeds but site doesn't work"

**Solution:**
1. Check the build logs in Netlify dashboard
2. Verify environment variables are set
3. Check browser console for errors
4. Make sure `netlify.toml` is properly configured

---

## 🎯 Post-Deployment Setup

### 1. Custom Domain (Optional)

1. Go to **Site settings → Domain management**
2. Click "Add custom domain"
3. Follow DNS setup instructions
4. Netlify provides free SSL automatically

### 2. Rotate Your API Key ⚠️

**IMPORTANT:** The API key in your `.env.local` was exposed in our chat:
```
sk-svcacct-DjyHKsB_XNfMYsJHATBKMf9oZMky999OVZ...
```

**Before sharing with your team:**
1. Go to https://platform.openai.com/api-keys
2. Revoke the old key
3. Create a new key
4. Update in Netlify: Site settings → Environment variables

### 3. Configure Deploy Settings

**Auto-deploy on push:**
- Go to Site settings → Build & deploy
- Under "Continuous deployment", verify auto-deploy is enabled
- Now every `git push` will automatically deploy!

**Deploy previews:**
- Enable "Deploy Previews" for pull requests
- Great for testing changes before merging

### 4. Monitor Your Site

**Netlify Analytics (Optional - Paid):**
- Server-side analytics
- No cookies needed
- Privacy-friendly

**OpenAI Usage:**
- Monitor at https://platform.openai.com/usage
- Set up billing alerts to avoid surprises

---

## 💰 Netlify Pricing

### Free Tier (Starter)
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ Automatic HTTPS
- ✅ Deploy previews
- ⚠️ Function timeout: 10 seconds
- ⚠️ Function execution: 125K requests/month

**Perfect for your use case!**

### Pro Tier ($19/month)
- ✅ 1 TB bandwidth/month
- ✅ Longer function timeouts (26 seconds)
- ✅ Background functions
- ✅ Analytics
- ✅ Priority support

**Consider if you need longer video generation times**

---

## 🔄 Updating Your App

Super simple with Netlify:

```powershell
# Make your changes
git add .
git commit -m "Description of changes"
git push
```

**That's it!** Netlify automatically detects the push and redeploys. ✨

---

## 📊 Netlify vs Vercel Comparison

| Feature | Netlify | Vercel |
|---------|---------|--------|
| **Setup Time** | 7 min | 5 min |
| **Function Timeout (Free)** | 10s | 10s |
| **Function Timeout (Paid)** | 26s | 60s |
| **Bandwidth (Free)** | 100 GB | 100 GB |
| **Build Minutes (Free)** | 300 min | 6000 min |
| **Best For** | Static sites, JAMstack | Next.js apps |
| **Next.js Support** | Good (via plugin) | Excellent (native) |

**Note:** Both are excellent choices. Netlify is great, but Vercel has better Next.js integration.

---

## 🆘 Common Issues

### Middleware Not Working
The middleware should work with the Netlify Next.js plugin. If you have issues:
1. Verify `@netlify/plugin-nextjs` is installed
2. Check Netlify function logs for errors
3. The plugin automatically handles middleware

### Large Build Size
If builds are slow:
1. Check `node_modules` size
2. Use `npm ci` instead of `npm install` in build
3. Enable build caching in Netlify settings

### CORS Issues
The middleware handles CORS. If you get CORS errors:
1. Check the middleware is deployed
2. Verify environment variables are set
3. Check Netlify function logs

---

## 📱 Share with Your Team

Once deployed, send this to your team:

```
Hi team! 👋

Our Sora Video Studio is now live on Netlify!

🔗 URL: https://your-site.netlify.app

Features:
✅ Generate AI videos with Sora
✅ Remix and iterate
✅ Social media presets
✅ Download videos
✅ Track history

Get started:
1. Open the URL
2. Enter a video prompt
3. Select settings
4. Click "Generate"
5. Wait for your video!

Enjoy! 🎬
```

---

## 🔐 Security Checklist

- [ ] API key rotated (old one revoked)
- [ ] Environment variable set in Netlify dashboard
- [ ] `.env.local` not committed to GitHub
- [ ] HTTPS enabled (automatic with Netlify)
- [ ] Security headers configured (in netlify.toml)
- [ ] Domain configured (optional)

---

## 📞 Support Resources

**Netlify Documentation:**
- Netlify Docs: https://docs.netlify.com
- Next.js on Netlify: https://docs.netlify.com/integrations/frameworks/next-js/
- Netlify Support: https://answers.netlify.com

**OpenAI Resources:**
- Sora API Docs: https://platform.openai.com/docs/guides/video-generation
- API Keys: https://platform.openai.com/api-keys
- Usage Dashboard: https://platform.openai.com/usage

**Netlify Status:**
- Status Page: https://www.netlifystatus.com

---

## 🎉 You're All Set!

Your Sora Video Studio is now deployed on Netlify!

**What's next:**
1. Share the URL with your team
2. Monitor usage in OpenAI dashboard
3. Customize domain if desired
4. Enjoy creating videos!

**Deployment Time:** ~7 minutes  
**Hosting Cost:** FREE  
**Maintenance:** Automatic on git push  
**Status:** 🟢 Production Ready

---

**Need help?** Check the troubleshooting section above or refer to Netlify documentation.

Happy deploying! 🚀
