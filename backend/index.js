const express = require('express');
const app = express();

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/lvr', (req, res) => {
  const {
    loanAmount,
    cashOutAmount = 0,
    estimatedPropertyValue,
    propertyValuationPhysical
  } = req.body;

  // Basic validation
  if (
    typeof loanAmount !== 'number' ||
    typeof estimatedPropertyValue !== 'number'
  ) {
    return res.status(400).json({ error: 'loanAmount and estimatedPropertyValue are required and must be numbers.' });
  }

  const borrowingAmount = loanAmount + cashOutAmount;
  const propertyValue = typeof propertyValuationPhysical === 'number'
    ? propertyValuationPhysical
    : estimatedPropertyValue;

  if (propertyValue === 0) {
    return res.status(400).json({ error: 'Property value cannot be zero.' });
  }

  const lvr = borrowingAmount / propertyValue;

  res.json({ lvr });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});