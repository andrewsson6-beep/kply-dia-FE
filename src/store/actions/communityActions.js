import { createAsyncThunk } from '@reduxjs/toolkit';
import { domainApi } from '../../api/api.js';

export const fetchCommunitiesThunk = createAsyncThunk(
  'community/fetchByParent',
  async ({ parentType, parentId }, { rejectWithValue }) => {
    try {
      const list = await domainApi.fetchCommunities(parentType, parentId);
      return { parentType, parentId, list };
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

export const deleteCommunityThunk = createAsyncThunk(
  'community/delete',
  async ({ parentType, parentId, id }, { rejectWithValue }) => {
    try {
      await domainApi.deleteCommunity(id);
      return { parentType, parentId, id };
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to delete community');
    }
  }
);
