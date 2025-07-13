
import { useReducer, useEffect } from 'react';
import { favoritesReducer } from '../reducers/favoritesReducer';

export const useFavorites = () => {
  const [favorites, dispatch] = useReducer(favoritesReducer, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('nestfindr-favorites');
    if (savedFavorites) {
      dispatch({ type: 'LOAD_FAVORITES', payload: JSON.parse(savedFavorites) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nestfindr-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (property) => {
    dispatch({ type: 'ADD_TO_FAVORITES', payload: property });
  };

  const removeFromFavorites = (propertyId) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: propertyId });
  };

  const isInFavorites = (propertyId) => {
    return favorites.some(p => p.id === propertyId);
  };

  return { favorites, addToFavorites, removeFromFavorites, isInFavorites };
}; 
