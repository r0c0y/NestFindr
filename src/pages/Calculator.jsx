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

  const calculateMortgage = () => {
    if (!homePrice || !downPayment || !interestRate) {
      return;
    }

    const price = Number(homePrice);
    const payment = Number(downPayment);
    const term = Number(loanTerm) * 12;
    const rate = Number(interestRate) / 100 / 12;
    const taxRate = Number(propertyTax) / 100 / 12;
    const insuranceRate = Number(insurance) / 100 / 12;

    const loanAmount = price - payment;
    const monthlyPrincipalAndInterest =
      (loanAmount * rate * (1 + rate) ** term) / ((1 + rate) ** term - 1);
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
            <input type="number" value={homePrice} onChange={(e) => updateHomePrice(e.target.value)} placeholder="e.g. 5000000"/>
          </label>
        </div>
        <div className="form-group">
          <label>Down Payment (₹)
            <input type="number" value={downPayment} onChange={(e) => updateDownPayment(e.target.value)} placeholder="e.g. 1000000"/>
          </label>
        </div>
        <div className="form-group">
          <label>Loan Term (years)
            <select value={loanTerm} onChange={(e) => updateLoanTerm(e.target.value)}>
              <option value="30">30 years</option>
              <option value="20">20 years</option>
              <option value="15">15 years</option>
              <option value="10">10 years</option>
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>Interest Rate (%)
            <input type="number" value={interestRate} onChange={(e) => updateInterestRate(e.target.value)} placeholder="e.g. 8.5" step="0.1"/>
          </label>
        </div>
        <div className="form-group">
          <label>Property Tax %
            <input type="number" value={propertyTax} onChange={(e) => updatePropertyTax(e.target.value)} placeholder="e.g. 1.2" step="0.1"/>
          </label>
        </div>
        <div className="form-group">
          <label>Home Insurance %
            <input type="number" value={insurance} onChange={(e) => updateInsurance(e.target.value)} step="0.1" placeholder="e.g. 0.5"/>
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