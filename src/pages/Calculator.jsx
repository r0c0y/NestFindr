import React from 'react';
import CalculatorComponent from '../components/Calculator';
import '../styles/CalculatorPage.css';

const Calculator = () => {
  return (
    <div className="calculator-page-container">
      <div className="calculator-page-header">
        <h1 className="calculator-page-title">Mortgage Calculator</h1>
        <p className="calculator-page-subtitle">
          Plan your home purchase with our easy-to-use mortgage calculator. Estimate your monthly payments and see a breakdown of costs.
        </p>
      </div>
      <div className="calculator-page-content">
        <CalculatorComponent />
      </div>
      <div className="calculator-page-info">
        <h3 className="info-title">About Mortgage Calculations</h3>
        <p className="info-text">
          Our mortgage calculator helps you estimate your monthly mortgage payment. 
          Simply enter the property price, down payment amount, loan term, and interest rate to get started.
        </p>
        <h3 className="info-title">Need Help?</h3>
        <p className="info-text">
          If you need assistance understanding mortgage terms or have questions about home financing, 
          please <a href="/contact" className="info-link">contact our team</a> for personalized support.
        </p>
      </div>
    </div>
  );
};

export default Calculator;
