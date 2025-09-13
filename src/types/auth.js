// Authentication related types and constants

// User role constants
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
};

// Authentication status constants
export const AUTH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILED: 'failed',
};

// API Error types
// API_ERROR_TYPES trimmed out for simplified mock implementation

/**
 * User object structure
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} name - User full name
 * @property {string} role - User role (admin, user, moderator)
 * @property {string} avatar - User avatar URL
 * @property {Date} createdAt - Account creation date
 * @property {Date} lastLoginAt - Last login timestamp
 */

/**
 * Auth state structure
 * @typedef {Object} AuthState
 * @property {User|null} user - Current user data
 * @property {string|null} accessToken - JWT access token
 * @property {boolean} isAuthenticated - Authentication status
 * @property {string} status - Current operation status (idle, loading, success, failed)
 * @property {string|null} error - Error message if any
 * @property {boolean} isLoading - Loading state for async operations
 */

/**
 * Login credentials
 * @typedef {Object} LoginCredentials
 * @property {string} email - User email
 * @property {string} password - User password
 */

/**
 * API Error structure
 * @typedef {Object} ApiError
 * @property {string} type - Error type
 * @property {string} message - Error message
 * @property {number} statusCode - HTTP status code
 * @property {Object} details - Additional error details
 */
