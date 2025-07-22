const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0', // Swagger version
    info: {
      title: ' API Docs',
      version: '1.0.0',
      description: 'API documentation for clone project',
    },
     components: {
      securitySchemes: {
        bearerAuth: {   
          type: 'http',
          scheme: 'Bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js'], // path to your route files with Swagger comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec
};
