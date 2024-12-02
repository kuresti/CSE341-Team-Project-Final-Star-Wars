/* ******************************
 * Required assets
 * ******************************/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const env = require('dotenv');
const cors = require('cors');

/* *******************************
 * DotEnv configuration
 * *******************************/
env.config()

/* *******************************
 * Routes
 * *******************************/
app.use(bodyParser.json());
// Allow headers across sites
app.use((req, res, next) => {
    res.setHeader(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Z-key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})
app.use(cors({ methods: ['GET, POST, PUT, DELETE, OPTIONS']}));
app.use(cors({ origin: '*'}));
app.use('/', require('./routes/index'));


/* *******************************
 * Error Handler Middleware
 * *******************************/
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    res.status(err.statusCode).json({
    });
});

/* ********************************
 * Port Server is listening to
 * ********************************/
const port = process.env.PORT || 3000;

