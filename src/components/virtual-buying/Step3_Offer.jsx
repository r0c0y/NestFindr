import React from 'react';

const Step3_Offer = ({ property }) => (
  <div className="step-content">
    <h3>Step 3: Make Your Offer</h3>
    <p>Ready to make it official? Submit your offer for this property. You can propose your desired price and closing timeline, along with any conditions (contingencies).</p>
    <div className="offer-details">
      <div className="form-group">
        <label>Your Offer Price ($)</label>
        <input
          type="number"
          placeholder={property.price}
          defaultValue={property.price}
        />
      </div>
      <div className="form-group">
        <label>Preferred Closing Timeline</label>
        <select>
          <option value="30">30 days</option>
          <option value="45">45 days</option>
          <option value="60">60 days</option>
        </select>
      </div>
      <div className="form-group">
        <label>Contingencies (Conditions for the sale)</label>
        <div className="checkbox-group">
          <label>
            <input type="checkbox" defaultChecked />
            Inspection contingency (Allows you to back out if inspection reveals major issues)
          </label>
          <label>
            <input type="checkbox" defaultChecked />
            Financing contingency (Protects you if you can't secure a loan)
          </label>
          <label>
            <input type="checkbox" />
            Appraisal contingency (Ensures the home appraises for the offer price)
          </label>
        </div>
      </div>
    </div>
  </div>
);

export default Step3_Offer;
