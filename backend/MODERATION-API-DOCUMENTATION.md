# Story Moderation API Documentation

## Overview
The Dhyey Production platform includes a comprehensive story moderation system that allows administrators to review, approve, reject, and manage story content with full audit logging and email notifications.

## 🔐 Authentication
All moderation endpoints require admin authentication:
- **Header**: `Authorization: Bearer <admin-jwt-token>`
- **Role**: User must have admin privileges

## 📋 Moderation Endpoints

### 1. Approve Story
**PATCH** `/api/v1/stories/admin/:id/approve`

Approves a story and publishes it to the platform.

#### Request Body (Optional)
```json
{
  "feedback": "Great story! Approved for publication."
}
```

#### Response
```json
{
  "status": "success",
  "message": "Story approved and published successfully",
  "data": {
    "id": "story123",
    "title": "Adventures in the Cloud Forest",
    "status": "published",
    "publishedDate": "2024-09-30T15:30:00.000Z",
    "moderatedBy": "Admin User",
    "moderatedAt": "2024-09-30T15:30:00.000Z"
  }
}
```

#### Actions Performed
- ✅ Sets story status to `published`
- ✅ Sets `publishedDate` to current timestamp
- ✅ Clears any previous rejection feedback
- ✅ Adds entry to moderation history
- ✅ Sends approval email to author

---

### 2. Reject Story
**PATCH** `/api/v1/stories/admin/:id/reject`

Rejects a story with mandatory feedback for the author.

#### Request Body (Required)
```json
{
  "feedback": "The story needs more character development and a clearer plot structure. Please revise and resubmit."
}
```

#### Response
```json
{
  "status": "success",
  "message": "Story rejected successfully",
  "data": {
    "id": "story123",
    "title": "Adventures in the Cloud Forest",
    "status": "rejected",
    "rejectionFeedback": "The story needs more character development...",
    "moderatedBy": "Admin User",
    "moderatedAt": "2024-09-30T15:30:00.000Z"
  }
}
```

#### Actions Performed
- ❌ Sets story status to `rejected`
- 📝 Stores rejection feedback
- 🗓️ Clears published date if previously published
- 📋 Adds entry to moderation history
- 📧 Sends rejection email with feedback to author

#### Validation
- Feedback is **required** and cannot be empty
- Returns 400 error if feedback is missing

---

### 3. Unpublish Story
**PATCH** `/api/v1/stories/admin/:id/unpublish`

Removes a published story from public view.

#### Request Body (Optional)
```json
{
  "feedback": "Story unpublished due to content policy violation. Please review our guidelines."
}
```

#### Response
```json
{
  "status": "success",
  "message": "Story unpublished successfully",
  "data": {
    "id": "story123",
    "title": "Adventures in the Cloud Forest",
    "status": "draft",
    "moderatedBy": "Admin User",
    "moderatedAt": "2024-09-30T15:30:00.000Z",
    "feedback": "Story unpublished due to content policy violation..."
  }
}
```

#### Actions Performed
- 📤 Sets story status to `draft`
- 🗓️ Clears published date
- 📋 Adds entry to moderation history
- 📧 Sends unpublish notification email to author

#### Validation
- Only `published` stories can be unpublished
- Returns 400 error if story is not published

---

### 4. Get Moderation History
**GET** `/api/v1/stories/admin/:id/moderation-history`

Retrieves complete moderation history for a story.

#### Response
```json
{
  "status": "success",
  "data": {
    "storyId": "story123",
    "storyTitle": "Adventures in the Cloud Forest",
    "currentStatus": "published",
    "lastModeratedBy": {
      "_id": "admin123",
      "name": "Admin User",
      "email": "admin@dhyeyproduction.com"
    },
    "lastModeratedAt": "2024-09-30T15:30:00.000Z",
    "rejectionFeedback": null,
    "moderationHistory": [
      {
        "action": "approved",
        "moderator": {
          "id": "admin123",
          "name": "Admin User",
          "email": "admin@dhyeyproduction.com"
        },
        "timestamp": "2024-09-30T15:30:00.000Z",
        "feedback": "Great story! Approved for publication.",
        "previousStatus": "in_review",
        "newStatus": "published"
      },
      {
        "action": "rejected",
        "moderator": {
          "id": "admin456",
          "name": "Another Admin",
          "email": "admin2@dhyeyproduction.com"
        },
        "timestamp": "2024-09-29T10:15:00.000Z",
        "feedback": "Needs more character development.",
        "previousStatus": "in_review",
        "newStatus": "rejected"
      }
    ]
  }
}
```

---

### 5. Get Moderation Statistics
**GET** `/api/v1/stories/admin/moderation/stats`

Provides overview statistics for the moderation dashboard.

#### Response
```json
{
  "status": "success",
  "data": {
    "statusCounts": {
      "draft": 45,
      "in_review": 23,
      "published": 156,
      "rejected": 12
    },
    "pendingReview": 8,
    "recentActivity": 15,
    "totalStories": 236
  }
}
```

#### Metrics Explained
- **statusCounts**: Count of stories by current status
- **pendingReview**: Stories in review for more than 24 hours
- **recentActivity**: Stories moderated in the last 7 days
- **totalStories**: Total number of stories in the system

---

## 📧 Email Notifications

### Story Approved Email
- **Subject**: `Great news! Your story "[Title]" has been published`
- **Content**: Congratulatory message with link to published story
- **CTA**: "View Your Published Story" button

### Story Rejected Email
- **Subject**: `Update needed for your story "[Title]"`
- **Content**: Constructive feedback with encouragement to revise
- **Feedback**: Highlighted feedback section from moderator
- **CTA**: "Edit Your Story" button

### Story Unpublished Email
- **Subject**: `Your story "[Title]" has been unpublished`
- **Content**: Professional notification with reason (if provided)
- **Support**: Contact information for questions
- **CTA**: "View Your Story" button

---

## 📋 Audit Logging

### Moderation History Schema
Each moderation action creates a history entry with:

```javascript
{
  action: 'approved' | 'rejected' | 'unpublished' | 'resubmitted',
  moderatorId: ObjectId,
  moderatorName: String,
  timestamp: Date,
  feedback: String,
  previousStatus: String,
  newStatus: String
}
```

### Audit Trail Features
- **Complete History**: Every status change is logged
- **Moderator Tracking**: Who performed each action
- **Timestamp Precision**: Exact time of each action
- **Status Transitions**: Before and after status tracking
- **Feedback Archive**: All moderator feedback preserved

---

## 🔄 Status Flow

```
draft → in_review → published
  ↑         ↓
  └─── rejected ←──┘
         ↓
    (can resubmit)
```

### Valid Status Transitions
- `draft` → `in_review` (author submits)
- `in_review` → `published` (admin approves)
- `in_review` → `rejected` (admin rejects)
- `rejected` → `in_review` (author resubmits)
- `published` → `draft` (admin unpublishes)

---

## ⚠️ Error Handling

### Common Error Responses

#### 404 - Story Not Found
```json
{
  "status": "fail",
  "message": "No story found with that ID"
}
```

#### 400 - Invalid Action
```json
{
  "status": "fail",
  "message": "Story is already published"
}
```

#### 400 - Missing Feedback
```json
{
  "status": "fail",
  "message": "Rejection feedback is required"
}
```

#### 401 - Unauthorized
```json
{
  "status": "fail",
  "message": "You are not logged in! Please log in to get access."
}
```

#### 403 - Insufficient Permissions
```json
{
  "status": "fail",
  "message": "You do not have permission to perform this action"
}
```

---

## 🚀 Usage Examples

### Typical Moderation Workflow

1. **Review Pending Stories**
   ```bash
   GET /api/v1/stories/admin?status=in_review
   ```

2. **Get Story Details**
   ```bash
   GET /api/v1/stories/admin/story123
   ```

3. **Approve or Reject**
   ```bash
   # Approve
   PATCH /api/v1/stories/admin/story123/approve
   
   # Reject with feedback
   PATCH /api/v1/stories/admin/story123/reject
   Body: { "feedback": "Needs improvement..." }
   ```

4. **Check Moderation History**
   ```bash
   GET /api/v1/stories/admin/story123/moderation-history
   ```

5. **Monitor Statistics**
   ```bash
   GET /api/v1/stories/admin/moderation/stats
   ```

This moderation system provides administrators with powerful tools to maintain content quality while ensuring transparency and communication with authors through comprehensive audit logging and email notifications.
