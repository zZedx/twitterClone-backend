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

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
