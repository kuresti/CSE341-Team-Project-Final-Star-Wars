/* ******************************
 * Required assets
 * ******************************/
const express = require('express');
const app = express();
const env = require('dotenv');
const cors = require('cors');
const mongodb = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;

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
  .use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use('/', require('./routes/index'));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', (req, res) => {
  res.send(
    req.session.user !== undefined
      ? `Logged in as ${req.session.user.displayName}`
      : 'Logged Out'
  );
});

app.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: false
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

/* *******************************
 * Error Handler Middleware
 * *******************************/
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';
  res.status(err.statusCode).json(`${err.statusCode}: ${err.message}`);
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
