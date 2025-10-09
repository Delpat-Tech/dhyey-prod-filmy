# Change Password API Documentation

## User Change Password

**Endpoint:** `PATCH /api/v1/auth/change-password`
**Authentication:** Required (Bearer Token)
**Description:** Allows authenticated users to change their own password

### Request Body
```json
{
  "passwordCurrent": "currentPassword123",
  "password": "newPassword123",
  "passwordConfirm": "newPassword123"
}
```

### Response
```json
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    }
  }
}
```

## Admin Change User Password

**Endpoint:** `PATCH /api/v1/admin/change-user-password`
**Authentication:** Required (Admin Bearer Token)
**Description:** Allows admins to change any user's password without knowing current password

### Request Body
```json
{
  "userId": "65f1a2b3c4d5e6f7a8b9c0e1",
  "newPassword": "newPassword123"
}
```

### Response
```json
{
  "status": "success",
  "message": "Password updated successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "status": "fail",
  "message": "Please provide required fields"
}
```

### 401 Unauthorized
```json
{
  "status": "fail",
  "message": "Your current password is wrong."
}
```

### 404 Not Found
```json
{
  "status": "fail",
  "message": "User not found"
}
```