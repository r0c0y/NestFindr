import React, { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import './Calculator.css';

const Calculator = ({ initialPrice, initialPropertyTitle, onCalculate, calculateWithSameConditions, compareList, setMortgageResults, selectedPropertyId }) => {
  const [user] = useAuthState(auth);
  const [propertyTitle, setPropertyTitle] = useState(initialPropertyTitle || '');
  const [homePrice, updateHomePrice] = useState(initialPrice ? initialPrice.toString() : '');
  const [downPayment, updateDownPayment] = useState('');
  const [loanTerm, updateLoanTerm] = useState('30');
  const [interestRate, updateInterestRate] = useState('8.5'); // Default interest rate for India
  const [result, updateResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [reminderStatus, setReminderStatus] = useState(null); // 'success', 'error', or null
  
  // Set initial values from props
  useEffect(() => {
    if (initialPrice) {
      const numericPrice = parseFloat(initialPrice);
      if (!isNaN(numericPrice) && numericPrice > 0) {
        updateHomePrice(numericPrice.toString());
        // Set default down payment to 20% of property price
        const defaultDownPayment = Math.round(numericPrice * 0.20);
        updateDownPayment(defaultDownPayment.toString());
      }
    } else {
      updateHomePrice('');
      updateDownPayment('');
    }
    if (initialPropertyTitle) {
      setPropertyTitle(initialPropertyTitle);
    } else {
      setPropertyTitle('');
    }
  }, [initialPrice, initialPropertyTitle]);

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

  const calculateMortgage = useCallback((price, payment, termYears, rate) => {
    const numPrice = Number(price);
    const numPayment = Number(payment);
    const numTermYears = Number(termYears);
    const numRate = Number(rate);

    const term = numTermYears * 12;
    const monthlyRate = numRate / 100 / 12;
    const loanAmount = numPrice - numPayment;

    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / term;
    } else {
      monthlyPayment =
        (loanAmount * monthlyRate * (1 + monthlyRate) ** term) /
        ((1 + monthlyRate) ** term - 1);
    }

    return {
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalPayment: parseFloat((monthlyPayment * term).toFixed(2)),
      totalInterest: parseFloat(((monthlyPayment * term) - loanAmount).toFixed(2)),
      loanAmount: parseFloat(loanAmount.toFixed(2))
    };
  }, []);

  const recalculateAllMortgages = useCallback(() => {
    if (compareList && setMortgageResults) {
      const newMortgageResults = {};
      compareList.forEach(prop => {
        const propPrice = Number(prop.price);
        const propPayment = Math.round(propPrice * 0.20); // Default 20% down payment for comparison
        const calculatedResult = calculateMortgage(propPrice, propPayment, Number(loanTerm), Number(interestRate));
        newMortgageResults[prop.id] = calculatedResult.monthlyPayment;
      });
      setMortgageResults(newMortgageResults);
    }
  }, [compareList, setMortgageResults, calculateMortgage, loanTerm, interestRate]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }

    const price = Number(homePrice);
    const payment = Number(downPayment);
    const termYears = Number(loanTerm);
    const rate = Number(interestRate);

    if (calculateWithSameConditions) {
      recalculateAllMortgages();
      // When calculating for all, we don't update the single result in the modal
      // as the parent (PropertyComparison) is responsible for displaying all results.
    } else {
      const calculatedResult = calculateMortgage(price, payment, termYears, rate);
      updateResult(calculatedResult);
      if (onCalculate) {
        onCalculate(selectedPropertyId, calculatedResult.monthlyPayment);
      }
    }
  }, [homePrice, downPayment, loanTerm, interestRate, calculateWithSameConditions, onCalculate, selectedPropertyId, validateInputs, calculateMortgage, recalculateAllMortgages]);

  useEffect(() => {
    if (calculateWithSameConditions) {
      recalculateAllMortgages();
    }
  }, [calculateWithSameConditions, recalculateAllMortgages]);

  

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
      // This logic should ideally be handled by the parent component or a global auth context
      // For now, we'll just return and not save the reminder
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
  
  return (
    <div className="calculator-container">
      
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


