# DHYEY Route Hierarchy

## 🚀 **Route Organization**

### **Public Routes (No Authentication Required)**
```
/auth/login           - Login page (STARTING POINT)
/auth/register        - Registration page  
/auth/forgot-password - Password reset page
```

### **Protected Routes (Authentication Required)**
```
/dashboard            - Main dashboard (redirected after login)
/profile              - User profile page
/profile/edit         - Edit profile
/profile/followers    - User followers
/profile/following    - User following
/profile/submissions  - User story submissions
/create               - Create new story
/search               - Search stories
/settings             - User settings
```

### **Story Routes**
```
/story/[id]           - Individual story view
/competitions         - Story competitions
/competitions/[id]    - Individual competition
```

### **Admin Routes (Admin Only)**
```
/admin                - Admin dashboard
/admin/users          - User management
/admin/stories        - Story management
/admin/analytics      - Analytics dashboard
/admin/competitions   - Competition management
/admin/admins         - Admin management
```

## 🔄 **Navigation Flow**

1. **First Visit**: `localhost:3000` → `/auth/login`
2. **After Login**: `/auth/login` → `/dashboard`
3. **After Registration**: `/auth/register` → `/dashboard`
4. **Logout**: Any page → `/auth/login`

## 🛡️ **Authentication Logic**

- **Unauthenticated users**: Redirected to `/auth/login`
- **Authenticated users**: Can access all protected routes
- **Admin users**: Can access admin routes + all user routes
- **Auth pages**: Hidden navigation, clean UI

## 📱 **Responsive Design**

- **Mobile**: Bottom navigation for main app
- **Desktop**: Top navigation bar
- **Auth pages**: No navigation, focused experience

## 🎯 **Key Features**

- MongoDB integration for user authentication
- JWT token-based sessions
- Role-based access control (user/admin)
- Clean, consistent white textbox styling
- Proper error handling and notifications
