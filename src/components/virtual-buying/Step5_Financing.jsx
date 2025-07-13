import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const Step5_Financing = ({ property, watch, calculateMonthlyPayment, formatPrice }) => (
  <div className="step-content">
    <h3>Step 5: Secure Your Financing</h3>
    <p>This is where you finalize your mortgage. We'll guide you through completing your application and getting final approval for your home loan.</p>
    <div className="financing-status">
      <div className="status-item completed">
        <FiCheckCircle />
        <span>Pre-qualification completed</span>
      </div>
      <div className="status-item completed">
        <FiCheckCircle />
        <span>Credit check passed</span>
      </div>
      <div className="status-item completed">
        <FiCheckCircle />
        <span>Income verification completed</span>
      </div>
      <div className="status-item in-progress">
        <div className="spinner"></div>
        <span>Final underwriting in progress</span>
      </div>
    </div>
    <div className="loan-summary">
      <h4>Your Loan Summary</h4>
      <div className="summary-item">
        <span>Estimated Loan Amount:</span>
        <span>{formatPrice(property.price - (watch('downPayment') || 0))}</span>
      </div>
      <div className="summary-item">
        <span>Interest Rate:</span>
        <span>4.5% APR (Estimated)</span>
      </div>
      <div className="summary-item">
        <span>Loan Term:</span>
        <span>30 years</span>
      </div>
      <div className="summary-item">
        <span>Estimated Monthly Payment:</span>
        <span>{formatPrice(calculateMonthlyPayment())}</span>
      </div>
    </div>
  </div>
);

export default Step5_Financing;
