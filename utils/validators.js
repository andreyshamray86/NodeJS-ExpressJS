const {
    body
} = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
    body('email').isEmail().withMessage('Enter the valid email').custom(async (value, {
        req
    }) => {
        try {
            const user = User.findOne({
                email: value
            });
            if (user) {
                return Promise.reject('User with this email already exist');
            }
        } catch (e) {
            console.log(e);
        }
    }).normalizeEmail(),
    body('password', 'Password must be numeric, min 6 symbols, max 56').isLength({
        min: 6,
        max: 56
    }).isAlphanumeric()
    .trim(),
    body('confirm').custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw Error('Passwords are not the same');
        }
        return true;
    }).trim(),
    body('name').isLength({
        min: 3
    }).withMessage('The name must be more than 3 symbols').trim()
]

exports.courseValidators = [
    body('title').isLength({
        min: 3
    }).withMessage('The min length of the title must be 3 symbols').trim(),
    body('price').isNumeric().withMessage('Enter the correct price'),
    body('img', 'Enter the valid image URL').isURL()
]