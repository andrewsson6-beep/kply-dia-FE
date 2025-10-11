import { createSlice } from '@reduxjs/toolkit';
import {
  fetchParishesThunk,
  addParishThunk,
  fetchParishesByForaneThunk,
  deleteParishThunk,
  updateParishThunk,
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
        // Prevent re-fetch loops on error
        state.loaded = true;
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
      })
      .addCase(deleteParishThunk.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter(p => p.id !== id);
        // Remove from any forane-specific cached lists
        Object.keys(state.byForane || {}).forEach(fid => {
          const bucket = state.byForane[fid];
          if (bucket && Array.isArray(bucket.items)) {
            bucket.items = bucket.items.filter(p => p.id !== id);
          }
        });
      })
      .addCase(deleteParishThunk.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete parish';
      })
      .addCase(updateParishThunk.fulfilled, (state, action) => {
        const u = action.payload; // { id, churchName, place, vicarName, contactNumber, foraneId }
        state.items = state.items.map(p =>
          p.id === u.id
            ? {
                ...p,
                churchName: u.churchName,
                place: u.place,
                vicarName: u.vicarName,
                contactNumber: u.contactNumber,
                foraneId: u.foraneId ?? p.foraneId,
                code: u.code ?? p.code,
              }
            : p
        );
        Object.keys(state.byForane || {}).forEach(fid => {
          const bucket = state.byForane[fid];
          if (bucket && Array.isArray(bucket.items)) {
            bucket.items = bucket.items.map(p =>
              p.id === u.id
                ? {
                    ...p,
                    churchName: u.churchName,
                    place: u.place,
                    vicarName: u.vicarName,
                    contactNumber: u.contactNumber,
                    foraneId: u.foraneId ?? p.foraneId,
                    code: u.code ?? p.code,
                  }
                : p
            );
          }
        });
      })
      .addCase(updateParishThunk.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update parish';
      });
  },
});

export default parishSlice.reducer;
