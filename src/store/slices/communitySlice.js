import { createSlice } from '@reduxjs/toolkit';
import {
  addCommunityThunk,
  fetchCommunitiesThunk,
  updateCommunityThunk,
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
        // Prevent infinite re-fetch loops on error
        state.byParent[key].loaded = true;
      })
      .addCase(addCommunityThunk.fulfilled, (state, action) => {
        const { parentType, parentId, created } = action.payload;
        const key = `${parentType}:${parentId}`;
        ensureParent(state, key);
        state.byParent[key].items.push(created);
      })
      .addCase(updateCommunityThunk.fulfilled, (state, action) => {
        const { parentType, parentId, updated } = action.payload;
        const key = `${parentType}:${parentId}`;
        ensureParent(state, key);
        const idx = state.byParent[key].items.findIndex(
          i => i.id === updated.id
        );
        if (idx !== -1) {
          state.byParent[key].items[idx] = {
            ...state.byParent[key].items[idx],
            ...updated,
          };
        }
      });
  },
});

export default communitySlice.reducer;
