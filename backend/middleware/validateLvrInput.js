function validateLvrInput(req, res, next) {
  const {
    loanAmount,
    cashOutAmount = 0,
    estimatedPropertyValue,
    propertyValuationPhysical
  } = req.body;

  if (typeof loanAmount !== 'number' || loanAmount < 80000 || loanAmount > 2000000) {
    return res.status(400).json({ error: "loanAmount must be a number between 80,000 and 2,000,000." });
  }
  if (typeof estimatedPropertyValue !== 'number' || estimatedPropertyValue < 100000 || estimatedPropertyValue > 2500000) {
    return res.status(400).json({ error: "estimatedPropertyValue must be a number between 100,000 and 2,500,000." });
  }
  if (typeof cashOutAmount !== 'number' || cashOutAmount < 0 || cashOutAmount > (0.5 * estimatedPropertyValue)) {
    return res.status(400).json({ error: "cashOutAmount (if provided) must be a number between 0 and (0.5 * estimatedPropertyValue)." });
  }
  if (typeof propertyValuationPhysical !== 'undefined' && typeof propertyValuationPhysical !== 'number') {
    return res.status(400).json({ error: "propertyValuationPhysical (if provided) must be a number." });
  }
  next();
}

module.exports = validateLvrInput; 