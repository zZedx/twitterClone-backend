const jwt = require('jsonwebtoken')
const catchAsync = require('./catchAsync');
const User = require('../models/user');

const isLoggedIn = catchAsync(async (req, res, next) => {
    console.log(req.cookies)
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = isLoggedIn