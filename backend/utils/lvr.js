function calculateLvr({ loanAmount, cashOutAmount = 0, estimatedPropertyValue, propertyValuationPhysical }) {
  const borrowingAmount = loanAmount + cashOutAmount;
  const propertyValue = (typeof propertyValuationPhysical === 'number') ? propertyValuationPhysical : estimatedPropertyValue;
  if (propertyValue === 0) {
    throw new Error('Property value cannot be zero.');
  }
  return borrowingAmount / propertyValue;
}

module.exports = calculateLvr; 