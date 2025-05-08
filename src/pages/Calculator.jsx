import React, { useState } from 'react';
import '../styles/Calculator.css';

const Calculator = () => {
  const [principal, setPrincipal] = useState('');
  const [interest, setInterest] = useState('');
  const [years, setYears] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interest) / 100 / 12;
    const n = parseFloat(years) * 12;

    if (!p || !r || !n) return;

    const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthlyPayment(m.toFixed(2));
  };

  return (
    <div className="calculator-container">
      <h2>Mortgage Calculator</h2>
      <div className="form-group">
        <label>Loan Amount (₹)</label>
        <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Annual Interest Rate (%)</label>
        <input type="number" value={interest} onChange={(e) => setInterest(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Loan Term (Years)</label>
        <input type="number" value={years} onChange={(e) => setYears(e.target.value)} />
      </div>
      <button onClick={calculate}>Calculate</button>

      {monthlyPayment && (
        <div className="result">
          Estimated Monthly Payment: ₹{monthlyPayment}
        </div>
      )}
    </div>
  );
};

export default Calculator;
