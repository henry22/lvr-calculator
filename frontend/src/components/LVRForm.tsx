import React, { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const formatCurrency = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const getLVRStatus = (lvr: number) => {
  if (lvr < 0.8) return { class: "lvr-safe", text: "Safe" };
  if (lvr < 0.9) return { class: "lvr-warning", text: "Warning" };
  return { class: "lvr-danger", text: "High Risk" };
};

const LVRForm = () => {
  const [formData, setFormData] = useState({
    estimatedPropertyValue: "",
    loanAmount: "",
    cashOutAmount: "",
    propertyValuationPhysical: "",
    propertyValuationEvidence: "",
  });
  const [lvr, setLvr] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add your submission logic here
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
    setIsSubmitting(false);
  };

  useEffect(() => {
    const {
      loanAmount,
      cashOutAmount,
      estimatedPropertyValue,
      propertyValuationPhysical,
    } = formData;

    if (loanAmount && estimatedPropertyValue) {
      setIsLoading(true);
      fetch("http://localhost:3001/api/lvr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loanAmount: Number(loanAmount),
          cashOutAmount: cashOutAmount ? Number(cashOutAmount) : 0,
          estimatedPropertyValue: Number(estimatedPropertyValue),
          propertyValuationPhysical: propertyValuationPhysical
            ? Number(propertyValuationPhysical)
            : undefined,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setLvr(null);
          } else {
            setLvr(data.lvr);
            setError(null);
          }
        })
        .catch((err) => {
          setError("Error calculating LVR: " + err.message);
          setLvr(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setLvr(null);
      setError(null);
    }
  }, [
    formData.loanAmount,
    formData.cashOutAmount,
    formData.estimatedPropertyValue,
    formData.propertyValuationPhysical,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Loan to Value Ratio Calculator
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Calculate your LVR to understand your loan risk level
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-danger-50 p-4">
              <div className="flex">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-danger-400"
                  aria-hidden="true"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-danger-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="estimatedPropertyValue" className="form-label">
              Estimated Property Value
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="estimatedPropertyValue"
                name="estimatedPropertyValue"
                value={formData.estimatedPropertyValue}
                onChange={handleChange}
                min="100000"
                max="2500000"
                required
                className="input-field"
                placeholder="Enter property value"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">AUD</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Must be between {formatCurrency(100000)} and{" "}
              {formatCurrency(2500000)}
            </p>
          </div>

          <div>
            <label htmlFor="loanAmount" className="form-label">
              Loan Amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="loanAmount"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                min="80000"
                max="2000000"
                required
                className="input-field"
                placeholder="Enter loan amount"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">AUD</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Must be between {formatCurrency(80000)} and{" "}
              {formatCurrency(2000000)}
            </p>
          </div>

          <div>
            <label htmlFor="cashOutAmount" className="form-label">
              Cash Out Amount (Optional)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
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
                className="input-field"
                placeholder="Enter cash out amount"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">AUD</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Maximum{" "}
              {formData.estimatedPropertyValue
                ? formatCurrency(0.5 * Number(formData.estimatedPropertyValue))
                : formatCurrency(0)}
            </p>
          </div>

          <div>
            <label htmlFor="propertyValuationPhysical" className="form-label">
              Physical Property Valuation (Optional)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="propertyValuationPhysical"
                name="propertyValuationPhysical"
                value={formData.propertyValuationPhysical}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter physical valuation"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">AUD</span>
              </div>
            </div>
          </div>

          {formData.propertyValuationPhysical && (
            <div>
              <label htmlFor="propertyValuationEvidence" className="form-label">
                Property Valuation Evidence
              </label>
              <input
                type="file"
                id="propertyValuationEvidence"
                name="propertyValuationEvidence"
                onChange={handleChange}
                required
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
              />
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <ArrowPathIcon className="h-6 w-6 text-primary-500 animate-spin" />
              <span className="ml-2 text-sm text-gray-500">
                Calculating LVR...
              </span>
            </div>
          ) : (
            lvr !== null && (
              <div className="rounded-md bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Calculated LVR
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Based on your inputs
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900 mr-2">
                      {(lvr * 100).toFixed(1)}%
                    </span>
                    <span
                      className={`lvr-indicator ${getLVRStatus(lvr).class}`}
                    >
                      {getLVRStatus(lvr).text}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || lvr === null || lvr >= 0.9}
              className="btn-primary w-full"
            >
              {isSubmitting ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
            {lvr !== null && lvr >= 0.9 && (
              <p className="mt-2 text-sm text-danger-600">
                LVR is too high for submission. Please adjust your loan amount
                or property value.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LVRForm;
