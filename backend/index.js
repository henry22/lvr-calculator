const express = require('express');
const app = express();
const loggingMiddleware = require('./middleware/logging');
const cors = require("cors");

app.use(express.json());
app.use(loggingMiddleware);
app.use(cors());

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

  // Inline validation (you can later refactor into a separate middleware or use a library)
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

  const borrowingAmount = loanAmount + cashOutAmount;
  const propertyValue = (typeof propertyValuationPhysical === 'number') ? propertyValuationPhysical : estimatedPropertyValue;

  if (propertyValue === 0) {
    return res.status(400).json({ error: "Property value cannot be zero." });
  }

  const lvr = borrowingAmount / propertyValue;

  res.json({ lvr });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;