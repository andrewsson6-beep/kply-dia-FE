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
      })
      .addCase(fetchParishesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.loaded = true;
      })
      .addCase(fetchParishesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error loading parishes';
      })
      // Per-forane parishes
      .addCase(fetchParishesByForaneThunk.pending, (state, action) => {
        const foraneId = action.meta.arg;
        state.byForane[foraneId] = state.byForane[foraneId] || {
          items: [],
          loading: false,
          error: null,
          loaded: false,
        };
        state.byForane[foraneId].loading = true;
        state.byForane[foraneId].error = null;
      })
      .addCase(fetchParishesByForaneThunk.fulfilled, (state, action) => {
        const { foraneId, items } = action.payload;
        state.byForane[foraneId] = {
          items,
          loading: false,
          error: null,
          loaded: true,
        };
      })
      .addCase(fetchParishesByForaneThunk.rejected, (state, action) => {
        const foraneId = action.meta.arg;
        state.byForane[foraneId] = state.byForane[foraneId] || {
          items: [],
          loading: false,
          error: null,
          loaded: false,
        };
        state.byForane[foraneId].loading = false;
        state.byForane[foraneId].error =
          action.payload || 'Error loading parishes';
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
