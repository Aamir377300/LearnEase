# GitHub Secrets - Copy & Paste Guide

## 📋 How to Add Secrets

1. Go to: `https://github.com/YOUR_USERNAME/LearnEase/settings/secrets/actions`
2. Click "New repository secret"
3. Copy the **Name** and **Value** from below
4. Click "Add secret"
5. Repeat for all 6 secrets

---

## 🔑 Secret #1: VITE_API_URL

**Name:**
```
VITE_API_URL
```

**Value:** (Get this AFTER deploying to Render)
```
https://learnease-backend.onrender.com
```

**Where to get it:**
1. Deploy backend to Render first
2. Copy the URL from Render dashboard
3. It looks like: `https://YOUR-SERVICE-NAME.onrender.com`

---

## 🔑 Secret #2: RENDER_BACKEND_DEPLOY_HOOK

**Name:**
```
RENDER_BACKEND_DEPLOY_HOOK
```

**Value:** (Get from Render dashboard)
```
https://api.render.com/deploy/srv_xxxxxxxxxxxxxxxxxxxxx?key=xxxxxxxxxxxxxx
```

**Where to get it:**
1. Go to Render dashboard
2. Click your backend service
3. Go to "Settings" tab
4. Scroll to "Deploy Hook"
5. Click "Create Deploy Hook"
6. Copy the entire URL

---

## 🔑 Secret #3: BACKEND_URL

**Name:**
```
BACKEND_URL
```

**Value:** (Same as VITE_API_URL)
```
https://learnease-backend.onrender.com
```

**Where to get it:**
- Same as Secret #1
- Your Render backend URL

---

## 🔑 Secret #4: VERCEL_TOKEN

**Name:**
```
VERCEL_TOKEN
```

**Value:** (Get from Vercel account settings)
```
vercel_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Where to get it:**
1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: "GitHub Actions"
4. Scope: "Full Account"
5. Click "Create"
6. Copy the token (starts with `vercel_`)
7. **IMPORTANT:** Save it now, you can't see it again!

---

## 🔑 Secret #5: VERCEL_ORG_ID (Optional - Use Project ID if not found)

**Name:**
```
VERCEL_ORG_ID
```

**Value:** (Get from Vercel project settings - OPTIONAL)
```
team_xxxxxxxxxxxxxxxxxxxxxxxx
```

**Where to get it:**
1. Go to Vercel dashboard
2. Click your LearnEase project
3. Go to "Settings" tab
4. Scroll to "General"
5. Look for "Team ID" or "Org ID"
6. **If you don't see it:** Skip this secret! Use Project ID instead.

**Note:** If you're on a personal account (not a team), you might not have an Org ID. That's fine - the workflow will use your Project ID instead.

---

## 🔑 Secret #6: VERCEL_PROJECT_ID

**Name:**
```
VERCEL_PROJECT_ID
```

**Value:** (Get from Vercel project settings)
```
prj_xxxxxxxxxxxxxxxxxxxxxxxx
```

**Where to get it:**
1. Same place as Secret #5
2. In Vercel → Project → Settings → General
3. Copy "Project ID"
4. It looks like: `prj_xxxxx`

---

## ✅ Quick Checklist

Before adding secrets, make sure you have:

- [ ] Created Render account
- [ ] Deployed backend to Render
- [ ] Got Render backend URL
- [ ] Created Render Deploy Hook
- [ ] Created Vercel account
- [ ] Imported project to Vercel
- [ ] Got Vercel Token
- [ ] Got Vercel Project ID
- [ ] Got Vercel Org ID (optional - skip if not available)

**Minimum Required Secrets (5):**
1. VITE_API_URL
2. RENDER_BACKEND_DEPLOY_HOOK
3. BACKEND_URL
4. VERCEL_TOKEN
5. VERCEL_PROJECT_ID

**Optional:**
6. VERCEL_ORG_ID (only if you have a team account)

---

## 🎯 Example (With Fake Values)

Here's what your secrets should look like (with your real values):

| Secret Name | Example Value |
|------------|---------------|
| `VITE_API_URL` | `https://learnease-api.onrender.com` |
| `RENDER_BACKEND_DEPLOY_HOOK` | `https://api.render.com/deploy/srv_abc123?key=xyz789` |
| `BACKEND_URL` | `https://learnease-api.onrender.com` |
| `VERCEL_TOKEN` | `vercel_1a2b3c4d5e6f7g8h9i0j` |
| `VERCEL_ORG_ID` | `team_abc123xyz789` |
| `VERCEL_PROJECT_ID` | `prj_def456uvw012` |

---

## 🚨 Important Notes

1. **Never commit secrets to Git** - They're in GitHub Secrets for a reason
2. **VERCEL_TOKEN is sensitive** - Don't share it
3. **Deploy Render first** - You need the URL before adding secrets
4. **Deploy Vercel first** - You need the IDs before adding secrets
5. **Test after adding** - Push code and watch GitHub Actions

---

## 🔄 Step-by-Step Order

### **Do this in order:**

1. **Setup Render:**
   - Create account
   - Deploy backend
   - Get backend URL
   - Create deploy hook
   - ✅ Now you have: `VITE_API_URL`, `BACKEND_URL`, `RENDER_BACKEND_DEPLOY_HOOK`

2. **Setup Vercel:**
   - Create account
   - Import project
   - Get token
   - Get Org ID
   - Get Project ID
   - ✅ Now you have: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

3. **Add to GitHub:**
   - Go to GitHub Secrets
   - Add all 6 secrets
   - ✅ Done!

4. **Test:**
   - Push code to main
   - Watch GitHub Actions
   - See automatic deployment!

---

## 📸 Screenshots Guide

### **Render - Get Deploy Hook:**
```
Render Dashboard
  → Your Service
    → Settings Tab
      → Deploy Hook Section
        → Create Deploy Hook
          → Copy URL
```

### **Vercel - Get Token:**
```
Vercel Dashboard
  → Account Settings (top right)
    → Tokens Tab
      → Create Token
        → Copy Token
```

### **Vercel - Get IDs:**
```
Vercel Dashboard
  → Your Project
    → Settings Tab
      → General Section
        → Copy "Project ID"
        → Copy "Team ID" or "Org ID"
```

### **GitHub - Add Secrets:**
```
GitHub Repository
  → Settings Tab
    → Secrets and variables
      → Actions
        → New repository secret
          → Enter Name
          → Enter Value
          → Add secret
```

---

## 🎉 After Adding All Secrets

Test your CI/CD:

```bash
# Make a small change
echo "Testing CI/CD" >> README.md

# Commit and push
git add .
git commit -m "test: automatic deployment"
git push origin main
```

Then watch:
1. GitHub Actions runs tests
2. Tests pass ✅
3. Deploys to Render ✅
4. Deploys to Vercel ✅
5. Your app is live! 🚀

---

## ❓ Troubleshooting

**"Secret not found" error:**
- Make sure secret name is EXACTLY as shown (case-sensitive)
- No extra spaces

**"Invalid token" error:**
- Regenerate Vercel token
- Make sure you copied the entire token

**"Deploy hook failed" error:**
- Check Render deploy hook URL is complete
- Make sure service is not paused on Render

**Need help?**
- Check GitHub Actions logs
- Check Render logs
- Check Vercel deployment logs
