# 🚀 Netlify Quick Deploy - 3 Steps

## ⚡ Deploy in 7 Minutes

### Step 1: Push to GitHub (2 min)

```powershell
git add .
git commit -m "Ready for Netlify deployment"
git push
```

If you haven't set up GitHub yet:
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/sora-video-studio.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy on Netlify (4 min)

1. **Go to:** https://app.netlify.com
2. **Click:** "Add new site" → "Import an existing project"
3. **Connect:** GitHub and select your repository
4. **Configure:**
   - Build command: `npm run build` ✓ (auto-detected)
   - Publish directory: `.next` ✓ (auto-detected)
5. **Add Environment Variable:**
   - Click "Show advanced" → "New variable"
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
6. **Click:** "Deploy site"

---

### Step 3: Share URL (1 min)

- Your site will be at: `https://random-name-123456.netlify.app`
- Share this URL with your team
- Done! 🎉

---

## ⚠️ IMPORTANT: Rotate API Key

Your API key was exposed in the chat. Before deploying:

1. Go to https://platform.openai.com/api-keys
2. Revoke: `sk-svcacct-DjyHKsB_XNfMYsJHATBKMf9oZMky999OVZ...`
3. Create a new key
4. Use the new key in Netlify

---

## 📁 Files Ready

✅ `netlify.toml` - Netlify configuration  
✅ `@netlify/plugin-nextjs` - Installed  
✅ Build successful - Ready to deploy

---

## 🆘 Need Help?

See `NETLIFY_DEPLOYMENT.md` for detailed instructions and troubleshooting.

---

**Total Time:** 7 minutes  
**Cost:** FREE  
**Status:** ✅ Ready to deploy
