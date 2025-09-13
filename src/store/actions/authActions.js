import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/api.js';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authApi.login(credentials);
    } catch (e) {
      return rejectWithValue(e.message || 'Login failed');
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.logout();
    } catch (e) {
      return rejectWithValue(e.message || 'Logout failed');
    }
  }
);
