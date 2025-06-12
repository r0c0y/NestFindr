import React, { useState } from 'react';
import '../styles/Calculator.css';

const Calculator = () => {
  const [homePrice, updateHomePrice] = useState('');
  const [downPayment, updateDownPayment] = useState('');
  const [loanTerm, updateLoanTerm] = useState('30');
  const [interestRate, updateInterestRate] = useState('');
  const [propertyTax, updatePropertyTax] = useState('1.2');
  const [insurance, updateInsurance] = useState('0.5');
  const [result, updateResult] = useState(null);

  const showAlert = (msg) => {
    window.alert(msg);
  };

  const calculateMortgage = () => {
    // Convert all to numbers
    const price = Number(homePrice);
    const payment = Number(downPayment);
    const termYears = Number(loanTerm);
    const rate = Number(interestRate);
    const tax = Number(propertyTax);
    const ins = Number(insurance);

    // Validation
    if (
      !price || !payment || !termYears || !rate ||
      isNaN(price) || isNaN(payment) || isNaN(termYears) || isNaN(rate) ||
      price <= 0 || payment < 0 || termYears <= 0 || rate <= 0
    ) {
      showAlert('Please enter valid positive numbers for all required fields.');
      return;
    }
    if (payment > price) {
      showAlert('Down payment cannot be greater than home price.');
      return;
    }
    if (tax < 0 || ins < 0) {
      showAlert('Property tax and insurance cannot be negative.');
      return;
    }
    if (price - payment <= 0) {
      showAlert('Loan amount must be greater than zero.');
      return;
    }
    if (termYears > 100) {
      showAlert('Loan term is too long. Please enter a realistic value.');
      return;
    }

    const term = termYears * 12;
    const monthlyRate = rate / 100 / 12;
    const taxRate = tax / 100 / 12;
    const insuranceRate = ins / 100 / 12;
    const loanAmount = price - payment;

    let monthlyPrincipalAndInterest = 0;
    if (monthlyRate === 0) {
      monthlyPrincipalAndInterest = loanAmount / term;
    } else {
      monthlyPrincipalAndInterest =
        (loanAmount * monthlyRate * (1 + monthlyRate) ** term) /
        ((1 + monthlyRate) ** term - 1);
    }
    const monthlyTax = price * taxRate;
    const monthlyInsurance = price * insuranceRate;

    const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance;

    updateResult({
      total: totalMonthlyPayment.toFixed(0),
      principalAndInterest: monthlyPrincipalAndInterest.toFixed(0),
      tax: monthlyTax.toFixed(0),
      insurance: monthlyInsurance.toFixed(0),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateMortgage();
  };

  return (
    <div className="calculator-container">
      <h1 className="calculator-title">Mortgage Calculator</h1>
      <div className="calculator-form">
        <div className="form-group">
          <label>Home Price (₹)
            <input
              value={homePrice}
              onChange={e => updateHomePrice(e.target.value)}
            />
            <span style={{ marginLeft: 12 }}>
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(homePrice)}
            </span>
          </label>
        </div>
        <div className="form-group">
          <label>Down Payment (₹)
            <input
              type="number"
              min="0"
              value={downPayment}
              onChange={(e) => updateDownPayment(e.target.value)}
              placeholder="e.g. 1000000"
            />
          </label>
        </div>
        <div className="form-group">
          <label>Loan Term (years)
            <input
              type="number"
              min="1"
              max="100"
              value={loanTerm}
              onChange={(e) => updateLoanTerm(e.target.value)}
              placeholder="e.g. 20"
            />
          </label>
        </div>
        <div className="form-group">
          <label>Interest Rate (%)
            <input
              type="number"
              min="0"
              step="0.01"
              value={interestRate}
              onChange={(e) => updateInterestRate(e.target.value)}
              placeholder="e.g. 8.5"
            />
          </label>
        </div>
        <div className="form-group">
          <label>Property Tax %
            <input
              type="number"
              min="0"
              step="0.01"
              value={propertyTax}
              onChange={(e) => updatePropertyTax(e.target.value)}
              placeholder="e.g. 1.2"
            />
          </label>
        </div>
        <div className="form-group">
          <label>Home Insurance %
            <input
              type="number"
              min="0"
              step="0.01"
              value={insurance}
              onChange={(e) => updateInsurance(e.target.value)}
              placeholder="e.g. 0.5"
            />
          </label>
        </div>
        <button className="calculate-button" onClick={handleSubmit}>
          Calculate Payment
        </button>
      </div>
      {result && (
        <div className="result">
          <h3 className="result-title">Monthly Payment: ₹{result.total}</h3>
          <div className="breakdown">
            <h4>Payment Breakdown</h4>
            <div className="breakdown-item">
              <span>Principal & Interest:</span>
              <span>₹{result.principalAndInterest}</span>
            </div>
            <div className="breakdown-item">
              <span>Property Tax:</span>
              <span>₹{result.tax}</span>
            </div>
            <div className="breakdown-item">
              <span>Home Insurance:</span>
              <span>₹{result.insurance}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;