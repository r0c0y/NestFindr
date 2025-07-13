import React, { useState } from 'react';
import '../styles/Contact.css';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <motion.div 
      className="contact-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="contact-title">Contact Us</h1>
      <div className="contact-info">
        <div className="contact-card">
          <FiMail className="contact-icon" />
          <p>Email: <a href="mailto:info@nestfindr.com">info@nestfindr.com</a></p>
        </div>
        <div className="contact-card">
          <FiPhone className="contact-icon" />
          <p>Phone: <a href="tel:+911234567890">+91 12345 67890</a></p>
        </div>
        <div className="contact-card">
          <FiMapPin className="contact-icon" />
          <p>Address: 123 Main Street, City, India</p>
        </div>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="contact-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="contact-input"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          rows={4}
          className="contact-textarea"
        />
        <button type="submit" className="contact-button">
          Send Message
        </button>
        {submitted && (
          <div className="contact-success">
            Thank you for contacting us! We'll get back to you soon.
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default Contact;
