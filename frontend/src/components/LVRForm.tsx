import React, { useState } from "react";

const LVRForm = () => {
  const [formData, setFormData] = useState({
    estimatedPropertyValue: "",
    loanAmount: "",
    cashOutAmount: "",
    propertyValuationPhysical: "",
    propertyValuationEvidence: "",
  });
  const [lvr, setLvr] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // (Later, we'll call our backend endpoint here.)
    // (For now, you can log the form data.)
    console.log(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}
    >
      <h2>Loan to Value Ratio (LVR) Calculator</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label htmlFor="estimatedPropertyValue">
          Estimated Property Value (mandatory, min 100,000 / max 2,500,000):
        </label>
        <input
          type="number"
          id="estimatedPropertyValue"
          name="estimatedPropertyValue"
          value={formData.estimatedPropertyValue}
          onChange={handleChange}
          min="100000"
          max="2500000"
          required
        />
      </div>
      <div>
        <label htmlFor="loanAmount">
          Estimated Loan Value (mandatory, min 80,000 / max 2,000,000):
        </label>
        <input
          type="number"
          id="loanAmount"
          name="loanAmount"
          value={formData.loanAmount}
          onChange={handleChange}
          min="80000"
          max="2000000"
          required
        />
      </div>
      <div>
        <label htmlFor="cashOutAmount">
          Cash Out Amount (optional, min 0 / max 0.5 * property value):
        </label>
        <input
          type="number"
          id="cashOutAmount"
          name="cashOutAmount"
          value={formData.cashOutAmount}
          onChange={handleChange}
          min="0"
          max={
            formData.estimatedPropertyValue
              ? 0.5 * Number(formData.estimatedPropertyValue)
              : 0
          }
        />
      </div>
      <div>
        <label htmlFor="propertyValuationPhysical">
          Property Valuation (Physical) (optional):
        </label>
        <input
          type="number"
          id="propertyValuationPhysical"
          name="propertyValuationPhysical"
          value={formData.propertyValuationPhysical}
          onChange={handleChange}
        />
      </div>
      {formData.propertyValuationPhysical && (
        <div>
          <label htmlFor="propertyValuationEvidence">
            Property Valuation Evidence (mandatory if Physical Valuation is
            provided):
          </label>
          <input
            type="file"
            id="propertyValuationEvidence"
            name="propertyValuationEvidence"
            onChange={handleChange}
            required
          />
        </div>
      )}
      {lvr !== null && <p>Calculated LVR: {lvr.toFixed(2)}</p>}
      <button type="submit" disabled={lvr !== null && lvr >= 0.9}>
        Submit
      </button>
    </form>
  );
};

export default LVRForm;
