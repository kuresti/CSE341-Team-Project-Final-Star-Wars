/* ******************************
 * Required Resources
 * ******************************/
const express = require('express');
const router = require('express').Router();

/* ******************************
 * Routes
 * ******************************/


/* ******************************
 * Use route for Star Wars Characters
 * ******************************/
router.use("/characters", require("./characterRoute"));


/* ******************************
 * Use route for Star Wars Vehicles
 * ******************************/
// router.use('/vehicles', require('./vehicles'));

module.exports = router;