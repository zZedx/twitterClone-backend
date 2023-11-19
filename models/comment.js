const mongoose = require("mongoose");
const { cloudinary } = require("../cloudinary");
const Post = require("./post");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
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
  //   comments: [
  //     {
  //       type: Schema.Types.ObjectId,
  //       ref: "Comment",
  //     },
  //   ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.pre("deleteMany", async function (next) {
  const comment = this;
  if (comment.imageName !== "") {
    cloudinary.uploader.destroy(comment.imageName);
  }
  next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
