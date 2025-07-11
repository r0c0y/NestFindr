
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import listingsData from '../data/listingsData';

const PROPERTIES_PER_QUERY = 10;

const useProperties = (sortBy, filterPrice, filterType, filterBeds, searchQuery) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('loading');

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const propertiesRef = collection(db, 'properties');
        let propertyQuery;

        const priceClauses = [];
        if (filterPrice !== 'all') {
          const [min, max] = filterPrice.split('-').map(Number);
          priceClauses.push(where('price', '>=', min));
          if (max) {
            priceClauses.push(where('price', '<=', max));
          }
        }

        const typeClauses = [];
        if (filterType !== 'all') {
          typeClauses.push(where('type', '==', filterType));
        }

        const bedsClauses = [];
        if (filterBeds !== 'all') {
          if (filterBeds === '3') {
            bedsClauses.push(where('bedrooms', '>=', 3));
          } else {
            bedsClauses.push(where('bedrooms', '==', Number(filterBeds)));
          }
        }

        const searchClauses = [];
        if (searchQuery) {
          // This is a simple search. For more complex search, you would need a dedicated search service like Algolia.
          searchClauses.push(where('title', '>=', searchQuery));
          searchClauses.push(where('title', '<=', searchQuery + '\uf8ff'));
        }

        const sortClauses = [];
        if (sortBy === 'price') {
          sortClauses.push(orderBy('price', 'desc'));
        } else if (sortBy === '-price') {
          sortClauses.push(orderBy('price', 'asc'));
        } else {
          sortClauses.push(orderBy('createdAt', 'desc'));
        }

        propertyQuery = query(propertiesRef, ...priceClauses, ...typeClauses, ...bedsClauses, ...searchClauses, ...sortClauses, limit(PROPERTIES_PER_QUERY));
        
        const snapshot = await getDocs(propertyQuery);

        if (!snapshot.empty) {
          const propertyList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().createdAt?.toDate().toLocaleDateString() || 'N/A',
            price: Number(doc.data().price) || 0,
          }));
          setProperties(propertyList);
          setDataSource('firestore');
        } else {
          throw new Error("No properties found in Firestore, using local data.");
        }
      } catch (firestoreErr) {
        console.warn(firestoreErr.message);
        // Fallback to local data
        let filteredData = [...listingsData];
        const priceFilterFn = (p) => {
          if (filterPrice === 'all') return true;
          const [min, max] = filterPrice.split('-').map(Number);
          return p.price >= min && (max ? p.price <= max : true);
        };
        filteredData = filteredData.filter(priceFilterFn);

        const typeFilterFn = (p) => {
          if (filterType === 'all') return true;
          return p.type === filterType;
        };
        filteredData = filteredData.filter(typeFilterFn);

        const bedsFilterFn = (p) => {
          if (filterBeds === 'all') return true;
          if (filterBeds === '3') return p.bedrooms >= 3;
          return p.bedrooms === Number(filterBeds);
        };
        filteredData = filteredData.filter(bedsFilterFn);

        const searchFilterFn = (p) => {
          if (!searchQuery) return true;
          const q = searchQuery.toLowerCase();
          return p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
        };
        filteredData = filteredData.filter(searchFilterFn);

        filteredData.sort((a, b) => {
          if (sortBy === 'price') return b.price - a.price;
          if (sortBy === '-price') return a.price - b.price;
          return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
        });
        
        setProperties(filteredData);
        setDataSource('local');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [sortBy, filterPrice, filterType, filterBeds, searchQuery]);

  return { properties, loading, error, dataSource };
};

export default useProperties;
