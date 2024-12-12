/* **********************************
 * Required Resources
 * **********************************/
const express = require('express');
const router = express.Router();
const vehiclesCont = require('../controllers/vehicles');
const validate = require('../validation/vehicles');
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
router.post(
  '/',
  validate.vehiclesRules(),
  validate.validateVehicles,
  vehiclesCont.createNewVehicle
);

/* **********************************
 * PUT Routes
 * **********************************/
router.put(
  '/:id',
  validate.vehiclesRules(),
  validate.validateVehicles,
  vehiclesCont.updateVehicle
);

/* ************************************
 * DELETE Vehicle by ID Route
 * ************************************/
router.delete('/:id', vehiclesCont.deleteVehicle);

router.use(handleErrors);
module.exports = router;
