const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

module.exports.registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ username, password, email });
    await user.save();
    const token = signToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    res.json();
  } catch (e) {
    if (e.code === 11000) {
      const valueError = Object.keys(e.keyValue)[0];
      throw new Error(`${valueError} already exists`);
    }
    throw new Error(e.message);
  }
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = signToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    res.json();
  } else {
    throw new Error("Incorrect Email or Password");
  }
  res.json();
};

module.exports.getUser = async (req, res) => {
  res.json(req.user);
};

module.exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json();
};
