// Helper function to create formatted dates for the past few months
const getRandomPastDate = () => {
  const now = new Date();
  const pastDate = new Date(now);
  // Random date between 1-90 days ago
  pastDate.setDate(now.getDate() - Math.floor(Math.random() * 90) - 1);
  return pastDate;
};

// Locations in India for more realistic data
const locations = [
  { city: "Mumbai", areas: ["Bandra", "Andheri", "Juhu", "Powai", "Worli"] },
  { city: "Delhi", areas: ["Connaught Place", "Dwarka", "Hauz Khas", "Rohini", "Saket"] },
  { city: "Bangalore", areas: ["Indiranagar", "Koramangala", "Whitefield", "HSR Layout", "Jayanagar"] },
  { city: "Pune", areas: ["Koregaon Park", "Viman Nagar", "Kothrud", "Baner", "Hinjewadi"] },
  { city: "Hyderabad", areas: ["Banjara Hills", "Jubilee Hills", "Gachibowli", "HITEC City", "Madhapur"] },
  { city: "Chennai", areas: ["T Nagar", "Adyar", "Anna Nagar", "Velachery", "Mylapore"] },
  { city: "Kolkata", areas: ["Salt Lake", "Park Street", "New Town", "Ballygunge", "Alipore"] }
];

// Property types for variety
const propertyTypes = ["Apartment", "Villa", "House", "Penthouse", "Studio", "Duplex"];

// Property features to add variety
const features = [
  "Gym", "Swimming Pool", "24/7 Security", "Children's Play Area", 
  "Clubhouse", "Landscaped Gardens", "Power Backup", "Car Parking",
  "Rainwater Harvesting", "Senior Citizen Area", "Indoor Games", "Jogging Track"
];

// Generate realistic listing data
const listingsData = Array.from({ length: 50 }, (_, i) => {
  // Choose random location
  const locationIndex = Math.floor(Math.random() * locations.length);
  const location = locations[locationIndex];
  const areaIndex = Math.floor(Math.random() * location.areas.length);
  const area = location.areas[areaIndex];
  
  // Generate property details
  const propType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
  const bedrooms = Math.floor(Math.random() * 4) + 1; // 1-4 bedrooms
  const bathrooms = Math.floor(Math.random() * 3) + 1; // 1-3 bathrooms
  const sqft = (Math.floor(Math.random() * 2000) + 800); // 800-2800 sqft
  
  // Price range based on city (Mumbai/Delhi more expensive)
  let basePrice;
  if (locationIndex <= 1) { // Mumbai or Delhi
    basePrice = 8000000 + Math.floor(Math.random() * 12000000); // ₹80L - 2Cr
  } else {
    basePrice = 4000000 + Math.floor(Math.random() * 8000000); // ₹40L - 1.2Cr
  }
  
  // Adjust price based on bedrooms and sqft
  const price = basePrice + (bedrooms * 500000) + (sqft * 1000);
  
  // Random features (2-5 features)
  const numFeatures = Math.floor(Math.random() * 4) + 2;
  const propertyFeatures = [];
  for (let j = 0; j < numFeatures; j++) {
    const feature = features[Math.floor(Math.random() * features.length)];
    if (!propertyFeatures.includes(feature)) {
      propertyFeatures.push(feature);
    }
  }
  
  // Create date object (for Firestore compatibility)
  const createdAt = getRandomPastDate();
  const formattedDate = createdAt.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Generate unique ID (compatible with Firestore document IDs)
  const id = `property_${Date.now()}_${i}_${Math.floor(Math.random() * 10000)}`;
  
  // Description with realistic property features
  const description = `Beautiful ${bedrooms} BHK ${propType} in ${area}, ${location.city}. This ${sqft} sq.ft. property features ${bathrooms} bathrooms and comes with ${propertyFeatures.join(', ')}. Perfect for families looking for a comfortable living space in a prime location.`;
  
  return {
    id,
    title: `${bedrooms} BHK ${propType} in ${area}`,
    address: `${area}, ${location.city}`,
    description,
    price: price, // Numeric value for sorting
    formattedPrice: `₹${(price / 100000).toFixed(2)}L`, // Formatted for display
    bedrooms,
    bathrooms,
    sqft,
    features: propertyFeatures,
    date: formattedDate,
    createdAt, // Date object for Firestore compatibility
    image: `https://source.unsplash.com/500x300/?house,property,real,estate&sig=${i}`, // Unique image for each property
    imageUrl: `https://source.unsplash.com/500x300/?house,property,real,estate&sig=${i}`, // Alternative prop name
  };
});

export default listingsData;
