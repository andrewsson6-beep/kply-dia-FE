import { createAsyncThunk } from '@reduxjs/toolkit';
import { domainApi } from '../../api/api.js';

export const fetchForanesThunk = createAsyncThunk(
  'forane/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await domainApi.fetchForanes();
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to load foranes');
    }
  }
);
