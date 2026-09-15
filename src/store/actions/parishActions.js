import { createAsyncThunk } from '@reduxjs/toolkit';
import { domainApi } from '../../api/api.js';

export const fetchParishesThunk = createAsyncThunk(
  'parish/fetchAll',
  async (year, { rejectWithValue, signal }) => {
    try {
      return await domainApi.fetchParishes(year, signal);
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to load parishes');
    }
  }
);

export const addParishThunk = createAsyncThunk(
  'parish/add',
  async (payload, { rejectWithValue }) => {
    try {
      return await domainApi.addParish(payload);
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to add parish');
    }
  }
);

export const fetchParishesByForaneThunk = createAsyncThunk(
  'parish/fetchByForane',
  async ({ foraneId, year }, { rejectWithValue, signal }) => {
    try {
      const result = await domainApi.fetchParishesByForane(
        foraneId,
        year,
        signal
      );
      return {
        foraneId,
        items: result.items,
        emptyMessage: result.emptyMessage,
      };
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to load forane parishes');
    }
  }
);
