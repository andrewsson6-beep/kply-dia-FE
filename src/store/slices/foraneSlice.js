import { createSlice } from '@reduxjs/toolkit';
import { fetchForanesThunk } from '../actions/foraneActions.js';

const initialState = {
  items: [],
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
        state.items = action.payload;
        state.loaded = true;
      })
      .addCase(fetchForanesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error loading foranes';
      });
  },
});

export default foraneSlice.reducer;
