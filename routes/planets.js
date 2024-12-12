/* ******************************
 * Required Resources
 * ******************************/
const express = require('express');
const router = express.Router();
const planetsController = require('../controllers/planets');
const { isAuthenticated } = require('../middleware/authenticate');
const {
  planetRules,
  validatePlanet,
  validateObjectId
} = require('../validation/planetValidation');

/********************************
 * GET Routes
 ********************************/
router.get('/', planetsController.getAllPlanets);

router.get('/location', planetsController.getPlanetByLocation);

router.get('/:id', validateObjectId, planetsController.getPlanet);

/*******************************
 * POST Route
 *******************************/

router.post('/', isAuthenticated, planetRules(), validatePlanet, planetsController.addPlanet);

/******************************
 * PUT Route
 ******************************/

router.put(
  '/:id',
  isAuthenticated,
  validateObjectId,
  planetRules(),
  validatePlanet,
  planetsController.editPlanet
);

/*****************************
 * DELETE Route
 *****************************/

router.delete('/:id', isAuthenticated, validateObjectId, planetsController.deletePlanet);

module.exports = router;
