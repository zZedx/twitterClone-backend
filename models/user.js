const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const Post = require("./post");
const Comment = require("./comment");
const Message = require("./messages");
const { cloudinary } = require("../cloudinary");

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
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
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
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.pre("deleteOne", async function (next) {
  const users = await this.model.find(this.getQuery());
  for (let user of users) {
    if (user.avatarName !== "default_pfp") {
      cloudinary.uploader.destroy(user.avatarName);
    }
    if (user.coverImageName) {
      cloudinary.uploader.destroy(user.coverImageName);
    }
    await Post.deleteMany({ _id: { $in: user.posts } });
    await Comment.deleteMany({ user: { $in: user._id } });
    await Post.updateMany({ likes: user._id }, { $pull: { likes: user._id } });
    await Comment.updateMany(
      { likes: user._id },
      { $pull: { likes: user._id } }
    );
    await User.updateMany(
      {
        $or: [{ following: user._id }, { followers: user._id }],
      },
      { $pull: { following: user._id, followers: user._id } }
    );
    await Post.updateMany(
      { comments: { $in: user.comments } },
      { $pull: { comments: { $in: user.comments } } }
    );
    await Comment.deleteMany({ _id: { $in: user.comments } });
    await Message.deleteMany({
      $or: [{ to: user._id }, { from: user._id }],
    });
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
