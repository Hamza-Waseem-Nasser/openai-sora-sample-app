# Netlify Deployment Fix Guide

## Current Issue
Your Netlify build succeeds, but the site shows nothing. This is caused by:
1. ❌ Missing environment variables on Netlify
2. ❌ Incorrect redirect configuration
3. ❌ Middleware not configured for Netlify URLs

## ✅ Fixes Applied

### 1. Fixed `netlify.toml`
- Removed incorrect `/index.html` redirect (Next.js doesn't use this)
- The `@netlify/plugin-nextjs` handles routing automatically

### 2. Updated `middleware.ts`
- Added support for Netlify environment variables:
  - `URL` - Your production site URL
  - `DEPLOY_PRIME_URL` - Deploy preview URLs

## 🚀 Steps to Deploy Successfully

### Step 1: Add Environment Variables to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site: **openai-sora-sample-app**
3. Navigate to: **Site configuration** → **Environment variables**
4. Click **Add a variable**
5. Add the following variable:

   ```
   Key: OPENAI_API_KEY
   Value: [Copy your API key from .env.local file]
   ```

   ⚠️ **IMPORTANT**: 
   - Copy the value from your local `.env.local` file
   - Set this for **all deploy contexts** (Production, Deploy Previews, Branch deploys)

### Step 2: Commit and Push Changes

The fixes have already been committed. Just push to trigger redeployment:

```bash
git push origin main
```

### Step 3: Trigger Redeploy

Netlify will automatically redeploy when you push. Alternatively:
1. Go to your site in Netlify
2. Click **Deploys**
3. Click **Trigger deploy** → **Deploy site**

### Step 4: Verify Deployment

Once deployed, check:
1. ✅ Site loads at your Netlify URL (e.g., `https://your-site.netlify.app`)
2. ✅ No console errors in browser DevTools (F12)
3. ✅ API routes work (check Network tab)

## 🔍 Troubleshooting

### If site still shows blank:

1. **Check Browser Console** (F12)
   - Look for errors
   - Common issues: API key not set, CORS errors

2. **Check Netlify Function Logs**
   - Go to: Site → Functions
   - Look for errors in `___netlify-server-handler`

3. **Verify Environment Variables**
   - Site configuration → Environment variables
   - Ensure `OPENAI_API_KEY` is set

4. **Check Build Logs**
   - Look for any errors during build
   - Verify all dependencies installed

### Common Errors:

**Error: "Forbidden — invalid Origin"**
- Solution: The middleware update should fix this
- The site now accepts requests from Netlify URLs

**Error: "OPENAI_API_KEY is not defined"**
- Solution: Add environment variable in Netlify dashboard

**Blank page with no errors:**
- Clear browser cache
- Check if JavaScript is enabled
- Verify deployment actually updated (check deploy time)

## 📝 Additional Configuration (Optional)

### Custom Domain
If you want to use a custom domain:
1. Add it in: Site settings → Domain management
2. Update `NEXT_PUBLIC_APP_URL` environment variable to your custom domain

### Build Performance
To speed up builds, you can:
1. Enable Next.js build cache (already configured)
2. Use faster Node.js version (already set to Node 20)

## 🔐 Security Reminder

⚠️ **NEVER commit `.env.local` to Git!**

Your `.env.local` file should already be in `.gitignore`. Always manage secrets through:
- Netlify Dashboard → Environment variables
- Never hardcode API keys in source code

## ✅ Expected Result

After following these steps, you should see:
- ✅ Your Sora Video Studio app loads
- ✅ All UI components render correctly
- ✅ API endpoints respond (when you try to generate videos)
- ✅ No CORS or middleware errors

## 📞 Still Having Issues?

If problems persist:
1. Share the **Netlify site URL**
2. Check browser console and share errors
3. Review Netlify function logs for server-side errors
