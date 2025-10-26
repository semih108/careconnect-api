const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CareConnect API',
            version: '1.0.0',
            description: 'API-Dokumentation für CareConnect',
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Lokaler Dev Server',
            },
        ],
    },
    apis: ['./routes/*.js'], // Pfad zu den Routen für die Swagger-Kommentare
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
