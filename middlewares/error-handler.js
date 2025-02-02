// const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { object } = require('joi');

const errorHandlerMiddleware = (err, req, res, next) => {
   
  //For better user friendly response on error
  let customError = {
    //Set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later'
  };
  
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  
  //dublicate error
  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value enter for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = 400;
  }

  // Validation error
  if (err.name === 'ValidationError') {
    customError.message = Object.keys(err.errors.map((err) => err.message).join(','));
    customError.statusCode = 400;
  }

  if (err.name === 'CastError') {
    customError.message = `Bot item find with id: ${err.value}`;
    customError.statusCode = 404;
  }

  // Cast  error

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.message })
}

module.exports = errorHandlerMiddleware
