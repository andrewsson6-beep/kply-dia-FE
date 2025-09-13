import { createAsyncThunk } from '@reduxjs/toolkit';
import { domainApi } from '../../api/api.js';

export const fetchParishesThunk = createAsyncThunk(
  'parish/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await domainApi.fetchParishes();
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to load parishes');
    }
  }
);
