import React from 'react';

const Step4_Inspection = ({ register, errors }) => (
  <div className="step-content">
    <h3>Step 4: Schedule Property Inspection</h3>
    <p>A professional home inspection is crucial to identify any potential issues with the property before you finalize the purchase. Choose your preferred date for the inspection.</p>
    <div className="form-group">
      <label>Preferred Inspection Date</label>
      <input
        type="date"
        {...register('inspectionDate')}
        min={new Date().toISOString().split('T')[0]}
        placeholder="Select your preferred date"
      />
      {errors.inspectionDate && <span className="error">{errors.inspectionDate.message}</span>}
      <p className="text-sm text-gray-500 mt-1">Choose any date that works for you. We'll confirm availability.</p>
    </div>
    <div className="inspection-info">
      <h4>What's Included in a Standard Home Inspection:</h4>
      <ul>
        <li>Structural integrity assessment (foundation, walls, roof)</li>
        <li>Electrical systems check (wiring, outlets, panels)</li>
        <li>Plumbing inspection (pipes, fixtures, water heater)</li>
        <li>HVAC system evaluation (heating, ventilation, air conditioning)</li>
        <li>Roof and exterior assessment (shingles, siding, drainage)</li>
        <li>Appliance check (if applicable)</li>
      </ul>
    </div>
  </div>
);

export default Step4_Inspection;
