# Quick API Test Guide

## Issues Fixed:

### 1. Admin Routes Conflict
**Problem**: `/api/v1/stories/admin` was being treated as `/api/v1/stories/:storyId` with `storyId = "admin"`
**Solution**: Moved admin routes before parameterized routes in the router

### 2. Category ID Validation
**Problem**: Story creation failed when no valid category ID provided
**Solution**: Added fallback to create/use a "General" category when none provided

### 3. Missing Sample Data
**Problem**: No pages or categories in database
**Solution**: Created `create-sample-data.js` script to populate basic data

## Test These Endpoints:

### 1. Create Sample Data First:
```bash
node create-sample-data.js
```

### 2. Test Story Creation (No Category Required):
```bash
POST /api/v1/stories
{
  "title": "Test Story",
  "body": "<p>This is a test story</p>",
  "hashtags": ["test"]
}
```

### 3. Test Admin Routes:
```bash
GET /api/v1/stories/admin
```

### 4. Test Pages:
```bash
GET /api/v1/pages/about-dhyey-production
```

### 5. Test Public Stories:
```bash
GET /api/v1/stories
```

## Authentication Required:
- Story creation: Requires JWT token
- Admin routes: Requires JWT token
- Public routes: No authentication needed

## Sample JWT Token Generation:
1. POST to `/api/v1/users/signup` or `/api/v1/users/login`
2. Use returned token in Authorization header: `Bearer <token>`
