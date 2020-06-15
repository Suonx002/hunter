const { check } = require('express-validator');

const checkRegister = [
  check('name').isEmpty().withMessage('Name must not be empty'),
  check('email').isEmpty().withMessage('Email must not be empty'),
  check('password').isEmpty().withMessage('Password must not be empty'),
  check('passwordConfirm')
    .isEmpty()
    .withMessage('Password confirm must not be empty'),
  check('email').isEmail().withMessage('Email is not valid'),
  check('password')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters'),
  check('passwordConfirm')
    .isLength({ min: 5 })
    .withMessage('Password confirm must be at least 5 characters'),
];

const checkLogin = [
  check('email').isEmpty().withMessage('Email must not be empty'),
  check('password').isEmpty().withMessage('Password must not be empty'),
];

module.exports = {
  checkRegister,
  checkLogin,
};
