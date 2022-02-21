const CustomAPIError = require('./customApi')
const UnauthenticatedError = require('./unauthenticated')
const NotFoundError = require('./notFoundError')
const BadRequestError = require('./badRequest')

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
}