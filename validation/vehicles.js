/* **********************************
 * Required Resources
 * **********************************/
const { body, validationResult } = require('express-validator');

const validate = {};

/* ************************************
 * Vehicles Validation Rules
 * ************************************/
validate.vehiclesRules = () => {
  return [
    body('name')
      .isString()
      .withMessage('Name must be a string.')
      .notEmpty()
      .withMessage('Name is required.'),

    body('model')
      .isString()
      .withMessage('Model must be a string.')
      .notEmpty()
      .withMessage('Model is required.'),

    body('manufacturer')
      .isString()
      .withMessage('Manufacturer must be a string.')
      .notEmpty()
      .withMessage('Manufacturer is required.'),

    body('cost_in_credits')
      .isInt({ gt: 0 })
      .withMessage('cost_in_credits must be a positive integer.')
      .notEmpty()
      .withMessage('cost_in_credits is required.'),

    body('length')
      .isInt({ gt: 0 })
      .withMessage('Length must a positive integer')
      .notEmpty()
      .withMessage('Length is required'),

    body('max_atmosphering_speed')
      .isInt({ gt: 0 })
      .withMessage('max_atmosphering_speed must be a positive integer.')
      .notEmpty()
      .withMessage('max_atmosphering_speed is required.'),

    body('crew')
      .isInt({ gt: 0 })
      .withMessage('Crew must be a positive integer.')
      .notEmpty()
      .withMessage('Crew is required.'),

    body('cargo_capacity')
      .isInt({ gt: 0 })
      .withMessage('cargo_capacity must be a positive integer.')
      .notEmpty()
      .withMessage('cargo_capacity is required.'),

    body('vehicle_class')
      .isString()
      .withMessage('vehicle_class must be a string.')
      .notEmpty()
      .withMessage('vehicle_class is required.')
  ];
};

/* *****************************
 * Vehicles Validation
 * *****************************/
validate.validateVehicles = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors
  });
};

module.exports = validate;
