import { createSlice } from '@reduxjs/toolkit';
import {
  fetchParishesThunk,
  addParishThunk,
  fetchParishesByForaneThunk,
} from '../actions/parishActions.js';

const initialState = {
  items: [],
  loading: false,
  error: null,
  emptyMessage: null,
  loaded: false,
  byForane: {}, // { [foraneId]: { items, loading, error, loaded } }
};

const parishSlice = createSlice({
  name: 'parish',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchParishesThunk.pending, state => {
        state.loading = true;
        state.error = null;
        state.emptyMessage = null;
      })
      .addCase(fetchParishesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.emptyMessage = action.payload.emptyMessage || null;
        state.loaded = true;
      })
      .addCase(fetchParishesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error loading parishes';
        state.emptyMessage = null;
        // Prevent re-fetch loops on error
        state.loaded = true;
      })
      // Per-forane parishes
      .addCase(fetchParishesByForaneThunk.pending, (state, action) => {
        const { foraneId } = action.meta.arg;
        state.byForane[foraneId] = state.byForane[foraneId] || {
          items: [],
          loading: false,
          error: null,
          emptyMessage: null,
          loaded: false,
        };
        state.byForane[foraneId].loading = true;
        state.byForane[foraneId].error = null;
        state.byForane[foraneId].emptyMessage = null;
      })
      .addCase(fetchParishesByForaneThunk.fulfilled, (state, action) => {
        const { foraneId, items, emptyMessage } = action.payload;
        state.byForane[foraneId] = {
          items,
          loading: false,
          error: null,
          emptyMessage: emptyMessage || null,
          loaded: true,
        };
      })
      .addCase(fetchParishesByForaneThunk.rejected, (state, action) => {
        const { foraneId } = action.meta.arg;
        state.byForane[foraneId] = state.byForane[foraneId] || {
          items: [],
          loading: false,
          error: null,
          emptyMessage: null,
          loaded: false,
        };
        state.byForane[foraneId].loading = false;
        state.byForane[foraneId].error =
          action.payload || 'Error loading parishes';
        state.byForane[foraneId].emptyMessage = null;
        // Prevent re-fetch loops on error for this forane
        state.byForane[foraneId].loaded = true;
      })
      .addCase(addParishThunk.pending, state => {
        state.error = null;
      })
      .addCase(addParishThunk.fulfilled, state => {
        state.loaded = false; // so list can refresh on next visit
      })
      .addCase(addParishThunk.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add parish';
      });
  },
});

export default parishSlice.reducer;
