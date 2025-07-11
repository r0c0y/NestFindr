import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const Listings = lazy(() => import('./pages/Listings'));
const Calculator = lazy(() => import('./pages/Calculator'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./auth/Login'));
const Signup = lazy(() => import('./auth/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));

import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';

const App1 = () => (
  <BrowserRouter basename="/NestFindr">
    <Toaster />
    <Navbar />
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Always use exact path for home */}
        <Route path="/" element={<Home />} />
        {/* Optionally, redirect /Home or /NestFindr to / */}
        <Route path="/Home" element={<Navigate to="/" replace />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<PropertyDetails />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/property/:propertyId" element={<PropertyDetails />} />
        {/* Catch-all: redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App1 />);
