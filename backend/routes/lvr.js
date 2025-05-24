const express = require('express');
const router = express.Router();
const validateLvrInput = require('../middleware/validateLvrInput');
const calculateLvr = require('../utils/lvr');

router.post('/lvr', validateLvrInput, (req, res) => {
  const {
    loanAmount,
    cashOutAmount = 0,
    estimatedPropertyValue,
    propertyValuationPhysical
  } = req.body;

  try {
    const lvr = calculateLvr({ loanAmount, cashOutAmount, estimatedPropertyValue, propertyValuationPhysical });
    res.json({ lvr });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 