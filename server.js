const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: './config.env' });

const app = express();
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 400));
});

// Global express handling errors middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => `Server is currently running on port: ${PORT}`);
