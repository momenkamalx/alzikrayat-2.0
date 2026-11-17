const multer = require('multer');

// 404 for any route that doesn't exist
const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// One place that turns every error into clean JSON
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Server error';

  if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'File must be under 8MB' : err.message;
  } else if (err.name === 'ValidationError') {
    status = 400; // Mongoose validation
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.name === 'CastError') {
    status = 400; // bad ObjectId
    message = 'Invalid id';
  } else if (err.code === 11000) {
    status = 409; // duplicate key (email)
    message = 'That value already exists';
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Invalid or expired token';
  }

  if (status === 500) console.error(err);
  res.status(status).json({ success: false, message });
};

module.exports = { notFound, errorHandler };
