const express = require("express");
const router = express.Router();

const catchAsync = require("../middlewares/catchAsync");
const { registerUser, loginUser, getUser, logoutUser, getUserProfile } = require("../controllers/users");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.post("/register", catchAsync(registerUser));
router.post("/login", catchAsync(loginUser));
router.get('/getUser' , isLoggedIn ,catchAsync(getUser));
router.get("/logout", isLoggedIn , catchAsync(logoutUser));

router.get('/:username', isLoggedIn, catchAsync(getUserProfile))

module.exports = router;
