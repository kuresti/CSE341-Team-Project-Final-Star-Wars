const express = require('express');
const router = express.Router();
const shipController = require('../controllers/ships');
// const { shipValidationRules, validate } = require('../middleware/validate');
// const { handleErrors } = require('../middleware/error-handling');
// const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', shipController.getAll);

router.get('/search', shipController.getListBySearch);

router.get('/:id', shipController.getSingle);

router.post('/', shipController.addShip);

router.put('/:id', shipController.updateShip);

router.delete('/:id', shipController.deleteShip);

// router.use(handleErrors);

module.exports = router;
