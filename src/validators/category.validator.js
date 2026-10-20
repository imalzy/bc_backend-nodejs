
const { body } = require('express-validator');

const validateCategory = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required'),

    body('description')
        .optional({ nullable: true })
        .isString()
        .withMessage('Description must be a string')
];

const validateUpdateCategory = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Category name is required'),

    body('description')
        .optional({ nullable: true })
        .isString()
        .withMessage('Description must be a string')
];

module.exports = {
    validateCategory,
    validateUpdateCategory
};
