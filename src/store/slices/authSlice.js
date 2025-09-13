import { createSlice } from '@reduxjs/toolkit';
import { AUTH_STATUS } from '../../types/auth.js';
import { loginThunk, logoutThunk } from '../actions/authActions.js';

// Initial state
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  tokenExpiresAt: null,
  sessionUuid: null,
  isAuthenticated: false,
  status: AUTH_STATUS.IDLE,
  error: null,
  isLoading: false,
};

// Thunks moved to actions folder; this slice only responds to them

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
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.sessionUuid = null;
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
      const { user, accessToken, refreshToken, tokenExpiresAt, sessionUuid } =
        action.payload;
      if (user && accessToken) {
        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken || null;
        state.tokenExpiresAt = tokenExpiresAt || null;
        state.sessionUuid = sessionUuid || null;
        state.isAuthenticated = true;
        state.status = AUTH_STATUS.SUCCESS;
      }
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginThunk.pending, state => {
        state.isLoading = true;
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = AUTH_STATUS.SUCCESS;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiresAt = action.payload.tokenExpiresAt || null;
        state.sessionUuid = action.payload.sessionUuid || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload || 'Login failed';
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.tokenExpiresAt = null;
        state.sessionUuid = null;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutThunk.pending, state => {
        state.isLoading = true;
        state.status = AUTH_STATUS.LOADING;
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.isLoading = false;
        state.status = AUTH_STATUS.IDLE;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.tokenExpiresAt = null;
        state.sessionUuid = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload || 'Logout failed';
        // Even if logout fails, clear the local state
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.tokenExpiresAt = null;
        state.sessionUuid = null;
        state.isAuthenticated = false;
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
