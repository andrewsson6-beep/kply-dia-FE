import { createAsyncThunk } from '@reduxjs/toolkit';
import { domainApi } from '../../api/api.js';

export const fetchCommunitiesThunk = createAsyncThunk(
  'community/fetchByParent',
  async ({ parentType, parentId, year }, { rejectWithValue, signal }) => {
    try {
      const result = await domainApi.fetchCommunities(
        parentType,
        parentId,
        year,
        signal
      );
      return {
        parentType,
        parentId,
        list: result.items,
        emptyMessage: result.message,
      };
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to load communities');
    }
  }
);

export const addCommunityThunk = createAsyncThunk(
  'community/add',
  async ({ parentType, parentId, data }, { rejectWithValue }) => {
    try {
      const created = await domainApi.addCommunity(parentType, parentId, data);
      return { parentType, parentId, created };
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to add community');
    }
  }
);

export const updateCommunityThunk = createAsyncThunk(
  'community/update',
  async ({ parentType, parentId, payload }, { rejectWithValue }) => {
    try {
      const updated = await domainApi.updateCommunity(payload);
      return { parentType, parentId, updated };
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to update community');
    }
  }
);
