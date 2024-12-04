/* ******************************
 * Required Resources
 * ******************************/
const express = require('express');
const router = express.Router();

/* ******************************
 * Routes
 * ******************************/

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

module.exports = router;
