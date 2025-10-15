# Deployment Guide

## ✅ Pre-Deployment Checklist

### Backend Ready ✅
- [x] API endpoints working
- [x] Database connection established
- [x] Story routes with slug support
- [x] Authentication working
- [x] CORS configured for production
- [x] Environment variables configured

### Frontend Ready ✅
- [x] Build process working
- [x] API integration complete
- [x] Slug-based routing implemented
- [x] Production environment variables set

## 🚀 Deployment Steps

### Backend Deployment (Render)

1. **Environment Variables** (Set in Render dashboard):
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE=mongodb+srv://umar:umar@cms-central-cluster.kxorrct.mongodb.net/filmydb?retryWrites=true&w=majority&appName=cms-central
   JWT_SECRET=dhyey-production-jwt-secret-key-2024-super-secure-random-string
   JWT_REFRESH_SECRET=dhyey-production-refresh-secret-key-2024-super-secure-random-string
   JWT_EXPIRES_IN=90d
   JWT_REFRESH_EXPIRES_IN=7d
   JWT_COOKIE_EXPIRES_IN=90
   ```

2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Root Directory**: `backend`

### Frontend Deployment (Render)

1. **Environment Variables** (Set in Render dashboard):
   ```
   NEXT_PUBLIC_API_URL=https://dhyey-prod-filmy-6-backend.onrender.com/api/v1
   NEXT_PUBLIC_APP_URL=https://dhyey-prod-filmy-frontend.onrender.com
   ```

2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`
4. **Root Directory**: `frontend`

## 🔧 Key Features Working

### ✅ Slug-Based URLs
- Stories accessible via: `/story/story-title-timestamp`
- SEO-friendly URLs
- Automatic slug generation

### ✅ API Routes
- `GET /api/v1/stories` - Public stories
- `GET /api/v1/stories/{slug}` - Story by slug
- `GET /api/v1/stories/by-user/{userId}` - User stories
- `POST /api/v1/stories/id/{id}/like` - Like story
- `POST /api/v1/stories/id/{id}/save` - Save story

### ✅ Authentication
- JWT-based authentication
- Token expiry handling
- Secure password hashing

### ✅ CORS Configuration
- Production domains whitelisted
- Credentials support enabled
- Proper headers configured

## 🧪 Testing

Run the test script to verify everything works:
```bash
node test-deployment.js
```

## 🌐 Production URLs

- **Backend**: https://dhyey-prod-filmy-6-backend.onrender.com
- **Frontend**: https://dhyey-prod-filmy-frontend.onrender.com
- **API Health**: https://dhyey-prod-filmy-6-backend.onrender.com/api/v1/health

## 🔍 Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure production domains are in CORS whitelist
2. **API 404 Errors**: Check API_BASE_URL includes `/api/v1`
3. **Story Not Found**: Verify slug generation is working
4. **Auth Issues**: Check JWT secrets are set correctly

### Logs to Check:
- Render deployment logs
- Browser console for frontend errors
- Network tab for API call failures

## 📝 Post-Deployment

1. Test story creation and slug generation
2. Verify user authentication flow
3. Check story interactions (like, save, comment)
4. Test responsive design on mobile
5. Verify SEO meta tags are working

## 🎯 Ready for Production!

All systems are tested and ready for deployment. The application supports:
- Full-stack storytelling platform
- User authentication and profiles
- Story management with admin approval
- SEO-friendly URLs with slugs
- Responsive design
- Production-ready error handling