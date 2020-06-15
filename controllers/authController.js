const { validationResult } = require('express-validator');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const authValidator = require('../validators/authValidator');

const db = require('../db/db');
const tableNames = require('../db/tableNames');

const register = catchAsync(async (req, res, next) => {
  // check for body validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  const { name, email, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    return next(new AppError('Password does not match', 400));
  }

  const hashPassword = await authValidator.hashPassword(password);

  const [createUser] = await db(tableNames.users)
    .insert({
      name,
      email,
      password: hashPassword,
    })
    .returning('*');

  res.status(200).json({
    status: 'success',
    data: createUser,
  });
});

const login = catchAsync(async (req, res, next) => {
  // check for body validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  const user = await db(tableNames.users).where({ email }).select('*');

  if (user.length === 0) {
    return next(new AppError('Email or password is incorrect.', 400));
  }

  if (!(await authValidator.comparePassword(password, user[0].password))) {
    return next(new AppError('Email or password is incorrect.', 400));
  }

  // hide password
  user[0].password = undefined;

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

module.exports = {
  register,
  login,
};
