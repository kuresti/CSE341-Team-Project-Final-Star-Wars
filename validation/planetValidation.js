const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

function planetRules() {
  return [
    body('name').trim().escape().notEmpty().isLength({ min: 1 }),
    body('is_inhabited')
      .isBoolean()
      .withMessage('The field must be a boolean value'),
    body('climate').trim().escape().notEmpty().isLength({ min: 1 }),
    body('terrain').trim().escape().notEmpty().isLength({ min: 1 }),
    body('diameter')
      .isNumeric()
      .withMessage('The field must be a numeric value.')
      .custom((value) => {
        if (Number(value) <= 0) {
          throw new Error('planets must have a positive diameter value.');
        }
        return true;
      }),
    body('rotation_period')
      .isNumeric()
      .withMessage('The field must be a numeric value.')
      .custom((value) => {
        if (Number(value) <= 0) {
          throw new Error('Planet must have a positive rotation period');
        }
        return true;
      }),
    body('orbital_period')
      .isNumeric()
      .withMessage('The field must be a numeric value.')
      .custom((value) => {
        if (Number(value) <= 0) {
          throw new Error('Planets must have a positive orbital period');
        }
        return true;
      }),
    body('location').trim().escape().notEmpty().isLength({ min: 1 })
  ];
}

function validatePlanet(req, res, next) {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
};

module.exports = { planetRules, validatePlanet, validateObjectId };
