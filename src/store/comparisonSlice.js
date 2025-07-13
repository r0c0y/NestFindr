
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  compareList: [],
};

export const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      state.compareList.push(action.payload);
    },
    removeFromCompare: (state, action) => {
      state.compareList = state.compareList.filter(
        (property) => property.id !== action.payload.id
      );
    },
    clearCompare: (state) => {
      state.compareList = [];
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } = comparisonSlice.actions;

export default comparisonSlice.reducer;
