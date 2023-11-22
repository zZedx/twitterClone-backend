const express = require("express");
const router = express.Router();

const catchAsync = require("../middlewares/catchAsync");
const isLoggedIn = require("../middlewares/isLoggedIn");

const { getMessages, getUsers } = require("../controllers/messages");

router.get('/users' , isLoggedIn , catchAsync(getUsers));
router.get("/:room" , isLoggedIn , catchAsync(getMessages));
// router.post("/", isLoggedIn, catchAsync(sendMessage));

module.exports = router;
