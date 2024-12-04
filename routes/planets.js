/* ******************************
 * Required Resources
 * ******************************/
const express = require('express');
const router = require('express').Router();
const planetsController = require('../controllers/planets');

router.get('/', planetsController.getAllPlanets);

router.get('/:id', planetsController.getPlanet);

router.get('/location', planetsController.getPlanetByLocation);

router.post('/', planetsController.addPlanet);

router.put('/:id', planetsController.editPlanet);

router.delete('/:id', planetsController.deletePlanet);

module.exports = router;
