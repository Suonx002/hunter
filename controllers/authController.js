const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const authValidator = require('../validators/authValidator');

const db = require('../db/db');
const tableNames = require('../db/tableNames');

const signJwtToken = (email) => {
  const payload = { email };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  return token;
};

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

  const token = signJwtToken(email);

  res.status(200).json({
    status: 'success',
    token,
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

  const token = signJwtToken(email);

  res.status(200).json({
    status: 'success',
    token,
    data: user,
  });
});

const protectRoute = catchAsync(async (req, res, next) => {
  let token;

  // getting token and check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Please log in to get access', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await db(tableNames.users)
    .where({
      email: decoded.email,
    })
    .select('email');

  if (currentUser.length === 0) {
    return next(
      new AppError('The token belonging to this user is no longer exist', 401)
    );
  }

  req.user = currentUser[0];

  next();
});

module.exports = {
  register,
  login,
  protectRoute,
};
