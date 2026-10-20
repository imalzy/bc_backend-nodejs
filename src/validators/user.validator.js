const {body} = require("express-validator");

const validateRegistration = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('email is required'),
    body('password').isLength({min: 6}).withMessage('password must be at least 6 characters long')
]

const validateUpdateProfile = [
    body('name').optional().trim().notEmpty().withMessage('Name is required'),
    body('email').optional().trim().isEmail().withMessage('Email is required')
]

module.exports ={
    validateRegistration,
    validateUpdateProfile
}