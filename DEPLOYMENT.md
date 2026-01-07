# Vercel Deployment Guide

## Prerequisites
- Vercel account
- Backend API deployed (or use existing backend URL)

## Frontend Deployment Steps

1. **Set Environment Variables in Vercel:**
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add: `VITE_API_URL` with your backend API URL
     - Example: `https://your-backend-api.vercel.app` or `https://your-backend.herokuapp.com`

2. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI if not already installed
   npm i -g vercel
   
   # Navigate to project root
   cd MERNBlogProj
   
   # Deploy
   vercel
   ```

   Or connect your GitHub repository to Vercel for automatic deployments.

3. **Build Configuration:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## Backend Deployment

The backend should be deployed separately (e.g., on Heroku, Railway, or Render).

1. **Set Environment Variables:**
   - `ATLAS_URI` - MongoDB connection string
   - `PORT` - Server port (usually auto-set by hosting provider)
   - `SECRETKEY` - JWT secret key

2. **Update CORS settings** in `backend/server.js` to allow your frontend domain.

## Notes

- The frontend uses `VITE_API_URL` environment variable for API calls
- If not set, it defaults to `http://localhost:3000` (for local development)
- Ensure CORS is properly configured on the backend for production domains

