import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Listings from './pages/Listings';
import Calculator from './pages/Calculator';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './auth/Login';
import Signup from './auth/Signup'
import Navbar from './components/Navbar';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/calculator" element={<Calculator />} />
      </Routes>
    </>
  );
};
export default App;
