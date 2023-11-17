const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const catchAsync = require("../middlewares/catchAsync");
const {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  getUserProfile,
  updateUser,
} = require("../controllers/users");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.post("/register", catchAsync(registerUser));
router.post("/login", catchAsync(loginUser));
router.get("/logout", isLoggedIn, catchAsync(logoutUser));
router.get("/getUser", isLoggedIn, catchAsync(getUser));

router.patch("/updateUser",
  isLoggedIn,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  catchAsync(updateUser)
);

router.get("/:username", isLoggedIn, catchAsync(getUserProfile));

module.exports = router;
