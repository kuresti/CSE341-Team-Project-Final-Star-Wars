/* ******************************
 * Required Resources
 * ******************************/
const express = require('express');
const router = express.Router();
const passport = require('passport');

/* ******************************
 * Routes
 * ******************************/

/* ******************************
 * Use route for Star Wars Characters
 * ******************************/
router.use('/characters', require('./characters'));

/* ******************************
 * Use route for Star Wars Vehicles
 * ******************************/
router.use('/vehicles', require('./vehicles'));

/* ******************************
 * Use route for Star Wars Planets
 * ******************************/
router.use('/planets', require('./planets'));

/* ******************************
 * Use route for Star Wars Ships
 * ******************************/
router.use('/ships', require('./ships'));

/* ******************************
 * Login using GitHub OAuth
 * ******************************/
// eslint-disable-next-line no-unused-vars
router.get('/login', passport.authenticate('github'), (req, res) => {});

/* ******************************
 * Logout using GitHub OAuth
 * ******************************/
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
