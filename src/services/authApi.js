// Mock API service for authentication
import { API_ERROR_TYPES } from '../types/auth.js';

// Mock delay to simulate network latency
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Mock user database
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: new Date('2023-01-01'),
    lastLoginAt: new Date(),
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'John Doe',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=2',
    createdAt: new Date('2023-06-15'),
    lastLoginAt: new Date(),
  },
];

// Mock JWT token generation
const generateMockToken = userId => {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };

  // In a real app, this would be a proper JWT
  return `mock-jwt-token-${btoa(JSON.stringify(payload))}`;
};

// Create API error object
const createApiError = (type, message, statusCode = 500, details = {}) => ({
  type,
  message,
  statusCode,
  details,
});

/**
 * Mock login API
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Login response with user data and token
 */
export const mockLogin = async credentials => {
  await delay(1000); // Simulate network delay

  const { email, password } = credentials;

  // Validate input
  if (!email || !password) {
    throw createApiError(
      API_ERROR_TYPES.VALIDATION_ERROR,
      'Email and password are required',
      400,
      { missingFields: !email ? ['email'] : ['password'] }
    );
  }

  // Find user
  const user = mockUsers.find(u => u.email === email);

  if (!user) {
    throw createApiError(
      API_ERROR_TYPES.AUTHENTICATION_ERROR,
      'Invalid email or password',
      401
    );
  }

  // Check password
  if (user.password !== password) {
    throw createApiError(
      API_ERROR_TYPES.AUTHENTICATION_ERROR,
      'Invalid email or password',
      401
    );
  }

  // Generate token
  const accessToken = generateMockToken(user.id);

  // Update last login
  user.lastLoginAt = new Date();

  // Return user data without password
  const { password: _, ...userData } = user;

  return {
    success: true,
    data: {
      user: userData,
      accessToken,
    },
    message: 'Login successful',
  };
};

/**
 * Mock logout API
 * @returns {Promise<Object>} Logout response
 */
export const mockLogout = async () => {
  await delay(500);

  return {
    success: true,
    message: 'Logout successful',
  };
};

/**
 * Mock get current user API
 * @param {string} token - Access token
 * @returns {Promise<Object>} Current user data
 */
export const mockGetCurrentUser = async token => {
  await delay(800);

  if (!token || !token.startsWith('mock-jwt-token-')) {
    throw createApiError(
      API_ERROR_TYPES.AUTHENTICATION_ERROR,
      'Invalid or expired token',
      401
    );
  }

  try {
    // Extract user ID from mock token
    const payload = JSON.parse(atob(token.replace('mock-jwt-token-', '')));

    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw createApiError(
        API_ERROR_TYPES.AUTHENTICATION_ERROR,
        'Token expired',
        401
      );
    }

    const user = mockUsers.find(u => u.id === payload.userId);

    if (!user) {
      throw createApiError(
        API_ERROR_TYPES.AUTHENTICATION_ERROR,
        'User not found',
        404
      );
    }

    const { password: _, ...userData } = user;

    return {
      success: true,
      data: {
        user: userData,
      },
      message: 'User data retrieved successfully',
    };
  } catch (error) {
    if (error.type) {
      throw error; // Re-throw API errors
    }

    throw createApiError(
      API_ERROR_TYPES.AUTHENTICATION_ERROR,
      'Invalid token format',
      401
    );
  }
};

/**
 * Mock register API
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 */
export const mockRegister = async userData => {
  await delay(1200);

  const { email, password, name } = userData;

  // Validate input
  if (!email || !password || !name) {
    const missingFields = [];
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!name) missingFields.push('name');

    throw createApiError(
      API_ERROR_TYPES.VALIDATION_ERROR,
      'Missing required fields',
      400,
      { missingFields }
    );
  }

  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    throw createApiError(
      API_ERROR_TYPES.VALIDATION_ERROR,
      'User with this email already exists',
      409
    );
  }

  // Create new user
  const newUser = {
    id: String(mockUsers.length + 1),
    email,
    password,
    name,
    role: 'user',
    avatar: `https://i.pravatar.cc/150?img=${mockUsers.length + 3}`,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };

  mockUsers.push(newUser);

  // Generate token
  const accessToken = generateMockToken(newUser.id);

  // Return user data without password
  const { password: _, ...newUserData } = newUser;

  return {
    success: true,
    data: {
      user: newUserData,
      accessToken,
    },
    message: 'Registration successful',
  };
};
