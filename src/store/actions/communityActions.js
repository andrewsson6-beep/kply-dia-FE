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
