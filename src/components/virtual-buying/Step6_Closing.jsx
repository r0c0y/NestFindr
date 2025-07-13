import React from 'react';

const Step6_Closing = ({ register, errors }) => (
  <div className="step-content">
    <h3>Step 6: The Closing Process</h3>
    <p>You're almost there! The closing is the final step where all legal documents are signed, and ownership of the property is transferred to you. Choose your preferred move-in date.</p>
    <div className="form-group">
      <label>Preferred Move-in Date</label>
      <input
        type="date"
        {...register('moveInDate')}
        min={new Date().toISOString().split('T')[0]}
      />
      {errors.moveInDate && <span className="error">{errors.moveInDate.message}</span>}
    </div>
    <div className="closing-checklist">
      <h4>Closing Checklist:</h4>
      <ul>
        <li>✓ Final walkthrough of the property</li>
        <li>✓ Home insurance policy secured</li>
        <li>✓ Review and sign closing disclosure</li>
        <li>✓ Arrange for transfer of funds</li>
        <li>✓ Confirm details with the title company</li>
        <li>✓ Receive your new home keys!</li>
      </ul>
    </div>
    <div className="congratulations">
      <h4>🎉 Congratulations!</h4>
      <p>You're about to become a homeowner! Your virtual purchase process is nearly complete.</p>
    </div>
  </div>
);

export default Step6_Closing;
