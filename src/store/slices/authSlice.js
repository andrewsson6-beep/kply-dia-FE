import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_STATUS, API_ERROR_TYPES } from '../../types/auth.js';
import {
  mockLogin,
  mockLogout,
  mockGetCurrentUser,
  mockRegister,
} from '../../services/authApi.js';

// Initial state
const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  status: AUTH_STATUS.IDLE,
  error: null,
  isLoading: false,
};

// Async thunks for authentication actions

/**
 * Login user async thunk
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await mockLogin(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Login failed',
        type: error.type || API_ERROR_TYPES.UNKNOWN_ERROR,
        statusCode: error.statusCode || 500,
      });
    }
  }
);

/**
 * Register user async thunk
 */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await mockRegister(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Registration failed',
        type: error.type || API_ERROR_TYPES.UNKNOWN_ERROR,
        statusCode: error.statusCode || 500,
      });
    }
  }
);

/**
 * Logout user async thunk
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await mockLogout();
      return null;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Logout failed',
        type: error.type || API_ERROR_TYPES.UNKNOWN_ERROR,
        statusCode: error.statusCode || 500,
      });
    }
  }
);

/**
 * Get current user async thunk
 */
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.accessToken) {
        throw new Error('No access token available');
      }

      const response = await mockGetCurrentUser(auth.accessToken);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to get user data',
        type: error.type || API_ERROR_TYPES.UNKNOWN_ERROR,
        statusCode: error.statusCode || 500,
      });
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error action
    clearError: state => {
      state.error = null;
      state.status = AUTH_STATUS.IDLE;
    },

    // Clear auth state (for manual logout)
    clearAuth: state => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.status = AUTH_STATUS.IDLE;
      state.error = null;
      state.isLoading = false;
    },

    // Update user profile
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Set auth from persisted state (for rehydration)
    setAuthFromStorage: (state, action) => {
      const { user, accessToken } = action.payload;
      if (user && accessToken) {
        state.user = user;
        state.accessToken = accessToken;
        state.isAuthenticated = true;
        state.status = AUTH_STATUS.SUCCESS;
      }
    },
  },
  extraReducers: builder => {
    builder
      // Login user cases
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = AUTH_STATUS.SUCCESS;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload?.message || 'Login failed';
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })

      // Register user cases
      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = AUTH_STATUS.SUCCESS;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload?.message || 'Registration failed';
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })

      // Logout user cases
      .addCase(logoutUser.pending, state => {
        state.isLoading = true;
        state.status = AUTH_STATUS.LOADING;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.isLoading = false;
        state.status = AUTH_STATUS.IDLE;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload?.message || 'Logout failed';
        // Even if logout fails, clear the local state
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })

      // Get current user cases
      .addCase(getCurrentUser.pending, state => {
        state.isLoading = true;
        state.status = AUTH_STATUS.LOADING;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = AUTH_STATUS.SUCCESS;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload?.message || 'Failed to get user data';

        // If token is invalid, clear auth state
        if (action.payload?.type === API_ERROR_TYPES.AUTHENTICATION_ERROR) {
          state.user = null;
          state.accessToken = null;
          state.isAuthenticated = false;
        }
      });
  },
});

// Export actions
export const { clearError, clearAuth, updateUserProfile, setAuthFromStorage } =
  authSlice.actions;

// Export selectors
export const selectAuth = state => state.auth;
export const selectUser = state => state.auth.user;
export const selectAccessToken = state => state.auth.accessToken;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectAuthStatus = state => state.auth.status;
export const selectAuthError = state => state.auth.error;
export const selectIsLoading = state => state.auth.isLoading;

// Export reducer
export default authSlice.reducer;
