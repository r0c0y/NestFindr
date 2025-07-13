
import { configureStore } from '@reduxjs/toolkit';
import propertiesReducer from './propertiesSlice';
import favoritesReducer from './favoritesSlice';
import comparisonReducer from './comparisonSlice';

export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    favorites: favoritesReducer,
    comparison: comparisonReducer,
  },
});
