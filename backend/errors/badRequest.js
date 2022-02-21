const {StatusCodes} = require('http-status-codes')
const CustomApiError = require('./customApi')

class BadRequestError extends CustomApiError {
    constructor(msg) {
        super(msg)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

module.exports = BadRequestError