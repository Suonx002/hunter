const { check } = require('express-validator');
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  // salt with 12
  return await bcrypt.hash(password, 12);
};
const comparePassword = async (password, databasePassword) => {
  return await bcrypt.compare(password, databasePassword);
};

const checkRegister = [
  check('name').notEmpty().withMessage('Name must not be empty'),
  check('email').notEmpty().withMessage('Email must not be empty'),
  check('email').isEmail().withMessage('Email is not valid'),
  check('password')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters'),
  check('passwordConfirm')
    .isLength({ min: 5 })
    .withMessage('Password confirm must be at least 5 characters'),
];

const checkLogin = [
  check('email').notEmpty().withMessage('Email must not be empty'),
  check('password').notEmpty().withMessage('Password must not be empty'),
];

module.exports = {
  hashPassword,
  comparePassword,
  checkRegister,
  checkLogin,
};
