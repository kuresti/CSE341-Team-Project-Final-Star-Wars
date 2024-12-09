/* ******************************
 * Required assets
 * ******************************/
const express = require('express');
const app = express();
const env = require('dotenv');
const cors = require('cors');
const mongodb = require('./config/db');

// Listen for unhandled promise rejections and throw an error to ensure they are caught during development.
process.on('unhandledRejection', (error) => {
  throw error;
});

// Listen for uncaught exceptions and log the error details.
process.on('uncaughtException', (error) => {
  console.log(error);
});

/* *******************************
 * DotEnv configuration
 * *******************************/
env.config();

/* *******************************
 * Swagger
 * *******************************/
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* *******************************
 * Routes
 * *******************************/
app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/', require('./routes/index'));

/* *******************************
 * Error Handler Middleware
 * *******************************/
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';
  res.status(err.statusCode).json({});
});

/* ********************************
 * Port Server is listening to
 * ********************************/
const port = process.env.PORT || 3000;

/**
 * Mongodb initialization
 */
(async () => {
  await mongodb.initDb((err) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(port, () => {
        console.log(`Database is listening and node running on port ${port}`);
      });
    }
  });
})();

module.exports = app;
