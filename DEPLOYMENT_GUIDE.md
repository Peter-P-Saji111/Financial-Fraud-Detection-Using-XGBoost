# Production Deployment Guide

## Summary of Changes

### Backend Changes

1. **database.py**
   - Removed SQLite fallback, PostgreSQL now required
   - Added validation for DATABASE_URL environment variable
   - Added pool_pre_ping for connection health checks
   - Fixed context manager to avoid double commit

2. **api.py**
   - Improved CORS parsing with whitespace handling
   - Fixed database session management (flush instead of commit in context)
   - Better error handling

3. **model/predict.py**
   - Added environment variable support for model paths
   - Added type hints and docstring
   - Removed Windows-specific path assumptions

4. **requirements.txt**
   - Added psycopg2-binary for PostgreSQL support
   - All dependencies use >= for compatibility

5. **.env.example**
   - Updated to use PostgreSQL connection string format
   - Added model path configuration
   - Added Render-specific examples

### Frontend Changes

1. **src/services/api.js**
   - Replaced hardcoded localhost with REACT_APP_API_URL environment variable
   - Falls back to localhost for local development

2. **.env.example** (new)
   - Template for frontend environment variables

### Deployment Files

1. **backend/render.yaml** (new)
   - Render blueprint for automated deployment
   - Configures PostgreSQL database linking
   - Sets environment variables automatically

### Documentation

1. **README.md**
   - Completely rewritten with PostgreSQL focus
   - Added Render deployment instructions
   - Added Vercel deployment instructions
   - Added troubleshooting section
   - Added environment variable documentation

2. **.gitignore**
   - Removed model.pkl and encoders.pkl from ignore (needed for deployment)
   - Cleaned up duplicate entries

---

## Render Deployment Steps

### Step 1: Prepare GitHub Repository

Ensure all changes are committed and pushed:
```bash
git add .
git commit -m "Prepare for Render deployment with PostgreSQL"
git push
```

### Step 2: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **PostgreSQL**
3. Configure:
   - Name: `fraud-detection-db`
   - Database: `fraud_detection`
   - User: `fraud_detection_user`
   - Region: Choose closest to your users
4. Click **Create Database**
5. Wait for database to be ready (2-3 minutes)
6. Copy the **Internal Database URL** for later

### Step 3: Create Backend Web Service

1. Go to Render Dashboard
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `fraud-detection-api`
   - **Region**: Same as database
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
5. **Advanced** → **Add Environment Variable**:
   ```
   DATABASE_URL = <paste your Internal Database URL from Step 2>
   ALLOWED_ORIGINS = https://your-frontend.vercel.app,http://localhost:3000
   MODEL_PATH = model/model.pkl
   ENCODERS_PATH = model/encoders.pkl
   ```
6. Click **Create Web Service**
7. Wait for deployment (3-5 minutes)
8. Note your backend URL: `https://fraud-detection-api.onrender.com`

### Step 4: Test Backend

Open in browser:
```
https://fraud-detection-api.onrender.com/
```

Expected response:
```json
{"message": "Fraud Detection API Running"}
```

Open API docs:
```
https://fraud-detection-api.onrender.com/docs
```

### Step 5: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `./`
5. **Environment Variables**:
   ```
   REACT_APP_API_URL = https://fraud-detection-api.onrender.com
   ```
6. Click **Deploy**
7. Wait for deployment (1-2 minutes)
8. Note your frontend URL

### Step 6: Update CORS on Render

1. Go to your Render web service
2. **Environment** tab
3. Edit `ALLOWED_ORIGINS`:
   ```
   https://your-actual-frontend-url.vercel.app,http://localhost:3000
   ```
4. Save changes (service will redeploy)

---

## Required Environment Variables

### Backend (Render)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| DATABASE_URL | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| ALLOWED_ORIGINS | Yes | Comma-separated allowed frontend URLs | `https://app.vercel.app,http://localhost:3000` |
| MODEL_PATH | No | Path to model file (default: model/model.pkl) | `model/model.pkl` |
| ENCODERS_PATH | No | Path to encoders file (default: model/encoders.pkl) | `model/encoders.pkl` |

### Frontend (Vercel)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| REACT_APP_API_URL | Yes | Backend API URL | `https://api.onrender.com` |

---

## Local Development with PostgreSQL

### Option 1: Use Render PostgreSQL (Recommended)

1. Use the same DATABASE_URL from your Render database
2. Update local `.env` with the connection string
3. No local PostgreSQL installation needed

### Option 2: Local PostgreSQL

1. Install PostgreSQL locally
2. Create database:
   ```bash
   createdb fraud_detection
   ```
3. Update `.env`:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/fraud_detection
   ```

---

## Troubleshooting

### Backend Fails to Start

**Error: `ValueError: DATABASE_URL environment variable is required`**
- Solution: Add DATABASE_URL to Render environment variables

**Error: `ModuleNotFoundError: No module named 'psycopg2'`**
- Solution: Verify psycopg2-binary is in requirements.txt

**Error: `FileNotFoundError: model.pkl`**
- Solution: Ensure model.pkl and encoders.pkl are committed to Git
- Check MODEL_PATH environment variable

### CORS Errors

**Error: `Access to XMLHttpRequest blocked by CORS policy`**
- Solution: Verify ALLOWED_ORIGINS includes your frontend URL
- Check for typos in the URL
- Ensure protocol (http/https) matches

### Database Connection Issues

**Error: `connection to server at "host" failed`**
- Solution: Verify DATABASE_URL format
- Check if database is active on Render
- Ensure web service and database are in same region

### Frontend Issues

**Error: `Network Error` when calling API**
- Solution: Verify REACT_APP_API_URL is set correctly
- Check backend is running and accessible
- Ensure no trailing slashes in URL

---

## Verification Checklist

Before considering deployment complete:

- [ ] Backend deploys successfully on Render
- [ ] Backend health endpoint returns 200
- [ ] API docs are accessible at `/docs`
- [ ] Frontend deploys successfully on Vercel
- [ ] Frontend loads without console errors
- [ ] Prediction form submits successfully
- [ ] Dashboard displays data from backend
- [ ] Transaction history loads correctly
- [ ] Analytics page displays statistics
- [ ] CORS is configured correctly (no browser errors)
- [ ] Database is receiving transaction records

---

## Optional Improvements

### Performance
- Add Redis caching for frequent queries
- Implement connection pooling optimization
- Add CDN for static assets

### Security
- Add API rate limiting
- Implement authentication (JWT)
- Add request signing
- Enable HTTPS only

### Monitoring
- Add application logging (Sentry, LogRocket)
- Set up uptime monitoring (UptimeRobot)
- Add performance monitoring (New Relic, Datadog)

### Scalability
- Add horizontal scaling support
- Implement queue for async predictions
- Add load balancing

---

## Cost Estimates (Render Free Tier)

- PostgreSQL: Free tier (90 days, then $7/month)
- Web Service: Free tier (750 hours/month)
- Total: $0 (free tier) or $7/month after trial

---

## Support

For issues:
1. Check Render build logs
2. Check Vercel build logs
3. Review this troubleshooting guide
4. Open an issue on GitHub
