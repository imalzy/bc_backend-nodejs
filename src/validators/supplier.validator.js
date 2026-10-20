
const { body } = require('express-validator');

const validateSupplier = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Supplier name is required'),

  body('phone')
    .optional({ nullable: true })
    .isString()
    .withMessage('Phone must be a string'),

  body('email')
    .optional({ nullable: true })
    .trim()
    .isEmail()
    .withMessage('Invalid email address'),

  body('address')
    .optional({ nullable: true })
    .isString()
    .withMessage('Address must be a string')
];

const validateUpdateSupplier = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Supplier name cannot be empty'),

  body('phone')
    .optional({ nullable: true })
    .isString()
    .withMessage('Phone must be a string'),

  body('email')
    .optional({ nullable: true })
    .trim()
    .isEmail()
    .withMessage('Invalid email address'),

  body('address')
    .optional({ nullable: true })
    .isString()
    .withMessage('Address must be a string')
];

module.exports = {
  validateSupplier,
  validateUpdateSupplier
};
