/* *******************************
 * Middleware for handling errors
 * wrap route functions in this for
 * general error handling
 * *******************************/
const handleErrors = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { handleErrors };
