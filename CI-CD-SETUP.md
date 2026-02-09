# CI/CD Setup Guide for LearnEase

## 📋 What is CI/CD?

**CI (Continuous Integration):** Automatically test your code when you push to GitHub  
**CD (Continuous Deployment):** Automatically deploy your code if tests pass

---

## 🎯 What Happens in the Pipeline?

### ✅ When Everything Works:
```
1. You push code to GitHub
   ↓
2. GitHub Actions automatically:
   ├─ Installs dependencies
   ├─ Runs 5 test cases
   ├─ Lints code
   ├─ Builds frontend
   └─ ✅ All pass!
   ↓
3. Deploys backend to Render
   ↓
4. Deploys frontend to Vercel
   ↓
5. Runs health check
   ↓
6. ✅ Your app is LIVE!
```

### ❌ When Tests Fail:
```
1. You push code to GitHub
   ↓
2. GitHub Actions runs tests
   ↓
3. ❌ Test fails!
   ↓
4. ⛔ DEPLOYMENT BLOCKED
   ↓
5. 📧 You get email: "Build failed"
   ↓
6. ✅ Old version stays live (users safe!)
   ↓
7. You fix bug and push again
```

---

## 🚀 Step-by-Step Setup

### **Step 1: Setup Render (Backend)**

#### A. Create Render Account
1. Go to https://render.com
2. Click "Get Started" → Sign up with GitHub
3. Authorize Render to access your GitHub

#### B. Create Web Service
1. Click "New +" → "Web Service"
2. Connect your LearnEase repository
3. Configure settings:
   ```
   Name: learnease-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

#### C. Add Environment Variables
Click "Environment" tab and add these:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learnease
JWT_SECRET=your-super-secret-key-change-this
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=5002
ALLOWED_ORIGIN1=https://your-app.vercel.app
ALLOWED_ORIGIN2=http://localhost:5173

# Optional Google Meet
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/api/google/oauth/callback/
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_CALENDAR_ID=primary
```

#### D. Enable Auto-Deploy
1. Scroll to "Auto-Deploy"
2. Toggle ON for "main" branch

#### E. Get Deploy Hook
1. Go to Settings tab
2. Scroll to "Deploy Hook"
3. Click "Create Deploy Hook"
4. Copy the URL: `https://api.render.com/deploy/srv_xxxxx?key=xxxxx`
5. **Save this URL** - needed for GitHub secrets

#### F. Get Your Backend URL
After deployment completes, copy your URL:
```
https://learnease-backend.onrender.com
```

---

### **Step 2: Setup Vercel (Frontend)**

#### A. Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up" → Continue with GitHub
3. Authorize Vercel

#### B. Import Project
1. Click "Add New..." → "Project"
2. Import your LearnEase repository
3. Configure:
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

#### C. Add Environment Variable
Click "Environment Variables":

```bash
VITE_API_URL=https://learnease-backend.onrender.com
```

Add for all environments:
- ✅ Production
- ✅ Preview  
- ✅ Development

#### D. Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Copy your URL: `https://your-app.vercel.app`

#### E. Get Vercel Tokens

**Get Vercel Token:**
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: "GitHub Actions"
4. Copy token (starts with `vercel_...`)

**Get Project IDs:**
1. Go to project → Settings → General
2. Copy "Project ID": `prj_xxxxx`
3. Copy "Team ID": `team_xxxxx` (or "Org ID")

---

### **Step 3: Update Render with Vercel URL**

Go back to Render:
1. Open your backend service
2. Go to Environment tab
3. Update `ALLOWED_ORIGIN1` with your Vercel URL:
   ```
   ALLOWED_ORIGIN1=https://your-app.vercel.app
   ```
4. Click "Save Changes"

---

### **Step 4: Setup GitHub Secrets**

#### Go to GitHub Repository
1. Open LearnEase repo on GitHub
2. Click "Settings" tab
3. Click "Secrets and variables" → "Actions"
4. Click "New repository secret"

#### Add These 6 Secrets

**Secret 1: VITE_API_URL**
- Name: `VITE_API_URL`
- Value: `https://learnease-backend.onrender.com`

**Secret 2: RENDER_BACKEND_DEPLOY_HOOK**
- Name: `RENDER_BACKEND_DEPLOY_HOOK`
- Value: `https://api.render.com/deploy/srv_xxxxx?key=xxxxx`

**Secret 3: BACKEND_URL**
- Name: `BACKEND_URL`
- Value: `https://learnease-backend.onrender.com`

**Secret 4: VERCEL_TOKEN**
- Name: `VERCEL_TOKEN`
- Value: `vercel_xxxxx` (from Vercel account tokens)

**Secret 5: VERCEL_ORG_ID**
- Name: `VERCEL_ORG_ID`
- Value: `team_xxxxx` (from Vercel project settings)

**Secret 6: VERCEL_PROJECT_ID**
- Name: `VERCEL_PROJECT_ID`
- Value: `prj_xxxxx` (from Vercel project settings)

---

### **Step 5: Test the CI/CD Pipeline**

#### Make a Test Change
```bash
# Edit README
echo "# Testing CI/CD" >> README.md

# Commit and push
git add .
git commit -m "test: CI/CD pipeline"
git push origin main
```

#### Watch It Run
1. Go to GitHub → Actions tab
2. You'll see "CI/CD Pipeline" running
3. Watch each step:
   - ✅ Test backend
   - ✅ Test frontend
   - ✅ Deploy backend
   - ✅ Deploy frontend

#### Check Results
- Backend: https://learnease-backend.onrender.com/health
- Frontend: https://your-app.vercel.app

---

## 🔥 What Happens When There's an Error?

### **Scenario 1: Test Fails**

You accidentally break the login:
```javascript
// auth.controller.js
async function login(req, res) {
  return res.status(500).json({ error: 'broken' }); // Bug!
}
```

**CI/CD Response:**
```
✅ Install dependencies
✅ Lint code
❌ Run tests - FAILED!
   Expected status 401, got 500
⛔ DEPLOYMENT BLOCKED
📧 Email: "Build failed on main"
```

**What happens:**
- ❌ New code does NOT deploy
- ✅ Old working version stays live
- ✅ Users never see the bug
- 📧 You get notified immediately

**You fix it:**
```javascript
async function login(req, res) {
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  // ... rest of code
}
```

```bash
git add .
git commit -m "fix: login bug"
git push origin main
```

**CI/CD Response:**
```
✅ All tests pass
✅ Deploy to Render
✅ Deploy to Vercel
🚀 Live in production!
```

---

### **Scenario 2: Build Fails**

Syntax error in code:
```javascript
function myFunction() {
  console.log('test')
// Missing closing brace
```

**CI/CD Response:**
```
✅ Install dependencies
❌ Build frontend - FAILED!
   SyntaxError: Unexpected end of input
⛔ DEPLOYMENT BLOCKED
```

---

### **Scenario 3: Deployment Fails**

Tests pass but Render is down:
```
✅ All tests pass
✅ Build successful
❌ Deploy to Render - FAILED!
   Error: Service unavailable
⛔ DEPLOYMENT INCOMPLETE
```

**What happens:**
- Old version stays live
- You get notified
- You can manually retry

---

## 📊 View Logs

### GitHub Actions Logs
1. Go to GitHub → Actions tab
2. Click on failed workflow
3. See exactly which step failed

### Render Logs
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. See real-time server logs

### Vercel Logs
1. Go to Vercel dashboard
2. Click your project
3. Click "Deployments"
4. Click specific deployment → "Logs"

---

## ✅ Benefits

### Before CI/CD:
- ❌ Push broken code → Users see errors
- ❌ Manual deployment → 30 minutes
- ❌ Forgot to test → Production breaks
- ❌ Deploy at 2 AM → Tired, make mistakes

### After CI/CD:
- ✅ Push broken code → Blocked automatically
- ✅ Automatic deployment → 3 minutes
- ✅ Always tested → Production safe
- ✅ Deploy anytime → Robots don't sleep

---

## 🛠️ Troubleshooting

### Tests fail locally?
```bash
cd server
npm test -- --verbose
```

### Deployment blocked?
1. Check GitHub Actions logs
2. Fix the error
3. Push again

### Need to skip CI/CD?
```bash
git commit -m "docs: update README [skip ci]"
```

### Render deployment slow?
- Free tier sleeps after 15 min inactivity
- First request takes 30-60 seconds to wake up
- Upgrade to paid tier for always-on

---

## 📝 Quick Reference

### Run tests locally:
```bash
cd server && npm test
```

### Check build locally:
```bash
cd client && npm run build
```

### Push to trigger CI/CD:
```bash
git push origin main
```

### View GitHub Actions:
```
https://github.com/YOUR_USERNAME/LearnEase/actions
```

### Check backend health:
```
https://your-backend.onrender.com/health
```

---

## 🎉 You're Done!

Your CI/CD pipeline is now set up! Every time you push to main:
1. Tests run automatically
2. Code deploys if tests pass
3. You get notified of success/failure
4. Users always see working code

**Next push will trigger automatic deployment!**
