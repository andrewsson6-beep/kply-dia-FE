import { createSlice } from '@reduxjs/toolkit';
import { fetchForanesThunk, addForaneThunk } from '../actions/foraneActions.js';

const initialState = {
  items: [],
  nameOptions: [], // {id, name, location}
  loading: false,
  error: null,
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
      })
      .addCase(fetchForanesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.nameOptions = action.payload.options || [];
        state.loaded = true;
      })
      .addCase(fetchForanesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error loading foranes';
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
      });
  },
});

export default foraneSlice.reducer;
