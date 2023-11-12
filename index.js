require('dotenv').config()

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')

const User = require("./models/user");
const catchAsync = require("./middlewares/catchAsync");

mongoose
  .connect("mongodb://127.0.0.1:27017/twitter")
  .then(() => {
    console.log("Mongoose Running");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY
  })
}

app.post("/register", catchAsync(async (req, res) => {
  try {
    const { username, password , email} = req.body;
    const user = new User({ username, password , email});
    await user.save();
    const token = signToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });
    res.json();
  } catch (e) {
    if (e.code === 11000) {
      const valueError = Object.keys(e.keyValue)[0]
      throw new Error(`${valueError} already exists`)
    }
    throw new Error(e.message)
}
}));

app.post("/login", catchAsync(async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = signToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        res.json();
    } else {
        throw new Error("Incorrect Email or Password")
    }
  res.json();
}));

app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(status).json({ err, message: err.message })
  })

app.listen(3000, () => {
  console.log("Listening");
});
