/* **********************************
 * Required Resources
 * **********************************/
const express = require('express');
const router = express.Router();
const vehiclesCont = require('../controllers/vehicles');
const validate = require('../validation/vehicles');
const { handleErrors } = require('../middleware/error-handling');
const { isAuthenticated } = require('../middleware/authenticate');

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
  isAuthenticated,
  validate.vehiclesRules(),
  validate.validateVehicles,
  vehiclesCont.createNewVehicle
);

/* **********************************
 * PUT Routes
 * **********************************/
router.put(
  '/:id',
  isAuthenticated,
  validate.vehiclesRules(),
  validate.validateVehicles,
  vehiclesCont.updateVehicle
);

/* ************************************
 * DELETE Vehicle by ID Route
 * ************************************/
router.delete('/:id', isAuthenticated, vehiclesCont.deleteVehicle);

router.use(handleErrors);
module.exports = router;
