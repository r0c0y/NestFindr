import React from 'react';

const Step2_Prequalification = ({ register, errors, watch, calculateMonthlyPayment, formatPrice }) => (
  <div className="step-content">
    <h3>Step 2: Get Pre-qualified for a Home Loan</h3>
    <p>Understanding your budget is key for home buying in India. Provide some basic financial information to see how much you might be able to borrow. This helps you make a confident offer later.</p>
    <div className="form-group">
      <label>Your Annual Income (₹)</label>
      <input
        type="number"
        {...register('income')}
        placeholder="e.g., 1200000 (12 Lakhs)"
      />
      {errors.income && <span className="error">{errors.income.message}</span>}
      <small className="helper-text">Enter your gross annual income in INR</small>
    </div>
    <div className="form-group">
      <label>Your Down Payment (₹)</label>
      <input
        type="number"
        {...register('downPayment')}
        placeholder="e.g., 1000000 (10 Lakhs)"
      />
      {errors.downPayment && <span className="error">{errors.downPayment.message}</span>}
      <small className="helper-text">Minimum 20% of property value recommended</small>
    </div>
    <div className="form-group">
      <label>Preferred Loan Type</label>
      <select {...register('loanType')}>
        <option value="">Select a loan type</option>
        <option value="sbi-home-loan">SBI Home Loan (7.50% - 8.50%)</option>
        <option value="hdfc-home-loan">HDFC Home Loan (8.00% - 8.75%)</option>
        <option value="icici-home-loan">ICICI Home Loan (8.25% - 9.00%)</option>
        <option value="axis-home-loan">Axis Bank Home Loan (8.50% - 9.25%)</option>
        <option value="lic-home-loan">LIC Housing Finance (8.00% - 8.90%)</option>
        <option value="pnb-home-loan">PNB Home Loan (8.40% - 9.15%)</option>
        <option value="pmay">PMAY (Pradhan Mantri Awas Yojana) - 6.50%</option>
      </select>
      {errors.loanType && <span className="error">{errors.loanType.message}</span>}
      <small className="helper-text">Interest rates are approximate and vary based on your profile</small>
    </div>
    {watch('income') && watch('downPayment') && (
      <div className="payment-estimate">
        <h4>Estimated Monthly EMI</h4>
        <p className="monthly-payment">{formatPrice(calculateMonthlyPayment())}</p>
        <p className="text-sm text-gray-600">This is an estimate based on 8.5% annual rate over 20 years. Actual rates may vary.</p>
        <div className="loan-eligibility-info">
          <h5>Loan Eligibility Guidelines (India):</h5>
          <ul>
            <li>EMI should not exceed 40-50% of your monthly income</li>
            <li>Minimum age: 21 years, Maximum age: 65 years</li>
            <li>Minimum 2 years of work experience</li>
            <li>CIBIL Score: 750+ for best rates</li>
          </ul>
        </div>
      </div>
    )}
  </div>
);

export default Step2_Prequalification;
