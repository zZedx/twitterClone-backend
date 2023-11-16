const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const Post = require("./post");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  displayName: {
    type: String,
    trim: true,
    minlength: 3,
    default: function () {
      return this.username; // Set displayName to default to username
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/dbm00ix5k/image/upload/v1698905214/default_pfp.jpg",
  },
  avatarName: {
    type: String,
    default: "default_pfp",
  },
  bio: {
    type: String,
  },
  followers: [{
    type : Schema.Types.ObjectId,
    ref: "User",
  }],
  following: [{
    type : Schema.Types.ObjectId,
    ref: "User",
  }],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  coverImage: {
    type: String,
    default: "",
  },
  coverImageName: {
    type: String,
    default: "",
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.pre("deleteMany", async function (next) {
  const user = this;
  await Post.deleteMany({ _id: { $in: user.posts } });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
