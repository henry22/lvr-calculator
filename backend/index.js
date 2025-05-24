const express = require('express');
const app = express();
const loggingMiddleware = require('./middleware/logging');
const cors = require("cors");
const validateLvrInput = require('./middleware/validateLvrInput');
const calculateLvr = require('./utils/lvr');
const lvrRouter = require('./routes/lvr');

app.use(express.json());
app.use(loggingMiddleware);
app.use(cors());

app.use('/api', lvrRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;