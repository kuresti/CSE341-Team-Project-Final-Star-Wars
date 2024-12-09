const { body, validationResult } = require('express-validator');

const shipValidationRules = () => {
  return [
    body('name')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Ship name is required.'),
    body('model')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Ship model is required.'),
    body('length')
      .optional()
      .trim()
      .isNumeric()
      .withMessage('Length must be numeric.')
      .bail()
      .custom((value) => value > 0)
      .withMessage('Length must be greater than 0.'),
    body('crew').trim().escape().notEmpty().withMessage('Crew is required.'),
    body('passengers')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Passengers is required.'),
    body('cargo_capacity')
      .optional()
      .trim()
      .isNumeric()
      .withMessage('Cargo capacity must be numeric.')
      .bail()
      .isFloat({ min: 0 })
      .withMessage('Cargo capacity must be greater than or equal to zero.'),
    body('starship_class')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Starship Class is required.'),
    body('hyperdrive-rating')
      .optional()
      .trim()
      .isNumeric()
      .withMessage('Hyperdrive Rating must be numeric.')
      .bail()
      .isFloat({ min: 0 })
      .withMessage('Hyperdrive Rating must be greater than or equal to zero.')
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
