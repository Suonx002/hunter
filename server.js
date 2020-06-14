const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: './config.env' });

const userRouter = require('./routes/userRouter');

const app = express();

// middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// routes
app.use('/api/v1/users', userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => `Server is currently running on port: ${PORT}`);
