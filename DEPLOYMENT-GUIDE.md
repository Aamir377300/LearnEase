# Deployment Guide - How It Works

## 🎯 What Happens When You Push Code

### ✅ **Scenario 1: Everything Works (Happy Path)**

```
1. You push code to GitHub
   ↓
2. GitHub Actions runs tests
   ├─ ✅ Backend tests pass (5/5)
   ├─ ✅ Frontend lints successfully
   └─ ✅ Frontend builds successfully
   ↓
3. Deploy to Render (backend)
   ├─ Render pulls latest code
   ├─ Builds new version
   ├─ Deploys new version
   └─ ✅ Health check passes
   ↓
4. Deploy to Vercel (frontend)
   ├─ Vercel pulls latest code
   ├─ Builds new version
   └─ ✅ Deploys new version
   ↓
5. 🎉 NEW VERSION IS LIVE!
```

**Result:** Users see your new features immediately.

---

### ❌ **Scenario 2: Tests Fail (Protection Kicks In)**

```
1. You push broken code to GitHub
   ↓
2. GitHub Actions runs tests
   ├─ ❌ Backend test fails (4/5)
   │  └─ Error: Expected 401, got 500
   └─ ⛔ STOP HERE
   ↓
3. ⛔ DEPLOYMENT BLOCKED
   ↓
4. ✅ OLD VERSION STAYS LIVE
   ↓
5. 📧 You get email: "Build failed"
```

**Result:** Users never see the broken code. Your app keeps working.

---

### ❌ **Scenario 3: Build Fails**

```
1. You push code with syntax error
   ↓
2. GitHub Actions runs tests
   ├─ ✅ Backend tests pass
   ├─ ✅ Frontend lints
   └─ ❌ Frontend build fails
      └─ SyntaxError: Unexpected token
   ↓
3. ⛔ DEPLOYMENT BLOCKED
   ↓
4. ✅ OLD VERSION STAYS LIVE
```

**Result:** Broken code never reaches production.

---

### ⚠️ **Scenario 4: Deployment Fails (Rare)**

```
1. You push code
   ↓
2. ✅ All tests pass
   ↓
3. ✅ Build successful
   ↓
4. Deploy to Render
   ├─ ❌ Render service unavailable
   └─ Deployment fails
   ↓
5. ✅ OLD VERSION STAYS LIVE
   ↓
6. 📧 You get notification
```

**Result:** Old version keeps running. You can retry manually.

---

## 🚀 Setup Instructions

### **Step 1: Setup Render (Backend)**

1. Go to https://render.com
2. Sign up with GitHub
3. Create new Web Service
4. Connect LearnEase repo
5. Configure:
   ```
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```
6. Add environment variables (from server/.env)
7. Enable Auto-Deploy for main branch
8. Copy Deploy Hook URL

### **Step 2: Setup Vercel (Frontend)**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import LearnEase project
4. Configure:
   ```
   Root Directory: client
   Framework: Vite
   Build Command: npm run build
   Output Directory: dist
   ```
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
6. Get Vercel Token from Account → Tokens
7. Get Project ID and Org ID from Settings

### **Step 3: Add GitHub Secrets**

Go to GitHub → Settings → Secrets → Actions

Add these secrets:

```
VITE_API_URL=https://your-backend.onrender.com
RENDER_BACKEND_DEPLOY_HOOK=https://api.render.com/deploy/srv_xxxxx?key=xxxxx
BACKEND_URL=https://your-backend.onrender.com
VERCEL_TOKEN=vercel_xxxxx
VERCEL_ORG_ID=team_xxxxx
VERCEL_PROJECT_ID=prj_xxxxx
```

### **Step 4: Test It!**

```bash
# Make a small change
echo "# Testing deployment" >> README.md

# Push to GitHub
git add .
git commit -m "test: automatic deployment"
git push origin main
```

Watch it deploy automatically!

---

## 📊 How to Monitor

### **GitHub Actions:**
- Go to: https://github.com/YOUR_USERNAME/LearnEase/actions
- See real-time progress
- View logs if something fails

### **Render Dashboard:**
- Go to: https://dashboard.render.com
- Click your service
- View "Logs" tab
- See deployment status

### **Vercel Dashboard:**
- Go to: https://vercel.com/dashboard
- Click your project
- View "Deployments"
- See build logs

---

## 🛡️ Safety Features

### **1. Tests Must Pass**
- If any test fails → No deployment
- Old version stays live
- You get notified

### **2. Build Must Succeed**
- If build fails → No deployment
- Old version stays live
- You get notified

### **3. Health Checks**
- After deployment, checks if backend is responding
- If health check fails → You get notified
- Render keeps old version running

### **4. Automatic Rollback**
- Render: If new version crashes, auto-rollback
- Vercel: Previous deployment stays accessible
- You can manually rollback anytime

---

## 🔧 Manual Operations

### **Rollback to Previous Version:**

**Render:**
1. Go to Render dashboard
2. Click your service
3. Click "Manual Deploy"
4. Select previous commit
5. Click "Deploy"

**Vercel:**
1. Go to Vercel dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "..." → "Promote to Production"

### **Skip CI/CD (Emergency):**

```bash
git commit -m "hotfix: critical bug [skip ci]"
git push origin main
```

This skips GitHub Actions but Render/Vercel still auto-deploy.

---

## 📈 Workflow Diagram

```
┌─────────────────┐
│   Push to Main  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Run Tests      │
│  ├─ Backend     │
│  └─ Frontend    │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Pass?   │
    └────┬────┘
         │
    ┌────┴────┐
    │   Yes   │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│  Build Frontend │
└────────┬────────┘
         │
    ┌────┴────┐
    │Success? │
    └────┬────┘
         │
    ┌────┴────┐
    │   Yes   │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│ Deploy Backend  │
│   (Render)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Deploy Frontend │
│   (Vercel)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ✅ LIVE!        │
└─────────────────┘

If ANY step fails:
    ⛔ STOP
    ✅ Keep old version
    📧 Notify you
```

---

## 🎯 Summary

**What you get:**
- ✅ Automatic testing on every push
- ✅ Automatic deployment if tests pass
- ✅ Old version stays live if anything fails
- ✅ Email notifications
- ✅ Easy rollback
- ✅ Zero downtime

**What you do:**
1. Write code
2. Push to GitHub
3. That's it!

The robots handle the rest. 🤖
