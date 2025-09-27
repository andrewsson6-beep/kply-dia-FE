import { createAsyncThunk } from '@reduxjs/toolkit';
import { domainApi } from '../../api/api.js';

export const fetchFamiliesThunk = createAsyncThunk(
  'family/fetchByCommunity',
  async ({ communityId }, { rejectWithValue }) => {
    try {
      const list = await domainApi.fetchFamilies(communityId);
      return { communityId, list };
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to load families');
    }
  }
);

export const addFamilyThunk = createAsyncThunk(
  'family/add',
  async ({ communityId, data }, { rejectWithValue }) => {
    try {
      const created = await domainApi.addFamily(communityId, data);
      return { communityId, created };
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to add family');
    }
  }
);

export const updateFamilyThunk = createAsyncThunk(
  'family/update',
  async ({ communityId, data }, { rejectWithValue }) => {
    try {
      const updated = await domainApi.updateFamily(communityId, data);
      return { communityId, updated };
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to update family');
    }
  }
);

export const deleteFamilyThunk = createAsyncThunk(
  'family/delete',
  async ({ communityId, id }, { rejectWithValue }) => {
    try {
      const removed = await domainApi.deleteFamily(communityId, id);
      return { communityId, id: removed.id };
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to delete family');
    }
  }
);

export const addContributionThunk = createAsyncThunk(
  'family/addContribution',
  async (
    { communityId, familyId, amount, notes, date },
    { rejectWithValue }
  ) => {
    try {
      // Call real API for family contribution
      const row = await domainApi.addFamilyContribution({
        fcon_fam_id: familyId,
        fcon_amount: Number(amount || 0),
        fcon_purpose: notes || '',
        fcon_date: date,
      });
      return { communityId, row };
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to add contribution');
    }
  }
);
