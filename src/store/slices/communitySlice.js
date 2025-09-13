import { createSlice } from '@reduxjs/toolkit';
import {
  addCommunityThunk,
  fetchCommunitiesThunk,
} from '../actions/communityActions.js';

// State keyed by parent "type:id"
const initialState = {
  byParent: {}, // key -> { items, loading, error, loaded }
};

const ensureParent = (state, key) => {
  if (!state.byParent[key]) {
    state.byParent[key] = {
      items: [],
      loading: false,
      error: null,
      loaded: false,
    };
  }
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCommunitiesThunk.pending, (state, action) => {
        const { parentType, parentId } = action.meta.arg;
        const key = `${parentType}:${parentId}`;
        ensureParent(state, key);
        state.byParent[key].loading = true;
        state.byParent[key].error = null;
      })
      .addCase(fetchCommunitiesThunk.fulfilled, (state, action) => {
        const { parentType, parentId, list } = action.payload;
        const key = `${parentType}:${parentId}`;
        ensureParent(state, key);
        state.byParent[key].loading = false;
        state.byParent[key].items = list;
        state.byParent[key].loaded = true;
      })
      .addCase(fetchCommunitiesThunk.rejected, (state, action) => {
        const { parentType, parentId } = action.meta.arg;
        const key = `${parentType}:${parentId}`;
        ensureParent(state, key);
        state.byParent[key].loading = false;
        state.byParent[key].error =
          action.payload || 'Error loading communities';
      })
      .addCase(addCommunityThunk.fulfilled, (state, action) => {
        const { parentType, parentId, created } = action.payload;
        const key = `${parentType}:${parentId}`;
        ensureParent(state, key);
        state.byParent[key].items.push(created);
      });
  },
});

export default communitySlice.reducer;
