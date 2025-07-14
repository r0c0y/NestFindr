import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import './SimplifiedMortgageCalculatorModal.css';

const SimplifiedMortgageCalculatorModal = ({ isOpen, onClose, propertyPrice, propertyTitle, onCalculate, compareList, setMortgageResults, isComparisonMode }) => {
  const [homePrice, setHomePrice] = useState(propertyPrice ? propertyPrice.toString() : '');
  const [downPayment, setDownPayment] = useState('');
  const [loanTerm, setLoanTerm] = useState('30');
  const [interestRate, setInterestRate] = useState('8.5'); // Default interest rate for India
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isComparisonMode) {
      setHomePrice(''); // Clear home price in comparison mode
      setDownPayment(''); // Clear down payment in comparison mode
    } else if (propertyPrice) {
      setHomePrice(propertyPrice.toString());
      const defaultDownPayment = Math.round(propertyPrice * 0.20);
      setDownPayment(defaultDownPayment.toString());
    }
  }, [propertyPrice, isComparisonMode]);

  const validateInputs = () => {
    const newErrors = {};
    const price = Number(homePrice);
    const payment = Number(downPayment);
    const termYears = Number(loanTerm);
    const rate = Number(interestRate);

    if (!isComparisonMode && (!price || isNaN(price) || price <= 0)) {
      newErrors.homePrice = 'Please enter a valid property price.';
    }

    if (!isComparisonMode && (isNaN(payment) || payment < 0)) {
      newErrors.downPayment = 'Down payment cannot be negative.';
    } else if (!isComparisonMode && payment > price) {
      newErrors.downPayment = 'Down payment cannot be greater than property price.';
    }

    if (!termYears || isNaN(termYears) || termYears <= 0) {
      newErrors.loanTerm = 'Please enter a valid loan term.';
    } else if (termYears > 100) {
      newErrors.loanTerm = 'Loan term is too long. Please enter a realistic value.';
    }

    if (!rate || isNaN(rate) || rate <= 0) {
      newErrors.interestRate = 'Please enter a valid interest rate.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateMortgage = () => {
    if (!validateInputs()) {
      setMonthlyPayment(null);
      return;
    }

    if (isComparisonMode && compareList && setMortgageResults) {
      console.log("--- Calculating for all properties (Comparison Mode) ---");
      console.log("Loan Term (years):", loanTerm, "Interest Rate (%):", interestRate);
      console.log("Compare List:", compareList);

      const newMortgageResults = {};
      const termYears = Number(loanTerm);
      const rate = Number(interestRate);

      compareList.forEach(prop => {
        const propPrice = Number(prop.price);
        const propPayment = Math.round(propPrice * 0.20); // Default 20% down payment for comparison
        const loanAmount = propPrice - propPayment;
        const term = termYears * 12;
        const monthlyRate = rate / 100 / 12;

        console.log(`  Property ${prop.title} (ID: ${prop.id}):`);
        console.log(`    Prop Price: ${propPrice}, Prop Payment: ${propPayment}, Loan Amount: ${loanAmount}`);
        console.log(`    Term (months): ${term}, Monthly Rate: ${monthlyRate}`);

        let calculatedMonthlyPayment = 0;
        if (monthlyRate === 0) {
          calculatedMonthlyPayment = loanAmount / term;
        } else {
          const numerator = loanAmount * monthlyRate * Math.pow((1 + monthlyRate), term);
          const denominator = Math.pow((1 + monthlyRate), term) - 1;
          calculatedMonthlyPayment = numerator / denominator;
        }
        newMortgageResults[prop.id] = calculatedMonthlyPayment.toFixed(2);
        console.log(`    Calculated Monthly Payment: ${calculatedMonthlyPayment.toFixed(2)}`);
      });
      setMortgageResults(newMortgageResults);
      console.log("New Mortgage Results:", newMortgageResults);
      onClose(); // Close modal after calculating for all
    } else {
      console.log("--- Calculating for single property ---");
      const price = Number(homePrice);
      const payment = Number(downPayment);
      const termYears = Number(loanTerm);
      const rate = Number(interestRate);
      
      const loanAmount = price - payment;
      const term = termYears * 12;
      const monthlyRate = rate / 100 / 12;

      console.log(`  Single Property:`);
      console.log(`    Price: ${price}, Payment: ${payment}, Loan Amount: ${loanAmount}`);
      console.log(`    Term (months): ${term}, Monthly Rate: ${monthlyRate}`);

      let calculatedMonthlyPayment = 0;
      if (monthlyRate === 0) {
        calculatedMonthlyPayment = loanAmount / term;
      } else {
        const numerator = loanAmount * monthlyRate * Math.pow((1 + monthlyRate), term);
        const denominator = Math.pow((1 + monthlyRate), term) - 1;
        calculatedMonthlyPayment = numerator / denominator;
      }
      setMonthlyPayment(calculatedMonthlyPayment.toFixed(2));
      if (onCalculate) {
        onCalculate(calculatedMonthlyPayment.toFixed(2));
      }
      console.log("Single Property Monthly Payment:", calculatedMonthlyPayment.toFixed(2));
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Mortgage for ${propertyTitle || 'Property'}`}>
      <div className="simplified-calculator-container">
        <form onSubmit={(e) => { e.preventDefault(); calculateMortgage(); }}>
          <div className="form-group">
            <label htmlFor="homePrice">Property Price (₹)</label>
            <input
              id="homePrice"
              type="number"
              min="0"
              value={homePrice}
              onChange={e => setHomePrice(e.target.value)}
              placeholder="e.g. 5000000"
              className={errors.homePrice ? 'error' : ''}
              disabled={isComparisonMode} // Disable in comparison mode
            />
            {homePrice && <span className="formatted-value">{formatCurrency(homePrice)}</span>}
            {errors.homePrice && <p className="error-message">{errors.homePrice}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="downPayment">Down Payment (₹)</label>
            <input
              id="downPayment"
              type="number"
              min="0"
              value={downPayment}
              onChange={e => setDownPayment(e.target.value)}
              placeholder="e.g. 1000000"
              className={errors.downPayment ? 'error' : ''}
              disabled={isComparisonMode} // Disable in comparison mode
            />
            {downPayment && <span className="formatted-value">{formatCurrency(downPayment)}</span>}
            {errors.downPayment && <p className="error-message">{errors.downPayment}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="loanTerm">Loan Term (years)</label>
            <input
              id="loanTerm"
              type="number"
              min="1"
              max="100"
              value={loanTerm}
              onChange={e => setLoanTerm(e.target.value)}
              placeholder="e.g. 30"
              className={errors.loanTerm ? 'error' : ''}
            />
            {errors.loanTerm && <p className="error-message">{errors.loanTerm}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="interestRate">Interest Rate (%)</label>
            <input
              id="interestRate"
              type="number"
              min="0"
              step="0.01"
              value={interestRate}
              onChange={e => setInterestRate(e.target.value)}
              placeholder="e.g. 8.5"
              className={errors.interestRate ? 'error' : ''}
            />
            {errors.interestRate && <p className="error-message">{errors.interestRate}</p>}
          </div>

          <button type="submit" className="calculate-button">
            {isComparisonMode ? 'Calculate for All Properties' : 'Calculate Monthly Payment'}
          </button>
        </form>

        {monthlyPayment && !isComparisonMode && (
          <div className="result">
            <h3>Estimated Monthly Payment: {formatCurrency(monthlyPayment)}</h3>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SimplifiedMortgageCalculatorModal;
