import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiArrowRight, FiArrowLeft, FiHome, FiDollarSign, FiFileText, FiCalendar, FiCreditCard, FiKey } from 'react-icons/fi';
import toast from 'react-hot-toast';

import Modal from './Modal';
import VirtualBuyReceipt from './VirtualBuyReceipt'; // Import the new receipt component
import Step1_Interest from './virtual-buying/Step1_Interest';
import Step2_Prequalification from './virtual-buying/Step2_Prequalification';
import Step3_Offer from './virtual-buying/Step3_Offer';
import Step4_Inspection from './virtual-buying/Step4_Inspection';
import Step5_Financing from './virtual-buying/Step5_Financing';
import Step6_Closing from './virtual-buying/Step6_Closing';

import '../styles/VirtualBuyingProcess.css';

// Schema for validation
const schema = yup.object().shape({
  income: yup.number().positive('Income must be positive').required('Annual income is required'),
  downPayment: yup.number().positive('Down payment must be positive').required('Down payment is required'),
  loanType: yup.string().required('Loan type is required'),
  inspectionDate: yup.date().required('Inspection date is required').min(new Date(), 'Inspection date cannot be in the past'),
  moveInDate: yup.date().required('Move-in date is required').min(new Date(), 'Move-in date cannot be in the past'),
});

const VirtualBuyingProcess = ({ property, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [buyingData, setBuyingData] = useState({});
  const user = { uid: 'mockUserId' };
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptContent, setReceiptContent] = useState('');

  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
 });
  
  // Define the steps and the fields to validate for each step
  const steps = [
    { id: 'interest', title: 'Express Interest', icon: FiHome, fields: [], description: 'Start your journey' },
    { id: 'prequalification', title: 'Pre-qualification', icon: FiDollarSign, fields: ['income', 'downPayment', 'loanType'], description: 'Understand your budget' },
    { id: 'offer', title: 'Make Offer', icon: FiFileText, fields: [], description: 'Propose your terms' },
    { id: 'inspection', title: 'Inspection', icon: FiCalendar, fields: ['inspectionDate'], description: 'Check property condition' },
    { id: 'financing', title: 'Financing', icon: FiCreditCard, fields: [], description: 'Secure your loan' },
    { id: 'closing', title: 'Closing', icon: FiKey, fields: ['moveInDate'], description: 'Finalize the purchase' }
  ];

  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep].fields;
    // Only validate if there are fields to validate for the current step
    const isValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate) : true;

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const goToStep = (stepIndex) => {
    // Allow navigation only to previously completed steps
    if (stepIndex < currentStep) {
        setCurrentStep(stepIndex);
    }
  }

  // This function is called only on the final submission
  const onFinalSubmit = (data) => {
    const finalData = { ...buyingData, ...data };
    setBuyingData(finalData);
    toast.success('Congratulations! Your virtual purchase process is complete!');
    console.log('Final buying data:', { ...finalData, property });

    // Generate receipt content
    const receiptText = `
      NESTFINDR PROPERTY PURCHASE RECEIPT
      -----------------------------------

      Date: ${new Date().toLocaleDateString()}
      Time: ${new Date().toLocaleTimeString()}

      Property Details:
      -----------------
      Title: ${property.title}
      Address: ${property.address || property.location}
      Price: ${formatPrice(property.price)}

      Buyer Information:
      ------------------
      Name: ${finalData.fullName || 'N/A'}
      Email: ${finalData.email || 'N/A'}
      Phone: ${finalData.phone || 'N/A'}

      Financial Summary:
      -------------------
      Annual Income: ${formatPrice(finalData.income || 0)}
      Down Payment: ${formatPrice(finalData.downPayment || 0)}
      Loan Type: ${finalData.loanType || 'N/A'}
      Estimated Monthly Payment: ${formatPrice(calculateMonthlyPayment())}

      Key Dates:
      ----------
      Inspection Date: ${finalData.inspectionDate ? new Date(finalData.inspectionDate).toLocaleDateString() : 'N/A'}
      Move-in Date: ${finalData.moveInDate ? new Date(finalData.moveInDate).toLocaleDateString() : 'N/A'}

      Terms and Conditions:
      ---------------------
      This receipt confirms your successful completion of the NestFindr virtual property purchase process. This is a simulated transaction for informational purposes only and does not constitute a legally binding agreement to purchase the property. All actual property transactions require formal contracts, legal review, and financial approvals.

      Thank you for using NestFindr!
    `;
    setReceiptContent(receiptText);
    setShowReceipt(true);
  };

  const formatPrice = useCallback((price) => {
    if (typeof price !== 'number') return '';
    if (price >= 10000000) { // 1 Crore = 10,000,000
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) { // 1 Lakh = 100,000
      return `₹${(price / 100000).toFixed(2)} Lakhs`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  const calculateMonthlyPayment = useCallback(() => {
    const income = watch('income'); // Added income to watch
    const downPayment = watch('downPayment');
    
    if (!income || !downPayment || !property) return 0;
    
    const loanAmount = property.price - downPayment;
    if (loanAmount <= 0) return 0;

    // Assuming a fixed annual interest rate and loan term for simplicity.
    // In a real application, these would likely come from user input or a loan API.
    const annualInterestRate = 0.045; // 4.5% annual rate
    const loanTermYears = 30; // 30 years

    const monthlyRate = annualInterestRate / 12;
    const numPayments = loanTermYears * 12;
    
    // Mortgage payment formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
    // Where: P = principal loan amount, i = monthly interest rate, n = number of payments
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    // Basic check: monthly payment should not exceed a certain percentage of monthly income (e.g., 30%)
    const monthlyIncome = income / 12;
    if (monthlyPayment > (monthlyIncome * 0.30)) {
      // This is a simple check. In a real scenario, you'd provide more detailed feedback
      // or integrate with a proper loan qualification service.
      return monthlyPayment; // Still return the calculated value, but user should be aware
    }

    return monthlyPayment > 0 ? monthlyPayment : 0;
  }, [watch, property]);

  const stepComponents = [
    <Step1_Interest property={property} formatPrice={formatPrice} nextStep={handleNext} />,
    <Step2_Prequalification register={register} errors={errors} watch={watch} calculateMonthlyPayment={calculateMonthlyPayment} formatPrice={formatPrice} />,
    <Step3_Offer property={property} />,
    <Step4_Inspection register={register} errors={errors} />,
    <Step5_Financing property={property} watch={watch} calculateMonthlyPayment={calculateMonthlyPayment} formatPrice={formatPrice} />,
    <Step6_Closing register={register} errors={errors} />
  ];

  return (
    <Modal isOpen={true} onClose={onClose} title="Virtual Buying Process">
      <div className="virtual-buying-content">
        <div className="progress-bar">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`progress-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              onClick={() => goToStep(index)}
            >
              <div className="step-icon"><step.icon /></div>
              <div className="step-info">
                <span className="step-title">{step.title}</span>
                <span className="step-description">{step.description}</span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onFinalSubmit)} className="buying-form">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {stepComponents[currentStep]}
            </motion.div>
          </AnimatePresence>
        </form>

        <div className="modal-actions">
          {currentStep > 0 && (
            <button type="button" onClick={prevStep} className="btn-secondary">
              <FiArrowLeft /> Previous
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button type="button" onClick={handleNext} className="btn-primary">
              Next <FiArrowRight />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit(onFinalSubmit)} className="btn-success">
              Complete Purchase <FiKey />
            </button>
          )}
        </div>
      </div>
    {showReceipt && (
        <VirtualBuyReceipt
          isOpen={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            onClose(); // Close the main virtual buying modal after receipt is closed
          }}
          receiptData={{ content: receiptContent }}
        />
      )}
    </Modal>
  );
};

export default VirtualBuyingProcess;
