const handleDuplicateKey = (error) => {
  error.message = 'Email is taken, please use a different one';
  error.statusCode = 400;
};

module.exports = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (error.code === '23505') handleDuplicateKey(error);

  res.status(error.statusCode || 500).json({
    status: 'fail',
    message: error.message || 'Server Error :(',
    error: error,
  });
};
