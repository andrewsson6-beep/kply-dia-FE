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
  async (foraneId, { rejectWithValue }) => {
    try {
      return {
        foraneId,
        items: await domainApi.fetchParishesByForane(foraneId),
      };
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to load forane parishes');
    }
  }
);

export const deleteParishThunk = createAsyncThunk(
  'parish/delete',
  async (parishId, { rejectWithValue }) => {
    try {
      await domainApi.deleteParish(parishId);
      return parishId;
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to delete parish');
    }
  }
);
