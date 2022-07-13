const errorHandler = require("../Utils/errorHandler");

module.exports = (err, req, resp, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //wrong mongodb Id error (cast error)

  if (err.name === "CastError") {
    const message = `Resource not Found. Invalid:${err.path}`;
    err = new errorHandler(message, 400);
  }

  //mongoose duplicate key error

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new errorHandler(message, 400);
  }

  //Wrong JWT error

  if (err.name === "JSONWebTokenError") {
    const message = `JSON Web Token is invalid,try again`;
    err = new errorHandler(message, 400);
  }

  //JWT EXPIRE Error
  if (err.name === "TokenExpiredError") {
    const message = `JSON Web Token is Expired,try again`;
    err = new errorHandler(message, 400);
  }

  resp.status(err.statusCode).json({
    success: false,
    // error:err.stack,

    message: err.message,
  });
};
