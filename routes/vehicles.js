/* **********************************
 * Required Resources
 * **********************************/
const express = require('express');
const router = express.Router();
const vehiclesCont = require('../controllers/vehicles');
const { handleErrors } = require('../middleware/error-handling');

/* **********************************
 * GET Routes
 * **********************************/
router.get('/', vehiclesCont.getAll);

router.get('/search', vehiclesCont.getVehicleByAttribute);

router.get('/:id', vehiclesCont.getSingle);

/* **********************************
 * POST Routes
 * **********************************/
router.post('/', vehiclesCont.createNewVehicle);

/* **********************************
 * PUT Routes
 * **********************************/
router.put('/:id', vehiclesCont.updateVehicle);

/* ************************************
 * DELETE Vehicle by ID Route
 * ************************************/
router.delete('/', vehiclesCont.deleteVehicle);

router.use(handleErrors);
module.exports = router;
