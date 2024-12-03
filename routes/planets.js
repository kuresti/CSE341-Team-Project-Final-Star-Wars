/* ******************************
 * Required Resources
 * ******************************/
const express = require('express');
const router = require('express').Router();
const planetsController = require('../controllers/planets');

router.get('/', planetsController.getAllPlanets);

router.get('/:id', planetsController.getPlanet);

router.post('/', planetsController);

router.put('/:id', planetsController);

router.delete('/:id', planetsController);

module.exports = router;
