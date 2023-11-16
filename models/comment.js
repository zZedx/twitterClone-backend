const mongoose = require("mongoose");
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

commentSchema.pre("findOneAndDelete", async function (next) {
  const comment = this;
  await Post.updateMany(
    { comments: { $in: comment._id } },
    { $pull: { comments: comment._id } }
  );
  next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
