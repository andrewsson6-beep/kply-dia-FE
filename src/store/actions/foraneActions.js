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

export const deleteForaneThunk = createAsyncThunk(
  'forane/delete',
  async (foraneId, { rejectWithValue }) => {
    try {
      await domainApi.deleteForane({ for_id: foraneId });
      return foraneId;
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to delete forane');
    }
  }
);

export const updateForaneThunk = createAsyncThunk(
  'forane/update',
  async (payload, { rejectWithValue }) => {
    try {
      await domainApi.updateForane(payload);
      return {
        id: payload.for_id,
        changes: {
          churchName: payload.for_name,
          place: payload.for_location,
          vicarName: payload.for_vicar_name,
          contactNumber: payload.for_contact_number,
        },
      };
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to update forane');
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
