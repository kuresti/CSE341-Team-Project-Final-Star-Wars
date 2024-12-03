/* ******************************
 * Required assets
 * ******************************/
const express = require('express');
const app = express();
const env = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
// const swaggerDoc = require('./swagger-output.json');
const YAML = require("yamljs")
const swaggerDoc = YAML.load("./swagger.yaml");

/* *******************************
 * DotEnv configuration
 * *******************************/
env.config();

/* *******************************
 * Swagger Configuration
 * *******************************/
console.log(swaggerDoc)
if (process.env.NODE_ENV !== 'development') {
  // remove development server
  swaggerDoc.servers.splice(0, 1);
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

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

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
