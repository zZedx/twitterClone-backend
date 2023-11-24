const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const catchAsync = require("../middlewares/catchAsync");
const {
  getAllPosts,
  createPost,
  likePost,
  getPost,
  commentPost,
  deletePost,
} = require("../controllers/posts");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isTestAccount = require("../middlewares/isTestAccount");

router.get("/", isLoggedIn, catchAsync(getAllPosts));
router.get("/:id", catchAsync(getPost));
router.post(
  "/:postId/comment",
  isLoggedIn,
  isTestAccount,
  upload.single("image"),
  catchAsync(commentPost)
);
router.post(
  "/createPost",
  isLoggedIn,
  isTestAccount,
  upload.single("image"),
  catchAsync(createPost)
);
router.post("/likePost/:id", isLoggedIn, isTestAccount, catchAsync(likePost));
router.delete("/:id", isLoggedIn, isTestAccount, catchAsync(deletePost));

module.exports = router;
