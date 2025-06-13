import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import './Calculator.css';

const Calculator = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [propertyTitle, setPropertyTitle] = useState('');
  const [homePrice, updateHomePrice] = useState('');
  const [downPayment, updateDownPayment] = useState('');
  const [loanTerm, updateLoanTerm] = useState('30');
  const [interestRate, updateInterestRate] = useState('8.5'); // Default interest rate
  const [result, updateResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [reminderStatus, setReminderStatus] = useState(null); // 'success', 'error', or null
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Parse URL parameters and set initial values
  useEffect(() => {
    const priceParam = searchParams.get('price');
    const propertyParam = searchParams.get('property');
    
    // Validate and set price
    if (priceParam) {
      const numericPrice = parseFloat(priceParam);
      if (!isNaN(numericPrice) && numericPrice > 0) {
        updateHomePrice(numericPrice.toString());
        
        // Set default down payment to 20% of property price
        const defaultDownPayment = Math.round(numericPrice * 0.20);
        updateDownPayment(defaultDownPayment.toString());
      }
    }
    
    // Set property title if provided
    if (propertyParam) {
      setPropertyTitle(decodeURIComponent(propertyParam));
    }
  }, [searchParams]);

  const validateInputs = () => {
    const newErrors = {};
    // Convert all to numbers
    const price = Number(homePrice);
    const payment = Number(downPayment);
    const termYears = Number(loanTerm);
    const rate = Number(interestRate);

    if (!price || isNaN(price) || price <= 0) {
      newErrors.homePrice = 'Please enter a valid property price.';
    }

    if (isNaN(payment) || payment < 0) {
      newErrors.downPayment = 'Down payment cannot be negative.';
    } else if (payment > price) {
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
      return;
    }

    // Convert all to numbers
    const price = Number(homePrice);
    const payment = Number(downPayment);
    const termYears = Number(loanTerm);
    const rate = Number(interestRate);
    
    const term = termYears * 12;
    const monthlyRate = rate / 100 / 12;
    const loanAmount = price - payment;

    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / term;
    } else {
      monthlyPayment =
        (loanAmount * monthlyRate * (1 + monthlyRate) ** term) /
        ((1 + monthlyRate) ** term - 1);
    }

    updateResult({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: (monthlyPayment * term).toFixed(2),
      totalInterest: ((monthlyPayment * term) - loanAmount).toFixed(2),
      loanAmount: loanAmount.toFixed(2)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateMortgage();
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(value);
  };
  
  // Add reminder to user's dashboard
  const addReminderToDashboard = async () => {
    if (!user) {
      // Show login prompt if user is not authenticated
      setShowLoginPrompt(true);
      // Hide prompt after 3 seconds
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }
    
    if (!result) {
      return; // No calculation result to save
    }
    
    try {
      // Create unique ID for reminder
      const reminderId = `mortgage_${Date.now()}`;
      
      // Calculate due date (next month)
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + 1);
      
      // Create reminder document
      const reminderDoc = {
        id: reminderId,
        type: 'mortgage',
        amount: parseFloat(result.monthlyPayment),
        propertyName: propertyTitle || 'Property Mortgage',
        propertyPrice: parseFloat(homePrice),
        dueDate,
        createdAt: new Date(),
        details: {
          interestRate: parseFloat(interestRate),
          loanTerm: parseInt(loanTerm),
          downPayment: parseFloat(downPayment),
          totalInterest: parseFloat(result.totalInterest)
        }
      };
      
      // Save to Firestore
      await setDoc(doc(db, `users/${user.uid}/reminders`, reminderId), reminderDoc);
      
      // Show success message
      setReminderStatus('success');
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setReminderStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Error adding reminder:", error);
      setReminderStatus('error');
      
      // Clear error status after 3 seconds
      setTimeout(() => {
        setReminderStatus(null);
      }, 3000);
    }
  };
  
  // Navigate to login page
  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="calculator-container">
      {showLoginPrompt && (
        <div className="login-prompt">
          <p>Please log in to save reminders</p>
          <button className="login-prompt-button" onClick={handleLoginClick}>
            Log in
          </button>
        </div>
      )}
      
      <h1 className="calculator-title">Mortgage Calculator</h1>
      {propertyTitle && (
        <div className="property-context">
          <p>Calculating mortgage for: <strong>{propertyTitle}</strong></p>
        </div>
      )}
      <form className="calculator-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="homePrice">Property Price (₹)</label>
          <input
            id="homePrice"
            type="number"
            min="0"
            value={homePrice}
            onChange={e => updateHomePrice(e.target.value)}
            placeholder="e.g. 5000000"
            className={errors.homePrice ? 'error' : ''}
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
            onChange={e => updateDownPayment(e.target.value)}
            placeholder="e.g. 1000000"
            className={errors.downPayment ? 'error' : ''}
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
            onChange={e => updateLoanTerm(e.target.value)}
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
            onChange={e => updateInterestRate(e.target.value)}
            placeholder="e.g. 8.5"
            className={errors.interestRate ? 'error' : ''}
          />
          {errors.interestRate && <p className="error-message">{errors.interestRate}</p>}
        </div>

        <button type="submit" className="calculate-button">
          Calculate Payment
        </button>
      </form>

      {result && (
        <div className="result">
          <h3 className="result-title">Monthly Payment: {formatCurrency(result.monthlyPayment)}</h3>
          <div className="breakdown">
            <h4>Payment Breakdown</h4>
            <div className="breakdown-item">
              <span>Loan Amount:</span>
              <span>{formatCurrency(result.loanAmount)}</span>
            </div>
            <div className="breakdown-item">
              <span>Total Payment:</span>
              <span>{formatCurrency(result.totalPayment)}</span>
            </div>
            <div className="breakdown-item">
              <span>Total Interest:</span>
              <span>{formatCurrency(result.totalInterest)}</span>
            </div>
          </div>
          
          <div className="reminder-section">
            <button 
              className={`reminder-button ${reminderStatus === 'success' ? 'success' : ''}`}
              onClick={addReminderToDashboard}
              disabled={reminderStatus === 'success'}
            >
              {reminderStatus === 'success' ? '✓ Added to Reminders' : 'Set Monthly Reminder'}
            </button>
            
            {reminderStatus === 'error' && (
              <div className="reminder-error">
                Failed to add reminder. Please try again.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;

