import { createSlice } from '@reduxjs/toolkit';
import {
  fetchForanesThunk,
  addForaneThunk,
  deleteForaneThunk,
  updateForaneThunk,
} from '../actions/foraneActions.js';

const initialState = {
  items: [],
  nameOptions: [], // {id, name, location}
  loading: false,
  error: null,
  emptyMessage: null,
  loaded: false,
};

const foraneSlice = createSlice({
  name: 'forane',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchForanesThunk.pending, state => {
        state.loading = true;
        state.error = null;
        state.emptyMessage = null;
      })
      .addCase(fetchForanesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.nameOptions = action.payload.options || [];
        state.emptyMessage = action.payload.emptyMessage || null;
        state.loaded = true;
      })
      .addCase(fetchForanesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error loading foranes';
        state.emptyMessage = null;
        // Mark as loaded to prevent infinite re-fetch loops on error
        state.loaded = true;
      })
      // Add
      .addCase(addForaneThunk.pending, state => {
        state.error = null;
      })
      .addCase(addForaneThunk.fulfilled, state => {
        // After add, mark not loaded to encourage refresh
        state.loaded = false;
      })
      .addCase(addForaneThunk.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add forane';
      })
      .addCase(deleteForaneThunk.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter(f => f.id !== id);
        state.nameOptions = state.nameOptions.filter(f => f.id !== id);
      })
      .addCase(updateForaneThunk.fulfilled, (state, action) => {
        const { id, changes } = action.payload;
        state.items = state.items.map(f =>
          f.id === id ? { ...f, ...changes } : f
        );
        state.nameOptions = state.nameOptions.map(f =>
          f.id === id
            ? { ...f, name: changes.churchName, location: changes.place }
            : f
        );
      });
  },
});

export default foraneSlice.reducer;
