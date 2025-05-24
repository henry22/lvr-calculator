const express = require('express');
const router = express.Router();
const validateLvrInput = require('../middleware/validateLvrInput');
const calculateLvr = require('../utils/lvr');

/**
 * @swagger
 * /api/lvr:
 *   post:
 *     summary: Calculate Loan-to-Value Ratio (LVR)
 *     description: Calculates the LVR for a loan application.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loanAmount:
 *                 type: number
 *                 example: 200000
 *               cashOutAmount:
 *                 type: number
 *                 example: 50000
 *               estimatedPropertyValue:
 *                 type: number
 *                 example: 400000
 *               propertyValuationPhysical:
 *                 type: number
 *                 example: 380000
 *     responses:
 *       200:
 *         description: LVR calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lvr:
 *                   type: number
 *                   example: 0.75
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

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

/**
 * @swagger
 * /api/example:
 *   get:
 *     summary: Get an example loan application
 *     responses:
 *       200:
 *         description: Example loan application
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loanAmount:
 *                   type: number
 *                 cashOutAmount:
 *                   type: number
 *                 estimatedPropertyValue:
 *                   type: number
 *                 propertyValuationPhysical:
 *                   type: number
 */
router.get('/example', (req, res) => {
  res.json({
    loanAmount: 200000,
    cashOutAmount: 50000,
    estimatedPropertyValue: 400000,
    propertyValuationPhysical: 380000
  });
});

module.exports = router;