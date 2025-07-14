import React, { useState } from 'react';
import '../styles/Contact.css';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

import Footer from '../components/Footer';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    setSubmitted(false);

    try {
      // IMPORTANT: Replace with your own Formspree endpoint
      const response = await fetch('https://formspree.io/f/your_form_id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSubmitted(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="contact-page-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="contact-hero-section">
        <motion.h1 
          className="contact-hero-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Ready to Connect?
        </motion.h1>
        <motion.p 
          className="contact-hero-subtitle"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Whether you're looking for your dream home, have a question about our services, or just want to say hello, we're here to help. Reach out to us today!
        </motion.p>
      </div>

      <div className="contact-main-content">
        <motion.div 
          className="contact-info-block"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <h2 className="info-block-title">Find Us Here</h2>
          <p className="info-block-description">We'd love to hear from you. Here's how you can get in touch with the NestFindr team.</p>
          <div className="info-cards-grid">
            <motion.div className="info-card" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <FiMail className="info-icon" />
              <div>
                <h3>Email Us</h3>
                <a href="mailto:contact@nestfindr.com">contact@nestfindr.com</a>
              </div>
            </motion.div>
            <motion.div className="info-card" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <FiPhone className="info-icon" />
              <div>
                <h3>Call Us</h3>
                <a href="tel:+919876543210">+91 98765 43210</a>
              </div>
            </motion.div>
            <motion.div className="info-card" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <FiMapPin className="info-icon" />
              <div>
                <h3>Our Office</h3>
                <p>NestFindr HQ, 456 Property Lane, Metro City, India</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="contact-form-block"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          <h2 className="form-block-title">Send Us a Message</h2>
          <p className="form-block-description">Use the form below to send us your inquiries, feedback, or any questions you might have.</p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
                className="form-textarea"
              />
            </div>
            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? (
                <>
                  <FiLoader className="spinner" /> Sending...
                </>
              ) : (
                <>
                  Send Message <FiSend />
                </>
              )}
            </button>
            {submitted && (
              <motion.div 
                className="form-message success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FiCheckCircle /> Thank you for your message! We'll be in touch soon.
              </motion.div>
            )}
            {error && (
              <motion.div 
                className="form-message error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FiAlertCircle /> Oops! Something went wrong. Please try again later.
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>

      <Footer />
    
    </motion.div>
  );
};

export default Contact;
