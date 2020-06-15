module.exports = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  res.status(error.statusCode || 500).json({
    status: 'fail',
    message: error.message || 'Server Error :(',
  });
};
