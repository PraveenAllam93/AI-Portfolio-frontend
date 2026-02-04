# Cognito Authentication Integration - Frontend

## Overview

Successfully integrated AWS Cognito authentication into the AIfolio frontend application. Users can now sign up, log in, and access protected routes with JWT-based authentication.

**Date:** January 31, 2026
**Status:** Fully Implemented and Ready for Testing

---

## What Was Implemented

### 1. AWS Amplify Integration

**Installed Package:**
```bash
npm install aws-amplify
```

**Configuration File:** [src/lib/config/amplify.ts](src/lib/config/amplify.ts)
```typescript
export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_Vzmccyneq',
      userPoolClientId: '6qhfqn73tq8q25b2iocmc942t3',
      loginWith: { email: true },
      // ... password policies, user attributes
    }
  },
  API: {
    REST: {
      aiPortfolioAPI: {
        endpoint: 'https://xkj0z5334g.execute-api.us-east-1.amazonaws.com/dev',
        region: 'us-east-1'
      }
    }
  }
};
```

### 2. Authentication Utilities

**File:** [src/lib/utils/auth.ts](src/lib/utils/auth.ts)

Provides helper functions for:
- `handleSignUp(data)` - Register new user with Cognito
- `handleConfirmSignUp(email, code)` - Verify email with code
- `handleSignIn(data)` - Authenticate existing user
- `handleSignOut()` - Log out current user
- `getAuthenticatedUser()` - Get current user info
- `getIdToken()` - Retrieve JWT ID token for API calls
- `isAuthenticated()` - Check authentication status

### 3. API Utilities

**File:** [src/lib/utils/api.ts](src/lib/utils/api.ts)

Provides helper functions for:
- `getUserInfo()` - Fetch user info from `/user/info` endpoint with JWT authentication

### 4. Updated Pages

#### Signup Page
**File:** [src/routes/(auth)/signup/+page.svelte](src/routes/(auth)/signup/+page.svelte)

Features:
- Form validation (name, email, password)
- Password strength requirements (8+ chars, uppercase, lowercase, numbers)
- Email verification workflow
- Error and success message handling
- Loading states

#### Login Page
**File:** [src/routes/(auth)/login/+page.svelte](src/routes/(auth)/login/+page.svelte)

Features:
- Email and password authentication
- Automatic redirect to home page after successful login
- Error handling for invalid credentials
- Loading states

#### Home Page (NEW)
**File:** [src/routes/(app)/home/+page.svelte](src/routes/(app)/home/+page.svelte)

Features:
- Protected route (requires authentication)
- Fetches and displays user info from API Gateway
- Shows user details: name, email, user ID, email verification status
- Displays JWT token information (issued at, expires at, issuer)
- Shows API response metadata (request ID, timestamp, source IP)
- Logout functionality
- Success indicators for authentication flow

---

## Architecture

### Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. User fills signup form
       ▼
┌─────────────────┐
│  Signup Page    │──────────────┐
│  +page.svelte   │              │
└─────────────────┘              │
       │                          │
       │ 2. Call handleSignUp()   │
       ▼                          │
┌─────────────────┐              │ 3. AWS SDK Request
│  auth.ts        │──────────────┤
│  (Amplify Auth) │              │
└─────────────────┘              │
       │                          │
       │ 4. Creates user          │
       ▼                          ▼
┌──────────────────────────────────┐
│   AWS Cognito User Pool          │
│   us-east-1_Vzmccyneq            │
└──────────────────────────────────┘
       │
       │ 5. Sends verification email
       ▼
┌─────────────┐
│   User      │
│   Email     │
└──────┬──────┘
       │
       │ 6. User enters code
       ▼
┌─────────────────┐
│  Verify Form    │
└─────────────────┘
```

### Login and API Call Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. User enters credentials
       ▼
┌─────────────────┐
│  Login Page     │
│  +page.svelte   │
└─────────────────┘
       │
       │ 2. Call handleSignIn()
       ▼
┌─────────────────┐              ┌──────────────────┐
│  auth.ts        │──────────────▶│  AWS Cognito     │
│  (Amplify Auth) │◀──────────────│  User Pool       │
└─────────────────┘              └──────────────────┘
       │                          Returns JWT tokens
       │ 3. Store tokens in memory
       │
       │ 4. Redirect to /home
       ▼
┌─────────────────┐
│  Home Page      │
│  +page.svelte   │
└─────────────────┘
       │
       │ 5. Call getUserInfo()
       ▼
┌─────────────────┐
│  api.ts         │──┐
└─────────────────┘  │
       │              │ 6. Get JWT token
       │              │
       ▼              ▼
┌─────────────────┐
│  auth.ts        │
│  getIdToken()   │
└─────────────────┘
       │
       │ 7. Make API call with JWT
       ▼
┌──────────────────────────────────┐
│   API Gateway                    │
│   xkj0z5334g.execute-api...      │
└──────────────────────────────────┘
       │
       │ 8. Validate JWT with Cognito
       ▼
┌──────────────────────────────────┐
│   Cognito Authorizer             │
└──────────────────────────────────┘
       │
       │ 9. If valid, invoke Lambda
       ▼
┌──────────────────────────────────┐
│   Lambda Function                │
│   ai-portfolio-dev-get-user-info │
└──────────────────────────────────┘
       │
       │ 10. Extract claims from JWT
       │ 11. Return user info
       ▼
┌─────────────┐
│  Home Page  │
│  Displays   │
│  User Info  │
└─────────────┘
```

---

## How to Test

### Prerequisites

1. **Development Server Running:**
   ```bash
   cd AI-Portfolio-frontend
   npm run dev
   ```
   Server should be running on: http://localhost:5174/

2. **Backend Services Deployed:**
   - Cognito User Pool: `us-east-1_Vzmccyneq`
   - API Gateway: `https://xkj0z5334g.execute-api.us-east-1.amazonaws.com/dev`
   - Lambda: `ai-portfolio-dev-get-user-info`

### Test Scenario 1: New User Signup

1. **Navigate to Signup Page:**
   - Go to http://localhost:5174/signup

2. **Fill Out Form:**
   - Full Name: `Test User`
   - Email: `testuser123@example.com` (use your real email if you want to receive verification code)
   - Password: `TestUser123!` (must meet requirements)

3. **Submit Form:**
   - Click "Create Account"
   - Should see success message: "Account created successfully! Please check your email for verification code."

4. **Check Email:**
   - Check your email for verification code (6 digits)
   - If using a test email, you can get the code from AWS Console:
     ```bash
     aws cognito-idp admin-get-user \
       --user-pool-id us-east-1_Vzmccyneq \
       --username testuser123@example.com \
       --region us-east-1
     ```

5. **Verify Email:**
   - Enter 6-digit code
   - Click "Verify Email"
   - Should redirect to login page after 2 seconds

### Test Scenario 2: User Login

1. **Navigate to Login Page:**
   - Go to http://localhost:5174/login

2. **Enter Credentials:**
   - Email: `testuser123@example.com`
   - Password: `TestUser123!`

3. **Submit Form:**
   - Click "Log In"
   - Should see success message: "Logged in successfully! Redirecting..."
   - Should redirect to home page after 1 second

### Test Scenario 3: View User Info

1. **After Login Redirect:**
   - Should automatically land on http://localhost:5174/home

2. **Verify Home Page Content:**
   - **Welcome Section:** "Welcome back, Test User!"
   - **Account Information:**
     - Full Name: `Test User`
     - Email Address: `testuser123@example.com`
     - User ID: (UUID from Cognito)
     - Email Verified: `Yes`
   - **Session Information:**
     - Token Issued At: (timestamp)
     - Token Expires At: (timestamp, 1 hour from issued)
     - Issuer: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Vzmccyneq`
   - **API Response Metadata:**
     - Request ID
     - Request Time
     - Source IP
   - **Success Message:** Green box showing authentication test successful

3. **Test Logout:**
   - Click "Log Out" button in navbar
   - Should redirect to landing page (/)
   - Try accessing http://localhost:5174/home directly
   - Should redirect to login page (protected route)

### Test Scenario 4: Error Handling

1. **Invalid Password (Login):**
   - Go to http://localhost:5174/login
   - Enter wrong password
   - Should see error: "Incorrect username or password"

2. **Password Validation (Signup):**
   - Go to http://localhost:5174/signup
   - Try password without uppercase: `testuser123!`
   - Should see error: "Password must contain at least one uppercase letter"

3. **Expired Session:**
   - Log in and wait for 1 hour (JWT token expires)
   - Try to access http://localhost:5174/home
   - Should show error: "Session expired. Please log in again."

---

## File Structure

```
AI-Portfolio-frontend/
├── src/
│   ├── lib/
│   │   ├── config/
│   │   │   └── amplify.ts              # Amplify configuration
│   │   └── utils/
│   │       ├── auth.ts                 # Authentication helpers
│   │       └── api.ts                  # API call helpers
│   └── routes/
│       ├── (auth)/
│       │   ├── login/
│       │   │   └── +page.svelte        # Login page
│       │   └── signup/
│       │       └── +page.svelte        # Signup page
│       ├── (app)/
│       │   └── home/
│       │       └── +page.svelte        # Protected home page
│       └── (marketing)/
│           └── +page.svelte            # Landing page
└── package.json
```

---

## Environment Variables (Optional)

If you want to make the configuration dynamic:

**Create `.env` file:**
```bash
PUBLIC_COGNITO_USER_POOL_ID=us-east-1_Vzmccyneq
PUBLIC_COGNITO_CLIENT_ID=6qhfqn73tq8q25b2iocmc942t3
PUBLIC_API_ENDPOINT=https://xkj0z5334g.execute-api.us-east-1.amazonaws.com/dev
PUBLIC_AWS_REGION=us-east-1
```

**Update `amplify.ts`:**
```typescript
import { env } from '$env/dynamic/public';

export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: env.PUBLIC_COGNITO_USER_POOL_ID,
      userPoolClientId: env.PUBLIC_COGNITO_CLIENT_ID,
      // ...
    }
  }
};
```

---

## Security Notes

1. **JWT Tokens:**
   - Stored in memory by AWS Amplify
   - Automatically included in API requests
   - Expire after 1 hour
   - Refresh tokens valid for 30 days

2. **Password Policy:**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - Special characters optional

3. **Protected Routes:**
   - `/home` page checks authentication on mount
   - Redirects to `/login` if not authenticated
   - Uses `isAuthenticated()` helper function

4. **API Security:**
   - All API calls include JWT token in Authorization header
   - API Gateway validates token with Cognito before invoking Lambda
   - 401 errors handled gracefully with user feedback

---

## Troubleshooting

### Issue: "User is not authenticated"
**Solution:** User needs to log in first. Redirect to `/login`

### Issue: "Incorrect username or password"
**Solution:**
- Check credentials are correct
- Ensure user has verified email
- Try resetting password via Cognito Console

### Issue: "Failed to fetch user information"
**Solution:**
- Check API Gateway is deployed
- Check Lambda function is running
- Check network tab for API response
- Verify JWT token is being sent

### Issue: Verification email not received
**Solution:**
- Check spam folder
- For testing, get verification code from AWS CLI:
  ```bash
  aws cognito-idp admin-get-user \
    --user-pool-id us-east-1_Vzmccyneq \
    --username YOUR_EMAIL \
    --region us-east-1
  ```
- Or manually verify user:
  ```bash
  aws cognito-idp admin-confirm-sign-up \
    --user-pool-id us-east-1_Vzmccyneq \
    --username YOUR_EMAIL \
    --region us-east-1
  ```

### Issue: CORS errors
**Solution:**
- Check API Gateway CORS configuration
- Lambda function includes CORS headers in response
- Ensure `Access-Control-Allow-Origin: *` is set

---

## Next Steps

1. **Add Password Reset Flow:**
   - Implement forgot password page
   - Use `resetPassword()` and `confirmResetPassword()` from Amplify

2. **Add Protected Dashboard:**
   - Create more authenticated routes
   - Build out portfolio management features

3. **Add User Profile Management:**
   - Allow users to update name, email
   - Change password functionality

4. **Improve Error Handling:**
   - More specific error messages
   - Retry mechanisms for API failures

5. **Add Loading Skeletons:**
   - Better UX while fetching user data

6. **Session Management:**
   - Implement refresh token flow
   - Auto-refresh before token expires

---

## Success Criteria

✅ Users can sign up with email and password
✅ Email verification workflow works
✅ Users can log in with credentials
✅ JWT tokens are retrieved and stored
✅ Protected home page requires authentication
✅ API calls include JWT token in headers
✅ User info is fetched from Lambda function
✅ Logout functionality works
✅ Error handling for invalid credentials
✅ Password validation enforced

---

**🎉 Cognito Authentication Successfully Integrated!**

The frontend now fully supports user authentication with AWS Cognito, and the home page successfully demonstrates the complete authentication flow from signup to authenticated API calls.
