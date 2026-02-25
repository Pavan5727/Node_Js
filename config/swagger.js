const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node API Documentation',
      version: '1.0.0',
      description: 'API documentation for Node + Express + MongoDB'
    },
    servers: [
      {
        url: 'http://localhost:5000'
      }
    ]
  },
  apis: ['./routes/*.js'] // where swagger will look for API comments
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;