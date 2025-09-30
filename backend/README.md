# Dhyey Production Storytelling Platform - Backend API

A comprehensive RESTful API for a modern storytelling platform that supports story creation, user profiles, search functionality, and content management.

## Features

### Public Endpoints (for Readers)
- **Story Feed**: Paginated list of published stories for the home page
- **Single Story**: Full story content for reading
- **Story Search**: Search stories by title, author, or hashtags
- **User Profiles**: Public user profile information
- **User Stories**: List of stories by a specific user
- **CMS Pages**: Static pages like "About Dhyey Production"

### Authenticated Endpoints (for Writers)
- **Story Creation**: Submit new stories for review with image upload
- **Profile Management**: Update user profile and bio
- **Authentication**: JWT-based login/signup system

### Admin Features
- **Story Management**: Full CRUD operations for stories
- **User Management**: Manage user accounts
- **CMS Management**: Create and edit static pages

## API Endpoints

### Stories
- `GET /api/v1/stories` - Get published stories (paginated)
- `GET /api/v1/stories/:storyId` - Get single story
- `POST /api/v1/stories` - Create new story (authenticated)

### Search
- `GET /api/v1/search/stories` - Search stories with filters

### Users
- `GET /api/v1/users/:userId` - Get user profile
- `GET /api/v1/users/:userId/stories` - Get user's stories
- `POST /api/v1/users/signup` - User registration
- `POST /api/v1/users/login` - User login

### Pages (CMS)
- `GET /api/v1/pages/:slug` - Get page by slug (e.g., about-dhyey-production)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `config.env`:
```
NODE_ENV=development
PORT=3000
DATABASE=mongodb://localhost:27017/dhyey-production
DATABASE_PASSWORD=
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=30d
JWT_COOKIE_EXPIRES_IN=30
```

3. Create required directories:
```bash
mkdir -p public/img/stories public/img/users
```

4. Import sample data (optional):
```bash
node data/import-dev-data.js --import
```

5. Start the server:
```bash
npm run dev
```

## Data Models

### Story
- Title, body, snippet, author information
- Category, hashtags, featured image
- Status (draft, in_review, published, rejected)
- Like count, publish date

### User
- Name, email, password (hashed)
- Profile picture, bio
- Role (user, admin)

### Category
- Name, slug, description
- Active status

### Page
- Title, slug, body content
- Meta description, publish status
- Created/updated timestamps

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## File Uploads

Story images and user profile pictures are handled using Multer and Sharp for image processing. Images are automatically resized and optimized.

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and descriptive error messages.

## Security Features

- Rate limiting
- Data sanitization (NoSQL injection, XSS)
- HTTP security headers (Helmet)
- CORS configuration
- Password hashing with bcrypt

## Development

- `npm run dev` - Start with nodemon for development
- `npm start` - Start in production mode
- `npm run debug` - Start with debugger

## Sample API Responses

### Get Stories
```json
{
  "data": [
    {
      "id": "story123",
      "title": "Adventures in the Cloud Forest",
      "authorName": "Jane Doe",
      "featuredImageUrl": "cloud-forest-adventure.jpg",
      "snippet": "A tale of discovery and wonder...",
      "hashtags": ["adventure", "nature", "fantasy"],
      "likeCount": 152
    }
  ],
  "meta": {
    "totalCount": 250,
    "pageSize": 10,
    "currentPage": 1,
    "totalPages": 25
  }
}
```

### Get Single Story
```json
{
  "data": {
    "id": "story123",
    "title": "Adventures in the Cloud Forest",
    "authorName": "Jane Doe",
    "authorId": "user456",
    "featuredImageUrl": "cloud-forest-adventure.jpg",
    "body": "<p>The long and detailed story content here...</p>",
    "hashtags": ["adventure", "nature", "fantasy"],
    "publishedDate": "2024-09-29T18:00:00Z",
    "likeCount": 152
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
