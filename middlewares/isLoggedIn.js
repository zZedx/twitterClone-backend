const jwt = require("jsonwebtoken");
const catchAsync = require("./catchAsync");
const User = require("../models/user");

const isLoggedIn = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const socketJwtAuth = async (socket, next) => {
  const token = socket.handshake.headers.cookie.split("=")[1];
  if (!token) {
    return next(new Error("Not authorized, no token"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new Error("Not authorized, user not found"));
    }
    socket.user = user;
    return next();
  } catch (error) {
    return next(new Error("Not authorized, token failed"));
  }
};

module.exports = isLoggedIn;
module.exports.socketJwtAuth = socketJwtAuth;
