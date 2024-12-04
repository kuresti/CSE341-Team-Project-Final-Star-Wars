/* ******************************
 * Required assets
 * ******************************/
const express = require('express');
const app = express();
const env = require('dotenv');
const cors = require('cors');
const mongodb = require('./config/db');

/* *******************************
 * DotEnv configuration
 * *******************************/
env.config();

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
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node running on port ${port}`);
    });
  }
});
