const express = require("express");
const router = express.Router();

const catchAsync = require("../middlewares/catchAsync");
const {getAllPosts, createPost} = require("../controllers/posts");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/" , catchAsync(getAllPosts));
router.post("/createPost" , isLoggedIn , catchAsync(createPost));

module.exports = router;