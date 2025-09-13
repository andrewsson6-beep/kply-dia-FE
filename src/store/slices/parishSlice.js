import { createSlice } from '@reduxjs/toolkit';
import { fetchParishesThunk } from '../actions/parishActions.js';

const initialState = {
  items: [],
  loading: false,
  error: null,
  loaded: false,
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
      });
  },
});

export default parishSlice.reducer;
