# User Authentication and Session Management

## Overview
The RRR application implements a secure user authentication system using JSON Web Tokens (JWT) with session expiration and renewal functionality. This document outlines the complete workflow and technical implementation details.

## Authentication Workflow

### 1. Registration Process
1. **User Input**: User provides name, email, password, and optional profile information
2. **Validation**: Backend validates input data (email format, password strength)
3. **Password Security**: Password is hashed using bcrypt before storage
4. **Database Storage**: User record is created in MongoDB
5. **Response**: Success message and redirect to login page

### 2. Login Process
1. **User Input**: User provides email and password
2. **Validation**: Backend validates credentials
3. **Token Generation**: Upon successful validation, a JWT token is generated containing:
   - User ID
   - User role
   - Expiration time (1 hour)
4. **Response**: Token is sent to client and stored in localStorage
5. **Redirection**: User is redirected to the dashboard

### 3. Session Management
1. **Token Storage**: JWT token stored in browser's localStorage
2. **Expiration Monitoring**: Frontend SessionManager component checks token expiration every 30 seconds
3. **Warning Notification**: User receives a notification 5 minutes before session expiration
4. **Session Extension**: User can extend session by clicking "Extend Session" button
5. **Automatic Logout**: If session expires, user is logged out and redirected to login page

## Technical Implementation

### Backend Components

#### User Model (MongoDB Schema)
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now },
  resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resume' }]
});
```

#### Authentication Endpoints
1. **Registration Endpoint**: `/api/register`
   - Validates input
   - Checks for existing email
   - Hashes password
   - Creates user record

2. **Login Endpoint**: `/api/login`
   - Validates credentials
   - Generates JWT token
   - Returns user data and token

3. **Token Refresh Endpoint**: `/api/refresh-token`
   - Validates existing token
   - Issues new token with extended expiration
   - Returns updated token

### Frontend Components

#### SessionManager Component
- Monitors token expiration
- Displays warning notifications
- Handles session extension requests
- Manages automatic logout

#### Authentication Context
- Provides authentication state to all components
- Stores user information
- Handles login/logout operations
- Manages token storage and retrieval

## Security Considerations

1. **Password Security**:
   - Passwords are never stored in plain text
   - Bcrypt hashing with salt rounds for secure storage
   - Minimum password strength requirements

2. **Token Security**:
   - Short expiration time (1 hour)
   - Secure token generation with environment variable secrets
   - Token validation on every protected API request

3. **HTTPS Implementation**:
   - All communication secured via HTTPS
   - Prevents man-in-the-middle attacks

4. **Input Validation**:
   - Server-side validation for all user inputs
   - Protection against injection attacks

## Testing Scenarios

1. **Successful Registration**:
   - User should receive success message
   - Database should contain new user record with hashed password

2. **Failed Registration (Existing Email)**:
   - User should receive appropriate error message
   - No new record should be created

3. **Successful Login**:
   - User should receive valid JWT token
   - User should be redirected to dashboard

4. **Failed Login (Invalid Credentials)**:
   - User should receive error message
   - No token should be generated

5. **Session Expiration**:
   - User should receive warning notification 5 minutes before expiration
   - User should be able to extend session
   - User should be logged out if session expires

## Common Issues and Solutions

1. **Token Not Being Stored**:
   - Check localStorage permissions
   - Verify token is being returned from backend

2. **Session Extension Not Working**:
   - Verify refresh-token endpoint is accessible
   - Check token format and validation

3. **Multiple Warning Notifications**:
   - Ensure proper state management in SessionManager
   - Verify toast notification system configuration
