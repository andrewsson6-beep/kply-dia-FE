import { createSlice } from '@reduxjs/toolkit';
import {
  fetchIndividualsThunk,
  addIndividualThunk,
} from '../actions/individualActions.js';

const initialState = {
  items: [],
  loading: false,
  error: null,
  loaded: false,
};

const individualSlice = createSlice({
  name: 'individual',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchIndividualsThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndividualsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.loaded = true;
      })
      .addCase(fetchIndividualsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error loading individuals';
      })
      // add
      .addCase(addIndividualThunk.pending, state => {
        state.error = null;
      })
      .addCase(addIndividualThunk.fulfilled, state => {
        // force a refresh next time
        state.loaded = false;
      })
      .addCase(addIndividualThunk.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add individual';
      });
  },
});

export default individualSlice.reducer;
