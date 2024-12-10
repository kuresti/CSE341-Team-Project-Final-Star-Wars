/* **********************************
 * Required Resources
 * **********************************/
const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characters');
const { handleErrors } = require('../middleware/error-handling');

/* **********************************
 * GET Routes
 * **********************************/
router.get('/', characterController.getAll);
router.get('/findByAlignment', characterController.findByAlignment);
router.get('/findByCategory', characterController.findByCategory);
router.get('/findByName', characterController.findByName);
router.get(
  '/:id',
  characterController.isValidObjectId,
  characterController.getById
);

/* **********************************
 * POST Routes
 * **********************************/
router.post('/', characterController.createCharacter);

/* **********************************
 * PUT Routes
 * **********************************/
router.put(
  '/:id',
  characterController.isValidObjectId,
  characterController.updateCharacter
);

/* ************************************
 * DELETE Vehicle by ID Route
 * ************************************/
router.delete(
  '/:id',
  characterController.isValidObjectId,
  characterController.deleteCharacter
);

router.use(handleErrors);

module.exports = router;