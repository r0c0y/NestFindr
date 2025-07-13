import React from 'react';
import Modal from './Modal';

const ContactAgentModal = ({ isOpen, onClose, propertyTitle }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Agent">
      <div className="contact-agent-modal">
        <h2>Contact Agent</h2>
        <p>Interested in <strong>{propertyTitle}</strong>?</p>
        <form className="contact-agent-form">
          <label>
            Your Name
            <input type="text" name="name" required />
          </label>
          <label>
            Your Email
            <input type="email" name="email" required />
          </label>
          <label>
            Message
            <textarea name="message" rows={4} placeholder="I am interested in this property. Please contact me."></textarea>
          </label>
          <button type="submit" className="btn-primary">Send Inquiry</button>
        </form>
      </div>
    </Modal>
  );
};

export default ContactAgentModal;
