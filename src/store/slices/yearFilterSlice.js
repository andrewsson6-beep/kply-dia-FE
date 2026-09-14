import { createSlice } from '@reduxjs/toolkit';

const yearFilterSlice = createSlice({
  name: 'yearFilter',
  initialState: { selectedYear: null },
  reducers: {
    setSelectedYear: (state, action) => {
      state.selectedYear = action.payload || null;
    },
  },
});

export const { setSelectedYear } = yearFilterSlice.actions;
export default yearFilterSlice.reducer;