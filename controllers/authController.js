const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const db = require('../db/db');
const tableNames = require('../db/tableNames');

const register = catchAsync(async (req, res, next) => {
  const [createUser] = await db(tableNames.users)
    .insert(req.body)
    .returning('*');

  res.status(200).json({
    status: 'success',
    data: createUser,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await db(tableNames.users).where({ email, password });

  if (user.length === 0) {
    return next(new AppError('Email or password is incorrect.', 400));
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

module.exports = {
  register,
  login,
};
