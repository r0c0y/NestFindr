
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  listings: [],
  loading: false,
  error: null,
};

export const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    fetchPropertiesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPropertiesSuccess: (state, action) => {
      state.loading = false;
      state.listings = action.payload;
    },
    fetchPropertiesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchPropertiesStart, fetchPropertiesSuccess, fetchPropertiesFailure } = propertiesSlice.actions;

export default propertiesSlice.reducer;
