import { createAsyncThunk } from '@reduxjs/toolkit';
import { domainApi } from '../../api/api.js';

export const fetchForanesThunk = createAsyncThunk(
  'forane/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await domainApi.fetchForanes(); // returns { items, options }
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

export const deleteForaneThunk = createAsyncThunk(
  'forane/delete',
  async (foraneId, { rejectWithValue }) => {
    try {
      await domainApi.deleteForane(foraneId);
      return foraneId;
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to delete forane');
    }
  }
);

export const updateForaneThunk = createAsyncThunk(
  'forane/update',
  async (payload, { rejectWithValue }) => {
    // payload: { for_id, for_name, for_location, for_vicar_name, for_contact_number }
    try {
      const updated = await domainApi.updateForane(payload);
      return updated;
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to update forane');
    }
  }
);
