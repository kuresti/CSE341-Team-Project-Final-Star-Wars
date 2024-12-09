const express = require('express');
const router = express.Router();
const shipController = require('../controllers/ships');
const { handleErrors } = require('../middleware/error-handling');
const { isAuthenticated } = require('../middleware/authenticate');

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
router.post('/', isAuthenticated, shipController.addShip);

/* ******************************
 * Update a ship by id
 * ******************************/
router.put('/:id', isAuthenticated, shipController.updateShip);

/* ******************************
 * Delete a ship by id
 * ******************************/
router.delete('/:id', isAuthenticated, shipController.deleteShip);

router.use(handleErrors);

module.exports = router;
