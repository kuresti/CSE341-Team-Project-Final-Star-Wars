/* **********************************
 * Required Resources
 * **********************************/
const express = require('express');
const router = express.Router();
const vehiclesCont = require('../controllers/vehicles');


/* **********************************
 * GET Routes
 * **********************************/
router.get('/', vehiclesCont.getAll);

router.get('/:id', vehiclesCont.getSingle);

/* **********************************
 * POST Routes
 * **********************************/
router.post(
    '/',
    vehiclesCont.createNewVehicle
)

/* *******************************
 * PUT Routes
 * *******************************/
router.put('/:id', 
    
    vehiclesCont.updateVehicle
)