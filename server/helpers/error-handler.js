module.exports = errorHandler;

function errorHandler(err, req, res) {
  if (typeof (err) === 'string') {
    // custom application error
    return res.status(400).json({ message: err });
  }

  if (err.name === 'ValidationError') {
    // mongoose validation error
    return res.status(400).json({ message: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    // jwt authentication error
    return res.status(401).json({ message: 'Invalid Token' });
  }

  if (err.name === 'User not found with id ') {
    // jwt authentication error
    return res.status(404).json({ message: 'Invalid Id' });
  }

  // default to 500 server error
  return res.status(500).json({ message: err.message });
}
