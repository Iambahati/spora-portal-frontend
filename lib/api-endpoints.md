# Laravel Backend API Endpoints

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
\`\`\`json
{
  "first_name": "John",
  "last_name": "Doe", 
  "email": "john@example.com",
  "company": "Acme Corp", // optional
  "password": "password123",
  "password_confirmation": "password123"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "investment_stage": 0,
    "created_at": "2024-01-01T00:00:00.000000Z"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
\`\`\`

### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "investment_stage": 0
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
\`\`\`

### POST /api/auth/forgot-password
Send password reset email to user.

**Request Body:**
\`\`\`json
{
  "email": "john@example.com"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Password reset link sent to your email"
}
\`\`\`

### POST /api/auth/reset-password
Reset user password using token from email.

**Request Body:**
\`\`\`json
{
  "token": "reset_token_from_email",
  "email": "john@example.com",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Password reset successfully"
}
\`\`\`

### POST /api/auth/logout
Logout user and invalidate token.

**Headers:**
\`\`\`
Authorization: Bearer {jwt_token}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Successfully logged out"
}
\`\`\`

## User Profile Endpoints

### GET /api/user/profile
Get authenticated user's profile information.

**Headers:**
\`\`\`
Authorization: Bearer {jwt_token}
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "investment_stage": 0,
  "kyc_status": "pending",
  "created_at": "2024-01-01T00:00:00.000000Z",
  "updated_at": "2024-01-01T00:00:00.000000Z"
}
\`\`\`

### PUT /api/user/profile
Update user profile information.

**Headers:**
\`\`\`
Authorization: Bearer {jwt_token}
\`\`\`

**Request Body:**
\`\`\`json
{
  "first_name": "John",
  "last_name": "Doe",
  "company": "New Company Name"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "company": "New Company Name",
    "investment_stage": 0
  }
}
\`\`\`

## KYC Endpoints

### POST /api/kyc/submit
Submit KYC documents for verification.

**Headers:**
\`\`\`
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
\`\`\`

**Request Body (FormData):**
\`\`\`
documentType: "id" | "passport"
idFront: File (if documentType is "id")
idBack: File (if documentType is "id")
passportFirst: File (if documentType is "passport")
passportLast: File (if documentType is "passport")
passportPhoto: File (required)
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "KYC documents submitted successfully",
  "kyc_submission": {
    "id": 1,
    "user_id": 1,
    "document_type": "id",
    "status": "pending",
    "submitted_at": "2024-01-01T00:00:00.000000Z"
  }
}
\`\`\`

### GET /api/kyc/status
Get KYC verification status for authenticated user.

**Headers:**
\`\`\`
Authorization: Bearer {jwt_token}
\`\`\`

**Response (200):**
\`\`\`json
{
  "kyc_status": "pending", // pending, approved, rejected
  "submitted_at": "2024-01-01T00:00:00.000000Z",
  "reviewed_at": null,
  "rejection_reason": null
}
\`\`\`

## Investment Status Endpoints

### GET /api/user/investment-status
Get user's current investment stage and status.

**Headers:**
\`\`\`
Authorization: Bearer {jwt_token}
\`\`\`

**Response (200):**
\`\`\`json
{
  "current_stage": 0,
  "stage_name": "Pending KYC",
  "stages": [
    {
      "id": 0,
      "name": "Pending KYC",
      "description": "Document verification in progress",
      "status": "current"
    },
    {
      "id": 1,
      "name": "KYC Approved", 
      "description": "Identity verified successfully",
      "status": "pending"
    }
    // ... other stages
  ]
}
\`\`\`

### PUT /api/user/investment-status
Update user's investment stage (admin only).

**Headers:**
\`\`\`
Authorization: Bearer {admin_jwt_token}
\`\`\`

**Request Body:**
\`\`\`json
{
  "user_id": 1,
  "stage": 1
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Investment stage updated successfully",
  "current_stage": 1
}
\`\`\`

## Error Responses

All endpoints may return these error responses:

**401 Unauthorized:**
\`\`\`json
{
  "message": "Unauthenticated"
}
\`\`\`

**422 Validation Error:**
\`\`\`json
{
  "message": "The given data was invalid",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
\`\`\`

**500 Server Error:**
\`\`\`json
{
  "message": "Internal server error"
}
\`\`\`

## Laravel Implementation Notes

### Required Packages
\`\`\`bash
composer require tymon/jwt-auth
composer require intervention/image
\`\`\`

### Middleware
- `auth:api` - JWT authentication
- `throttle:60,1` - Rate limiting for auth endpoints

### File Storage
- KYC documents should be stored securely with restricted access
- Use Laravel's storage system with proper disk configuration
- Implement file validation (size, type, dimensions)

### Database Tables
\`\`\`sql
-- users table
id, first_name, last_name, email, company, password, investment_stage, created_at, updated_at

-- kyc_submissions table  
id, user_id, document_type, status, id_front_path, id_back_path, passport_first_path, passport_last_path, passport_photo_path, submitted_at, reviewed_at, rejection_reason

-- password_resets table
email, token, created_at
