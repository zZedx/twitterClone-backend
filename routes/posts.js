const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({storage});

const catchAsync = require("../middlewares/catchAsync");
const {getAllPosts, createPost, likePost, getPost, commentPost} = require("../controllers/posts");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/" , catchAsync(getAllPosts));
router.get('/:id' , catchAsync(getPost));
router.post('/:postId/comment' , isLoggedIn , upload.single("image") , catchAsync(commentPost));
router.post("/createPost" , isLoggedIn , upload.single("image") , catchAsync(createPost));
router.post('/likePost/:id' , isLoggedIn , catchAsync(likePost));

module.exports = router;