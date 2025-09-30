# Admin API Documentation - Enhanced Story Management

## 🔧 Enhanced GET /api/v1/stories/admin

### Overview
The admin stories endpoint now supports comprehensive filtering, searching, and sorting capabilities with optimized database performance through strategic indexing.

### Authentication
- **Required**: Admin JWT token
- **Header**: `Authorization: Bearer <admin-jwt-token>`

### Query Parameters

#### **Filtering Parameters**
- `title` (string) - Search by story title (case-insensitive, partial match)
- `author` (string) - Search by author name (case-insensitive, partial match)  
- `status` (string) - Filter by story status
  - Valid values: `draft`, `in_review`, `published`, `rejected`
  - Also accepts: `"In Review"` (automatically converted to `in_review`)
- `category` (string) - Filter by category name or slug (case-insensitive)

#### **Pagination Parameters**
- `page` (number, default: 1) - Page number
- `pageSize` (number, default: 20) - Items per page

#### **Sorting Parameters**
- `sortBy` (string, default: `createdAt`) - Field to sort by
  - Valid values: `title`, `authorName`, `status`, `createdAt`, `publishedDate`, `likeCount`
- `sortOrder` (string, default: `desc`) - Sort direction
  - Valid values: `asc`, `desc`

#### **Date Range Parameters**
- `createdAfter` (ISO date string) - Stories created after this date
- `createdBefore` (ISO date string) - Stories created before this date

### Example Requests

#### 1. Basic Admin Story List
```
GET /api/v1/stories/admin?page=1&pageSize=20
```

#### 2. Filter by Status
```
GET /api/v1/stories/admin?status=in_review&page=1&pageSize=10
```

#### 3. Search by Title
```
GET /api/v1/stories/admin?title=adventure&sortBy=likeCount&sortOrder=desc
```

#### 4. Filter by Author
```
GET /api/v1/stories/admin?author=Jane&status=published
```

#### 5. Filter by Category
```
GET /api/v1/stories/admin?category=fantasy&status=published
```

#### 6. Complex Multi-Filter Query
```
GET /api/v1/stories/admin?author=Jane&category=fantasy&status=published&sortBy=likeCount&sortOrder=desc&page=1&pageSize=15
```

#### 7. Date Range Filter
```
GET /api/v1/stories/admin?createdAfter=2024-01-01&createdBefore=2024-12-31&status=published
```

### Response Format

```json
{
  "status": "success",
  "results": 15,
  "data": [
    {
      "id": "story123",
      "title": "Adventures in the Cloud Forest",
      "authorName": "Jane Doe",
      "authorEmail": "jane@example.com",
      "category": "Adventure",
      "status": "published",
      "likeCount": 152,
      "createdAt": "2024-09-25T10:30:00.000Z",
      "publishedDate": "2024-09-26T08:15:00.000Z",
      "snippet": "A tale of discovery and wonder..."
    }
  ],
  "meta": {
    "totalCount": 250,
    "pageSize": 20,
    "currentPage": 1,
    "totalPages": 13,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "filters": {
    "title": "adventure",
    "author": null,
    "status": "published",
    "category": "fantasy"
  }
}
```

### Database Performance Optimizations

#### **Indexes Implemented**
1. **Single Field Indexes**
   - `title: 1` - For title searches
   - `authorName: 1` - For author searches  
   - `status: 1` - For status filtering
   - `categoryId: 1` - For category filtering
   - `createdAt: -1` - For date sorting
   - `likeCount: -1` - For popularity sorting

2. **Compound Indexes**
   - `{ status: 1, createdAt: -1 }` - Status + date queries
   - `{ categoryId: 1, status: 1 }` - Category + status queries
   - `{ authorName: 1, status: 1, createdAt: -1 }` - Author + status + date queries

3. **Text Indexes**
   - `{ title: 'text', authorName: 'text' }` - Full-text search

#### **Query Optimization Features**
- **Efficient Filtering**: Uses indexed fields for fast lookups
- **Smart Category Lookup**: Searches by both name and slug
- **Case-Insensitive Search**: Regex with case-insensitive flag
- **Lean Queries**: Uses `.lean()` for better performance
- **Strategic Population**: Only populates necessary fields

### Status Values Reference
- `draft` - Story saved but not submitted
- `in_review` - Story submitted for admin review
- `published` - Story approved and visible to public
- `rejected` - Story rejected by admin

### Error Handling
- Invalid status values are ignored (no filter applied)
- Invalid category names return no results
- Invalid date formats return 400 error
- Missing authentication returns 401 error
- Non-admin users return 403 error

### Performance Notes
- Queries are optimized with appropriate indexes
- Large result sets are paginated to prevent memory issues
- Complex filters use compound indexes for optimal performance
- Text searches use MongoDB's text index capabilities

This enhanced endpoint provides administrators with powerful tools to efficiently manage and review stories in the Dhyey Production platform.
