
import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import listingsData from '../data/listingsData';

const PROPERTIES_PER_QUERY = 50;

const useProperties = (sortBy, filterPrice, filterType, filterBeds, searchQuery) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('loading');
  const [allProperties, setAllProperties] = useState([]);

  // Fetch properties from Firebase or use local data
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const propertiesRef = collection(db, 'properties');
        const propertyQuery = query(propertiesRef, limit(PROPERTIES_PER_QUERY));
        const snapshot = await getDocs(propertyQuery);

        if (!snapshot.empty) {
          const propertyList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().createdAt?.toDate().toLocaleDateString() || doc.data().date || 'N/A',
            price: Number(doc.data().price) || 0,
          }));
          setAllProperties(propertyList);
          setDataSource('firestore');
        } else {
          throw new Error("No properties found in Firestore, using local data.");
        }
      } catch (firestoreErr) {
        console.warn('Firestore error:', firestoreErr.message);
        // Fallback to local data
        setAllProperties(listingsData);
        setDataSource('local');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter and sort properties based on current filters
  const filteredProperties = useMemo(() => {
    let filteredData = [...allProperties];

    // Price filter
    if (filterPrice !== 'all') {
      const [min, max] = filterPrice.split('-').map(Number);
      filteredData = filteredData.filter(p => {
        return p.price >= min && (max ? p.price <= max : true);
      });
    }

    // Type filter
    if (filterType !== 'all') {
      filteredData = filteredData.filter(p => p.type === filterType);
    }

    // Beds filter
    if (filterBeds !== 'all') {
      if (filterBeds === '3') {
        filteredData = filteredData.filter(p => p.bedrooms >= 3);
      } else {
        filteredData = filteredData.filter(p => p.bedrooms === Number(filterBeds));
      }
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filteredData = filteredData.filter(p => {
        return (
          p.title.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          (p.location && p.location.toLowerCase().includes(q))
        );
      });
    }

    // Sort data
    filteredData.sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === '-price') return a.price - b.price;
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      return new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0);
    });

    return filteredData;
  }, [allProperties, sortBy, filterPrice, filterType, filterBeds, searchQuery]);

  // Update properties when filters change
  useEffect(() => {
    setProperties(filteredProperties);
  }, [filteredProperties]);

  return { properties, loading, error, dataSource };
};

export default useProperties;
