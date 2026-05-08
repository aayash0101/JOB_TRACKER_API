import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js'

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign(
        { id: user._id},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN}
    );
    res.status(statusCode).json({ success: true, token })
};

const register = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;

    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error('Email already registered')
    }

    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
});

const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error('Please provide Email and Password')
    }

    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.comparePassword(password))) {
        res.status(400);
        throw new Error('Invalid Credentials')
    }
    sendTokenResponse(user, 200, res);
});

const me = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    res.json({ success: true, user});
});

export {register, login, me};