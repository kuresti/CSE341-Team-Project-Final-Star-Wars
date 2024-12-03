/* ******************************
 * Required Resources
 * ******************************/
const express = require('express');
const router = require('express').Router();

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

module.exports = router;
