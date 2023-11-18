const mongoose = require("mongoose");
const Comment = require("./comment");
const User = require("./user");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  body: {
    type: String,
  },
  image: {
    type: String,
    default: "",
    required: function () {
      return this.body ? false : true;
    },
  },
  imageName: {
    type: String,
    default: "",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.pre("deleteMany", async function (next) {
  const post = this;
  await Comment.deleteMany({ _id: { $in: post.comments } });
  await User.updateMany(
    { _id: { $in: post.user } },
    { $pull: { posts: post._id } }
  );
  next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;