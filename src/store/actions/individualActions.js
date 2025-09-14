import { createAsyncThunk } from '@reduxjs/toolkit';
import { domainApi } from '../../api/api.js';

export const fetchIndividualsThunk = createAsyncThunk(
  'individual/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await domainApi.fetchIndividuals();
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to load individuals');
    }
  }
);

export const addIndividualThunk = createAsyncThunk(
  'individual/add',
  async (payload, { rejectWithValue }) => {
    try {
      return await domainApi.addIndividual(payload);
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to add individual');
    }
  }
);

export const addIndividualContributionThunk = createAsyncThunk(
  'individual/addContribution',
  async (payload, { rejectWithValue }) => {
    try {
      return await domainApi.addIndividualContribution(payload);
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to add contribution');
    }
  }
);

export const updateIndividualThunk = createAsyncThunk(
  'individual/update',
  async (payload, { rejectWithValue }) => {
    try {
      return await domainApi.updateIndividual(payload);
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to update individual');
    }
  }
);
