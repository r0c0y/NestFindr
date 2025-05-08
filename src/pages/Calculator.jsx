import React, { useState } from 'react';

function Calculator() {
  const [homePrice, setHomePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [loanTerm, setLoanTerm] = useState('30');
  const [interestRate, setInterestRate] = useState('');
  const [propertyTax, setPropertyTax] = useState('1.2');
  const [insurance, setInsurance] = useState('0.5');
  
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [breakdown, setBreakdown] = useState({
    principal: 0,
    interest: 0,
    tax: 0,
    insurance: 0
  });

  const formatCurrency = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseCurrency = (value) => {
    return value.replace(/,/g, '');
  };

  const handleHomePriceChange = (e) => {
    const value = parseCurrency(e.target.value);
    if (/^\d*$/.test(value)) {
      setHomePrice(value);
    }
  };

  const handleDownPaymentChange = (e) => {
    const value = parseCurrency(e.target.value);
    if (/^\d*$/.test(value)) {
      setDownPayment(value);
    }
  };

  const calculateMortgage = () => {
    if (!homePrice || !downPayment || !interestRate) {
      alert('Please fill all required fields');
      return;
    }

    const price = parseFloat(homePrice);
    const payment = parseFloat(downPayment);
    const term = parseInt(loanTerm) * 12;
    const rate = parseFloat(interestRate) / 100 / 12;
    const taxRate = parseFloat(propertyTax) / 100 / 12;
    const insuranceRate = parseFloat(insurance) / 100 / 12;

    if (isNaN(price) || isNaN(payment) || isNaN(term) || isNaN(rate) || 
        payment > price || rate <= 0) {
      alert('Please enter valid numerical values');
      return;
    }

    const loanAmount = price - payment;
    const monthlyPrincipalAndInterest = loanAmount * (rate * Math.pow(1 + rate, term)) / 
                                      (Math.pow(1 + rate, term) - 1);

    const monthlyTax = price * taxRate;
    const monthlyInsurance = price * insuranceRate;

    const total = monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance;

    setMonthlyPayment(total.toFixed(2));
    setBreakdown({
      principal: (monthlyPrincipalAndInterest - (loanAmount * rate)).toFixed(2),
      interest: (loanAmount * rate).toFixed(2),
      tax: monthlyTax.toFixed(2),
      insurance: monthlyInsurance.toFixed(2)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateMortgage();
  };

  return (
    <div className="calculator-container">
      <h2>Mortgage Calculator</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="homePrice">Home Price ($)</label>
          <input
            type="text"
            id="homePrice"
            value={formatCurrency(homePrice)}
            onChange={handleHomePriceChange}
            placeholder="e.g. 300,000"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="downPayment">Down Payment ($)</label>
          <input
            type="text"
            id="downPayment"
            value={formatCurrency(downPayment)}
            onChange={handleDownPaymentChange}
            placeholder="e.g. 60,000"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="loanTerm">Loan Term (years)</label>
          <select
            id="loanTerm"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
          >
            <option value="30">30 years</option>
            <option value="20">20 years</option>
            <option value="15">15 years</option>
            <option value="10">10 years</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="interestRate">Interest Rate (%)</label>
          <input
            type="number"
            id="interestRate"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="e.g. 4.5"
            step="0.01"
            min="0.1"
            max="20"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="propertyTax">Property Tax (% per year)</label>
          <input
            type="number"
            id="propertyTax"
            value={propertyTax}
            onChange={(e) => setPropertyTax(e.target.value)}
            placeholder="e.g. 1.2"
            step="0.01"
            min="0"
            max="10"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="insurance">Home Insurance (% per year)</label>
          <input
            type="number"
            id="insurance"
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            placeholder="e.g. 0.5"
            step="0.01"
            min="0"
            max="5"
          />
        </div>
        
        <button type="submit">Calculate Payment</button>
      </form>
      
      {monthlyPayment && (
        <div className="result">
          <div>Monthly Payment: ${formatCurrency(monthlyPayment)}</div>
          <div className="breakdown">
            <h3>Payment Breakdown</h3>
            <div className="breakdown-item">
              <span>Principal:</span> 
              <span>${formatCurrency(breakdown.principal)}</span>
            </div>
            <div className="breakdown-item">
              <span>Interest:</span> 
              <span>${formatCurrency(breakdown.interest)}</span>
            </div>
            <div className="breakdown-item">
              <span>Property Tax:</span> 
              <span>${formatCurrency(breakdown.tax)}</span>
            </div>
            <div className="breakdown-item">
              <span>Insurance:</span> 
              <span>${formatCurrency(breakdown.insurance)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calculator;
