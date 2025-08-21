# Redux Toolkit Setup Documentation

This project has been set up with Redux Toolkit for state management, including authentication with persistence.

## 📁 Directory Structure

```
src/
├── store/
│   ├── index.js                 # Store configuration with persistence
│   ├── hooks.js                 # Custom Redux hooks
│   └── slices/
│       └── authSlice.js        # Authentication slice with async thunks
├── services/
│   └── authApi.js              # Mock API services for authentication
├── types/
│   └── auth.js                 # Authentication types and constants
└── components/
    └── auth/
        ├── LoginForm.jsx       # Login/Register form component
        └── Dashboard.jsx       # Protected dashboard component
```

## 🚀 Features Implemented

### ✅ Redux Toolkit Store

- Configured with Redux Toolkit for modern Redux usage
- Development tools enabled for debugging
- Proper middleware configuration

### ✅ Authentication Slice

- **State Management**: User data, access token, authentication status
- **Async Actions**: Login, register, logout, get current user
- **Error Handling**: Comprehensive error states and messages
- **Loading States**: Loading indicators for async operations

### ✅ Redux Persist

- **Persistence**: Authentication state persists across browser sessions
- **Selective Persistence**: Only auth-related data is persisted
- **Automatic Rehydration**: State restored on app startup

### ✅ Mock API Services

- **Realistic Simulation**: Network delays and error scenarios
- **Multiple User Types**: Admin and regular user accounts
- **Error Types**: Network, validation, authentication, and server errors
- **JWT-like Tokens**: Mock token generation and validation

### ✅ Custom Hooks

- `useAuth()` - Get complete auth state
- `useUser()` - Get current user data
- `useIsAuthenticated()` - Get authentication status
- `useAuthLoading()` - Get loading state
- `useAuthError()` - Get error messages

## 🔧 Available Actions

### Authentication Actions

- `loginUser(credentials)` - Login with email/password
- `registerUser(userData)` - Register new user account
- `logoutUser()` - Logout current user
- `getCurrentUser()` - Fetch current user data
- `clearError()` - Clear error messages
- `clearAuth()` - Clear authentication state
- `updateUserProfile(data)` - Update user profile data

## 🎯 Demo Credentials

For testing purposes, use these mock credentials:

**Admin User:**

- Email: `admin@example.com`
- Password: `admin123`

**Regular User:**

- Email: `user@example.com`
- Password: `user123`

## 💻 Usage Examples

### Basic Authentication Check

```jsx
import { useIsAuthenticated, useUser } from './store/hooks.js';

function MyComponent() {
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.name}!</div>;
}
```

### Login Form

```jsx
import { useAppDispatch, useAuth } from './store/hooks.js';
import { loginUser } from './store/slices/authSlice.js';

function LoginForm() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAuth();

  const handleLogin = async credentials => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      // Login successful
    } catch (error) {
      // Login failed - error is in Redux state
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
      {error && <div className="error">{error}</div>}
      <button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Protected Route

```jsx
import { useIsAuthenticated } from './store/hooks.js';

function ProtectedComponent() {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <div>Protected content</div>;
}
```

## 🛠️ Error Handling

The system includes comprehensive error handling:

- **Network Errors**: Connection issues, timeouts
- **Validation Errors**: Missing or invalid form data
- **Authentication Errors**: Invalid credentials, expired tokens
- **Server Errors**: Backend issues, rate limiting
- **Unknown Errors**: Unexpected failures

All errors are properly typed and include:

- Error type classification
- Human-readable messages
- HTTP status codes
- Additional error details

## 📦 Dependencies Added

```json
{
  "@reduxjs/toolkit": "^latest",
  "react-redux": "^latest",
  "redux-persist": "^latest"
}
```

## 🔄 State Persistence

The authentication state is automatically persisted to localStorage and includes:

- User profile data
- Access token
- Authentication status

The state is automatically restored when the app starts, providing a seamless user experience across browser sessions.

## 🧪 Testing the Setup

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Test login with demo credentials:**
   - Use admin@example.com / admin123 or user@example.com / user123

3. **Test persistence:**
   - Login, then refresh the page - you should remain logged in
   - Open browser dev tools and check localStorage for persisted data

4. **Test error handling:**
   - Try invalid credentials to see error messages
   - Check network tab to see simulated API calls

## 🚀 Next Steps

This setup provides a solid foundation for:

- Adding more slices for other features
- Implementing real API integration
- Adding more complex authentication flows
- Extending with role-based access control
- Adding more sophisticated error handling

The structure is scalable and follows Redux Toolkit best practices for maintainable state management.
