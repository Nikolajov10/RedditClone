const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError , UnauthenticatedError } = require('../errors')

const login = async (req,res) => {
    const {name , password } = req.body
    if (!name || !password) {
        throw new BadRequestError("Please provide name and password")
    }
    const user = await User.findOne({name})
    console.log(user.methods);
    if (!user) {
        throw new UnauthenticatedError(`No user with ${name} name`)
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid passwrod')
    }
    const token  = user.createJWT()
    return res.status(StatusCodes.OK).json({
        user : {
            name:user.name
        },
        token
    })
};

const register = async (req,res) => {
    const user = await User.create({...req.body})
    const token = user.createJWT();
    return res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
};

module.exports = {
    login,
    register
};