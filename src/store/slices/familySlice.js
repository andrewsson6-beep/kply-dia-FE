import { createSlice } from '@reduxjs/toolkit';
import {
  addContributionThunk,
  addFamilyThunk,
  deleteFamilyThunk,
  fetchFamiliesThunk,
  updateFamilyThunk,
} from '../actions/familyActions.js';

const initialState = {
  byCommunity: {}, // id -> { items, loading, error, loaded }
};

const ensureCommunity = (state, id) => {
  if (!state.byCommunity[id]) {
    state.byCommunity[id] = {
      items: [],
      loading: false,
      error: null,
      loaded: false,
    };
  }
};

const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFamiliesThunk.pending, (state, action) => {
        const { communityId } = action.meta.arg;
        ensureCommunity(state, communityId);
        state.byCommunity[communityId].loading = true;
        state.byCommunity[communityId].error = null;
      })
      .addCase(fetchFamiliesThunk.fulfilled, (state, action) => {
        const { communityId, list } = action.payload;
        ensureCommunity(state, communityId);
        state.byCommunity[communityId].loading = false;
        state.byCommunity[communityId].items = list;
        state.byCommunity[communityId].loaded = true;
      })
      .addCase(fetchFamiliesThunk.rejected, (state, action) => {
        const { communityId } = action.meta.arg;
        ensureCommunity(state, communityId);
        state.byCommunity[communityId].loading = false;
        state.byCommunity[communityId].error =
          action.payload || 'Error loading families';
      })
      .addCase(addFamilyThunk.fulfilled, (state, action) => {
        const { communityId, created } = action.payload;
        ensureCommunity(state, communityId);
        state.byCommunity[communityId].items.push(created);
      })
      .addCase(updateFamilyThunk.fulfilled, (state, action) => {
        const { communityId, updated } = action.payload;
        ensureCommunity(state, communityId);
        const idx = state.byCommunity[communityId].items.findIndex(
          f => f.id === updated.id
        );
        if (idx !== -1) state.byCommunity[communityId].items[idx] = updated;
      })
      .addCase(deleteFamilyThunk.fulfilled, (state, action) => {
        const { communityId, id } = action.payload;
        ensureCommunity(state, communityId);
        state.byCommunity[communityId].items = state.byCommunity[
          communityId
        ].items.filter(f => f.id !== id);
      })
      .addCase(addContributionThunk.fulfilled, (state, action) => {
        const { communityId, updated } = action.payload;
        ensureCommunity(state, communityId);
        const idx = state.byCommunity[communityId].items.findIndex(
          f => f.id === updated.id
        );
        if (idx !== -1) state.byCommunity[communityId].items[idx] = updated;
      });
  },
});

export default familySlice.reducer;
