const express = require('express');
const router = express.Router();
const shipController = require('../controllers/ships');

/* ******************************
 * Return an array of all the ships
 * ******************************/
router.get('/', shipController.getAll);

/* ******************************
 * Return an array of all the ships where the search string exists in the given parameter
 * Can search by name and/or starship_class
 * If both searches are null it will return all ships
 * ******************************/
router.get('/search', shipController.getListBySearch);

/* ******************************
 * Return a single ship by id
 * ******************************/
router.get('/:id', shipController.getSingle);

/* ******************************
 * Add a ship to the collection
 * ******************************/
router.post('/', shipController.addShip);

/* ******************************
 * Update a ship by id
 * ******************************/
router.put('/:id', shipController.updateShip);

/* ******************************
 * Delete a ship by id
 * ******************************/
router.delete('/:id', shipController.deleteShip);

module.exports = router;
