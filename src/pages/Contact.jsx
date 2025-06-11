import React, { useState } from 'react';
import '../styles/Contact.css';

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
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <div className="contact-info">
        <div>
          <span role="img" aria-label="email">📧</span> Email: <a href="mailto:info@nestfindr.com">info@nestfindr.com</a>
        </div>
        <div>
          <span role="img" aria-label="phone">📞</span> Phone: <a href="tel:+911234567890">+91 12345 67890</a>
        </div>
        <div>
          <span role="img" aria-label="address">🏢</span> Address: 123 Main Street, City, India
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
            Thank you for contacting us!
          </div>
        )}
      </form>
    </div>
  );
};

export default Contact;
