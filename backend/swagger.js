const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LVR Calculator API',
      version: '1.0.0',
      description: 'API for calculating Loan-to-Value Ratio (LVR) for loan applications.'
    },
    servers: [
      { url: 'http://localhost:3001' }
    ],
  },
  apis: ['./routes/*.js'], // Scan route files for JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
