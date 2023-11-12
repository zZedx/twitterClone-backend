const express = require("express");
const router = express.Router();

const catchAsync = require("../middlewares/catchAsync");
const { registerUser, loginUser } = require("../controllers/users");

router.post("/register", catchAsync(registerUser));
router.post("/login", catchAsync(loginUser));

module.exports = router;
