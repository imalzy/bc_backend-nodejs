
const { body } = require('express-validator');

const validateProduct = [
    body('code')
        .trim()
        .notEmpty()
        .withMessage('Product code is required'),

    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required'),

    body('category_id')
        .notEmpty()
        .withMessage('Category is required'),

    body('supplier_id')
        .notEmpty()
        .withMessage('Supplier is required'),

    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a non-negative number'),

    body('stock')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer')
];

const validateUpdateProduct = [
    body('code')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Product code cannot be empty'),

    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Product name cannot be empty'),

    body('category_id')
        .optional()
        .notEmpty()
        .withMessage('Category cannot be empty'),

    body('supplier_id')
        .optional()
        .notEmpty()
        .withMessage('Supplier cannot be empty'),

    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a non-negative number'),

    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer')
];

module.exports = {
    validateProduct,
    validateUpdateProduct
};
