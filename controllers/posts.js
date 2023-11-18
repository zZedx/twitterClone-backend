const { cloudinary } = require("../cloudinary");
const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");

module.exports.getAllPosts = async (req, res) => {
  const posts = await Post.find().populate(
    "user",
    "username avatar displayName"
  );
  res.json(posts);
};

module.exports.createPost = async (req, res) => {
  const { body } = req.body;
  const { path, filename } = req.file || {};

  const user = await User.findById(req.user._id);
  const post = new Post({
    body,
    image: path || "",
    imageName: filename || "",
    user: user._id,
  });
  await post.save();

  user.posts.push(post._id);
  await user.save();

  res.json();
};

module.exports.likePost = async (req, res) => {
  const { id } = req.params;
  const post = (await Post.findById(id)) || (await Comment.findById(id));
  if (!post.likes.includes(req.user._id)) {
    post.likes.push(req.user._id);
  } else {
    post.likes = post.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
  }
  await post.save();
  res.json();
};

module.exports.getPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id)
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username avatar displayName",
      },
    })
    .populate({
      path: "user",
      select: "username avatar displayName",
    });
  res.json(post);
};

module.exports.commentPost = async (req, res) => {
  const { postId } = req.params;
  const { body } = req.body;
  const { path, filename } = req.file || {};

  const user = await User.findById(req.user._id);
  const post = await Post.findById(postId);
  const comment = new Comment({
    body,
    image: path || "",
    imageName: filename || "",
    user: user._id,
  });
  await comment.save();
  post.comments.push(comment);
  await post.save();
  res.json();
};

module.exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  const comment = await Comment.findById(id);

  if (!post && !comment) {
    return res.status(404).json({ message: "Resource not found" });
  }

  const resource = post || comment;

  if (resource.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (resource.imageName) {
    await cloudinary.uploader.destroy(resource.imageName);
  }

  if (post) {
    await Comment.deleteMany({ _id: { $in: post.comments } });
    await User.updateOne({ _id: post.user }, { $pull: { posts: post._id } });
  } else {
    await Post.findOneAndUpdate(
      { comments: { $in: comment._id } },
      { $pull: { comments: comment._id } }
    );
  }

  await resource.deleteOne({ _id: id });
  res.json();
};
