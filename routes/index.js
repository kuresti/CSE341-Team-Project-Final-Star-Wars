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
router.use('/vehicles', require('./vehicles.js'));
