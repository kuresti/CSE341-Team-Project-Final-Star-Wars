const validator = require('express-validator');

const characterRules = [
  validator
    .body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Character name is required'),
  validator
    .body('alignment')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Character alignment is required'),
  validator
    .body('category')
    .isArray({ min: 1 })
    .withMessage('Character category is required and must be an array'),
  validator
    .body('category.*')
    .isString()
    .withMessage('Character category value must be a string')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Character category value cannot be empty'),
  validator
    .body('homeworld')
    .isString()
    .withMessage('Character homeworld must be a string')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Character homeworld is required'),
  validator
    .body('vehicles')
    .isArray({ min: 0 })
    .withMessage('Character vehicles must be an array of strings'),
  validator
    .body('vehicles.*')
    .isString()
    .withMessage('Character vehicle value must be a string')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Character vehicle value cannot be empty'),
  validator
    .body('ships')
    .isArray({ min: 0 })
    .withMessage('Character ships must be an array of strings'),
  validator
    .body('ships.*')
    .isString()
    .withMessage('Character ship value must be a string')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Character ship value cannot be empty')
];

function validateCharacter(req, res, next) {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array().map((x) => x.msg);
    return res.status(400).json({ errors: err });
  }
  next();
}

module.exports = { characterRules, validateCharacter };
