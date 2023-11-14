const express = require("express");
const router = express.Router();

const catchAsync = require("../middlewares/catchAsync");
const {getAllPosts} = require("../controllers/posts");

router.get("/" , catchAsync(getAllPosts));

module.exports = router;