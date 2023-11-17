const isProduction = process.env.NODE_ENV === "production";

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { cloudinary } = require("../cloudinary");

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
      secure: true,
      sameSite: "None",
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
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    res.json();
  } else {
    throw new Error("Incorrect Email or Password");
  }
};

module.exports.getUser = async (req, res) => {
  res.json(req.user);
};

module.exports.updateUser = async (req, res) => {
  const { user } = req;
  const { displayName, bio } = req.body;
  if (displayName) {
    user.displayName = displayName;
  }
  if (bio) {
    user.bio = bio;
  }
  if (req.files) {
    if (req.files.avatar) {
      if(user.avatarName !== "default_pfp"){
        cloudinary.uploader.destroy(user.avatarName);
      }
      user.avatar = req.files.avatar[0].path;
      user.avatarName = req.files.avatar[0].filename;
    }
    if (req.files.coverImage) {
      cloudinary.uploader.destroy(user.coverImageName);
      user.coverImage = req.files.coverImage[0].path;
      user.coverImageName = req.files.coverImage[0].filename;
    }
  }
  await user.save();
  res.json();
}

const clearCookieAsync = async (res) => {
  return new Promise((resolve, reject) => {
    res.clearCookie("token", {
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    });
    resolve();
  });
};

module.exports.logoutUser = async(req, res) => {
  await clearCookieAsync(res);
  res.json();
};

module.exports.getUserProfile = async(req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username }).populate("posts");
  if (!user) {
    throw new Error("User not found");
  }
  res.json(user);
}
