/* **********************************
 * Required Resources
 * **********************************/
const { body, validationResult } = require('express-validator');

/* ************************************
 * Ship Validation Rules
 * ************************************/
const shipValidationRules = () => {
  return [
    body('name').trim().notEmpty().withMessage('Ship name is required.'),
    body('model').trim().notEmpty().withMessage('Ship model is required.'),
    body('length')
      .optional()
      .trim()
      .isNumeric()
      .withMessage('Length must be numeric.')
      .bail()
      .isFloat({ gt: 0 })
      .withMessage('Length must be greater than 0.')
      .toFloat(),
    body('crew').trim().notEmpty().withMessage('Crew is required.'),
    body('passengers').trim().notEmpty().withMessage('Passengers is required.'),
    body('cargo_capacity')
      .optional()
      .trim()
      .isNumeric()
      .withMessage('Cargo capacity must be numeric.')
      .bail()
      .isFloat({ min: 0 })
      .withMessage('Cargo capacity must be greater than or equal to zero.')
      .toFloat(),
    body('starship_class')
      .trim()
      .notEmpty()
      .withMessage('Starship Class is required.'),
    body('hyperdrive_rating')
      .optional()
      .trim()
      .isNumeric()
      .withMessage('Hyperdrive Rating must be numeric.')
      .bail()
      .isFloat({ min: 0 })
      .withMessage('Hyperdrive Rating must be greater than or equal to zero.')
      .toFloat()
  ];
};
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors
  });
};

module.exports = {
  shipValidationRules,
  validate
};
