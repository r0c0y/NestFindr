import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const sampleProperties = [
  {
    title: "Modern Downtown Apartment",
    location: "123 Main Street, Downtown, CA 90210",
    price: 750000,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    yearBuilt: 2020,
    description: "Stunning modern apartment in the heart of downtown with city views, high-end finishes, and premium amenities.",
    features: ["City Views", "Modern Kitchen", "Gym", "Pool", "Parking", "Security"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
    ],
    agent: {
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@nestfindr.com"
    },
    createdAt: new Date().toISOString(),
    status: "available"
  },
  {
    title: "Suburban Family Home",
    location: "456 Oak Avenue, Suburbia, CA 91210",
    price: 950000,
    type: "House",
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    yearBuilt: 2015,
    description: "Spacious family home with large backyard, perfect for families. Recently renovated with modern amenities.",
    features: ["Large Backyard", "Garage", "Renovated Kitchen", "Hardwood Floors", "Fireplace", "Storage"],
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    agent: {
      name: "Michael Chen",
      phone: "+1 (555) 987-6543",
      email: "michael.chen@nestfindr.com"
    },
    createdAt: new Date().toISOString(),
    status: "available"
  },
  {
    title: "Luxury Penthouse",
    location: "789 Skyline Drive, Hills, CA 90211",
    price: 2500000,
    type: "Penthouse",
    bedrooms: 3,
    bathrooms: 4,
    area: 3000,
    yearBuilt: 2022,
    description: "Exclusive penthouse with panoramic views, private elevator, and luxury finishes throughout.",
    features: ["Panoramic Views", "Private Elevator", "Rooftop Terrace", "Wine Cellar", "Smart Home", "Concierge"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80"
    ],
    agent: {
      name: "Emily Rodriguez",
      phone: "+1 (555) 456-7890",
      email: "emily.rodriguez@nestfindr.com"
    },
    createdAt: new Date().toISOString(),
    status: "available"
  },
  {
    title: "Cozy Studio Apartment",
    location: "321 College Street, University District, CA 90212",
    price: 450000,
    type: "Studio",
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    yearBuilt: 2018,
    description: "Perfect starter home or investment property. Efficiently designed studio with modern amenities.",
    features: ["Efficient Layout", "Modern Appliances", "Close to Transit", "Storage", "Balcony", "Laundry"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1571508601194-de86ac2c0c8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    agent: {
      name: "David Park",
      phone: "+1 (555) 234-5678",
      email: "david.park@nestfindr.com"
    },
    createdAt: new Date().toISOString(),
    status: "available"
  },
  {
    title: "Waterfront Condo",
    location: "654 Marina Boulevard, Waterfront, CA 90213",
    price: 1200000,
    type: "Condo",
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    yearBuilt: 2019,
    description: "Beautiful waterfront condo with direct water access and marina views. Resort-style amenities.",
    features: ["Water Views", "Marina Access", "Resort Amenities", "Boat Slip", "Fitness Center", "Beach Access"],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    agent: {
      name: "Lisa Thompson",
      phone: "+1 (555) 345-6789",
      email: "lisa.thompson@nestfindr.com"
    },
    createdAt: new Date().toISOString(),
    status: "available"
  },
  {
    title: "Historic Townhouse",
    location: "987 Heritage Lane, Old Town, CA 90214",
    price: 850000,
    type: "Townhouse",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    yearBuilt: 1925,
    description: "Charming historic townhouse with original details and modern updates. Rich in character and history.",
    features: ["Historic Character", "Original Details", "Modern Updates", "Private Garden", "Brick Fireplace", "Hardwood"],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    agent: {
      name: "Robert Wilson",
      phone: "+1 (555) 567-8901",
      email: "robert.wilson@nestfindr.com"
    },
    createdAt: new Date().toISOString(),
    status: "available"
  }
];

export const seedFirebaseData = async () => {
  try {
    console.log('Starting Firebase seeding...');
    
    // Clear existing data
    const existingDocs = await getDocs(collection(db, 'properties'));
    console.log(`Found ${existingDocs.size} existing properties. Clearing...`);
    
    const deletePromises = existingDocs.docs.map(docSnap => 
      deleteDoc(doc(db, 'properties', docSnap.id))
    );
    await Promise.all(deletePromises);
    
    // Add sample data
    console.log('Adding sample properties...');
    const addPromises = sampleProperties.map(property => 
      addDoc(collection(db, 'properties'), {
        ...property,
        image: property.images[0] // Use first image as main image for compatibility
      })
    );
    
    await Promise.all(addPromises);
    
    console.log(`Successfully seeded ${sampleProperties.length} properties to Firebase!`);
    return true;
  } catch (error) {
    console.error('Error seeding Firebase:', error);
    return false;
  }
};

// Helper function to check if data exists
export const checkFirebaseData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'properties'));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error checking Firebase data:', error);
    return 0;
  }
};
