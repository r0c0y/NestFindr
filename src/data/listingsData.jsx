
const listingsData = Array.from({ length: 70 },() => ({
  title: `PRoperty  ${i + 1}`,
  location: `City ${i + 1}`,
  price: `₹${(50 + i) * 1000}`,
  date: `2025-05-${(i % 30 + 1).toString().padStart(2, "0")}`,
  image: "https://via.placeholder.com/200x150?text=Home" 
}));

export default listingsData;
