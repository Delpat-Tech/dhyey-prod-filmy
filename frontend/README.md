# 🎬 Filmy Creatives Platform

A modern storytelling and creative content platform built with Next.js 14, Tailwind CSS, and TypeScript. Featuring an Instagram/TikTok-style UI for content discovery and a powerful admin dashboard for analytics and management.

## Access Links
Run the project using `npm run dev`
* Homepage: http://localhost:3000/
* Admin Dashboard: http://localhost:3000/admin
* Suspended Users: http://localhost:3000/admin/users/suspend
* Add Admin: http://localhost:3000/admin/admins/add
* Analytics Dashboard: http://localhost:3000/admin/analytics
* Portfolio Management: http://localhost:3000/admin/portfolio
* Competitions List: http://localhost:3000/competitions

## 🎯 Project Overview

Filmy Creatives is a comprehensive storytelling platform that enables:
- **Writers** to create, publish, and manage their stories
- **Readers** to discover, engage with, and share content
- **Admins** to monitor platform activity and user engagement
- **DHEY Productions** to showcase work and host competitions

## ✨ Key Features

### 📱 User-Facing Features
- Social media style feed with infinite scroll
- Rich story creation with image support
- User profiles with story collections
- Interactive engagement (likes, saves, comments)
- Advanced search and discovery
- Responsive design for all devices

### 🛠️ Admin Panel Features
- **Comprehensive Analytics Dashboard**
  - Real-time metrics and KPIs
  - User growth tracking
  - Content performance analysis
  - Device and traffic source analytics
  - Engagement rate monitoring
- **Content Management**
  - Story approval workflow
  - User management
  - Category and tag management
  - Content moderation tools

### 📊 Analytics Dashboard Highlights

#### 1. Overview Metrics
- Interactive cards with animated counters
- Performance indicators with trend analysis
- Progress tracking against targets
- Visual status indicators (Excellent, Good, etc.)

#### 2. Data Visualization
- Animated charts with smooth transitions
- Gradient progress bars with hover effects
- Real-time data updates
- Responsive and accessible components

#### 3. User & Content Analytics
- User growth trends
- Story performance metrics
- Engagement rate analysis
- Device and platform distribution
- Traffic source breakdown

#### 4. Real-time Activity Feed
- Live user actions tracking
- Color-coded activity types
- Interactive hover states
- Pulse animations for new activities

## ✨ Features

### Core Features
- **📱 Social Media Style UI** - Instagram/TikTok inspired design
- **📝 Story Creation** - Rich story submission with images and hashtags
- **🔍 Advanced Search** - Search by title, author, and hashtags
- **👤 User Profiles** - Personal profiles with story grids
- **❤️ Engagement** - Like, save, share, and comment on stories
- **📊 DHEY Showcase** - Company portfolio and competitions

### Pages Included
- **Home Feed** - Latest and featured stories
- **Search & Discovery** - Advanced filtering and search
- **Story Creation** - Form-based story submission
- **Profile Pages** - User stories, saved, and liked content
- **Story Reading** - Optimized reading experience
- **DHEY Production** - Company showcase and contact

## 🛠️ Tech Stack

### Core Technologies
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS with custom themes
- **Language:** TypeScript
- **State Management:** React Context + useReducer
- **Icons:** Lucide React
- **Data Visualization:** Custom SVG charts
- **Form Handling:** React Hook Form
- **Image Optimization:** Next.js Image
- **Animation:** Framer Motion + CSS Transitions
- **UI Components:** Headless UI + Custom

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm (v7+) or yarn (v1.22+)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/filmy-creatives.git
   cd filmy-creatives
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   # Add other environment variables as needed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**
   - Main Application: [http://localhost:3000](http://localhost:3000)
   - Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🔐 Admin Panel Access

1. Navigate to the admin login page: `/admin/login`
2. Use the following default credentials (change after first login):
   - **Email:** admin@filmycreatives.com
   - **Password:** admin123

### Admin Panel Features

#### Dashboard
- Real-time metrics overview
- Quick access to key functions
- System status monitoring

#### Analytics
- **Overview**: Key metrics at a glance
- **Users**: Growth and activity metrics
- **Content**: Story performance and engagement
- **Traffic**: Source and device analytics
- **Revenue**: Monetization metrics (if applicable)

#### Content Management
- Story approval queue
- User management
- Category and tag management
- Media library

#### Settings
- Site configuration
- User roles and permissions
- Email templates
- API keys and integrations

## 📁 Project Structure

```
filmy-creatives/
├── public/                # Static files
│   ├── images/            # Global images
│   └── icons/             # Favicons and app icons
│
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── admin/         # Admin panel routes
│   │   │   ├── analytics/ # Analytics dashboard
│   │   │   ├── content/   # Content management
│   │   │   ├── settings/  # System settings
│   │   │   └── layout.tsx # Admin layout
│   │   ├── api/           # API routes
│   │   ├── create/        # Story creation
│   │   ├── dhey/          # DHEY showcase
│   │   ├── profile/       # User profiles
│   │   ├── story/         # Story pages
│   │   ├── globals.css    # Global styles
│   │   └── layout.tsx     # Root layout
│   │
│   ├── components/
│   │   ├── admin/        # Admin components
│   │   │   ├── analytics/ # Analytics components
│   │   │   ├── charts/    # Chart components
│   │   │   └── ui/        # Admin UI components
│   │   ├── common/       # Shared components
│   │   ├── create/       # Story creation
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components
│   │
│   ├── lib/              # Utility functions
│   ├── styles/           # Global styles
│   └── types/            # TypeScript type definitions
│
├── .env.local            # Environment variables (gitignored)
├── next.config.js        # Next.js config
├── package.json          # Project dependencies
└── tailwind.config.js    # Tailwind CSS config
```

## 🎨 Design System

### Colors
- **Primary Gradient:** `from-purple-500 to-pink-500`
- **Success:** `emerald-500`
- **Warning:** `yellow-500`
- **Danger:** `red-500`
- **Neutral:** `gray-50` to `gray-900`
- **Dark Mode:** Full support with `dark:` variants

### Typography
- **Primary Font:** Inter (Google Fonts)
- **Font Weights:**
  - Regular: 400
  - Medium: 500
  - Semibold: 600
  - Bold: 700
- **Text Sizes:** Responsive typography using Tailwind's text scale

### UI Components
- **Buttons:** Multiple variants (primary, secondary, ghost, danger)
- **Cards:** Consistent shadow and border radius
- **Forms:** Accessible form controls with validation
- **Modals & Dialogs:** Animated with focus management
- **Navigation:** Responsive with mobile menu
- **Tables:** Sortable and paginated
- **Alerts & Toasts:** Non-intrusive notifications

### Animations
- **Hover States:** Subtle scale and shadow transitions
- **Page Transitions:** Smooth route changes
- **Loading States:** Skeleton loaders and spinners
- **Micro-interactions:** Feedback on user actions

## 📱 Responsive Design

The platform is built mobile-first with breakpoints:
- **Mobile:** < 768px (Bottom navigation)
- **Tablet:** 768px - 1024px (Hybrid navigation)
- **Desktop:** > 1024px (Top navigation)

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture

## 🚀 Deployment

### Build for Production
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm start
```

### Deployment Options

#### Vercel (Recommended)
1. Push your code to a Git repository
2. Import the repository on Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

#### Docker
```bash
# Build the Docker image
docker build -t filmy-creatives .

# Run the container
docker run -p 3000:3000 filmy-creatives
```

### Environment Variables

Required environment variables:
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.filmycreatives.com
NEXT_PUBLIC_SITE_URL=https://filmycreatives.com

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Database (example)
DATABASE_URL=postgresql://user:password@localhost:5432/filmy_creatives

# Storage (example)
S3_ACCESS_KEY=your_s3_key
S3_SECRET_KEY=your_s3_secret
S3_BUCKET_NAME=your_bucket_name
```

## 📈 Analytics Dashboard Features

### Real-time Metrics
- Live user activity tracking
- Instant updates without page refresh
- Historical data comparison

### Data Visualization
- Interactive line and bar charts
- Donut charts for distribution
- Custom tooltips and legends
- Responsive design for all devices

### Performance Monitoring
- Page load times
- API response times
- Error tracking
- User session duration

### Custom Reports
- Date range selection
- Data export (CSV/PDF)
- Custom metric selection
- Scheduled reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js and React teams
- Tailwind CSS for amazing utility classes
- Lucide for beautiful icons
- The open-source community

## 📋 TODO / Future Enhancements

### Backend Integration
- [ ] User authentication system
- [ ] Story CRUD API endpoints
- [ ] Database integration (PostgreSQL)
- [ ] File upload for images
- [ ] Email notifications

### Additional Features
- [ ] Real-time comments
- [ ] Story analytics
- [ ] Admin dashboard
- [ ] Push notifications
- [ ] Social media sharing
- [ ] Advanced text editor

### Performance
- [ ] Image optimization
- [ ] Caching strategy
- [ ] SEO optimization
- [ ] PWA features
