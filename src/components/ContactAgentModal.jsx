import React from 'react';
import Modal from './Modal/Modal'; // Ensure this path is correct
import '../styles/ContactAgentModal.css';

const ContactAgentModal = ({ isOpen, onClose, propertyTitle, agentName, agentPhone, agentColor }) => {
  console.log("ContactAgentModal props:", { isOpen, onClose, propertyTitle, agentName, agentPhone, agentColor });
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Agent">
      <div className="contact-agent-modal-content" style={{ borderColor: agentColor }}>
        <h2>Contact Agent</h2>
        <p>For inquiries about <strong>{propertyTitle}</strong>, please reach out to our agent:</p>
        <div className="agent-info-section" style={{ backgroundColor: agentColor + '1A' }}> {/* Add a subtle background color */}
          <h3 style={{ color: agentColor }}>{agentName}</h3>
          <p>Listing Agent</p>
          <p>Email: <a href="mailto:jane.doe@nestfindr.com">jane.doe@nestfindr.com</a></p>
          <p>Phone: <a href={`tel:${agentPhone}`}>{agentPhone}</a></p>
        </div>
        <button className="close-button" onClick={onClose} style={{ backgroundColor: agentColor }}>Close</button>
      </div>
    </Modal>
  );
};

export default ContactAgentModal;
