import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Listings from './pages/Listings';
import Calculator from './pages/Calculator';
import PropertyDetails from './pages/PropertyDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PropertyComparison from './pages/PropertyComparison';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationContainer from './components/NotificationContainer';




const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/listings/:id" element={<PropertyDetails />} />
          <Route path="/compare" element={<PropertyComparison />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <NotificationContainer />
      </AuthProvider>
    </NotificationProvider>
  );
};
export default App;
