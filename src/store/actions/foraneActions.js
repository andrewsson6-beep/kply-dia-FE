import { createAsyncThunk } from '@reduxjs/toolkit';
import { domainApi } from '../../api/api.js';

export const fetchForanesThunk = createAsyncThunk(
  'forane/fetchAll',
  async (year, { rejectWithValue, signal }) => {
    try {
      return await domainApi.fetchForanes(year, signal); // returns { items, options }
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to load foranes');
    }
  }
);

export const addForaneThunk = createAsyncThunk(
  'forane/add',
  async (payload, { rejectWithValue }) => {
    try {
      return await domainApi.addForane(payload);
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to add forane');
    }
  }
);
