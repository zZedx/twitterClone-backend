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
  const post = await Post.findById(id);
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
