/* ******************************
 * Required Resources
 * ******************************/
const express = require('express');
const router = require('express').Router();
const planetsController = require('../controllers/planets');
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

router.post('/', planetRules(), validatePlanet, planetsController.addPlanet);

/******************************
 * PUT Route
 ******************************/

router.put(
  '/:id',
  validateObjectId,
  planetRules(),
  validatePlanet,
  planetsController.editPlanet
);

/*****************************
 * DELETE Route
 *****************************/

router.delete('/:id', validateObjectId, planetsController.deletePlanet);

module.exports = router;
