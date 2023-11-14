const Post = require("../models/post");

module.exports.getAllPosts = async (req, res) => {
    const posts = await Post.find().populate("user", "username avatar displayName");
    res.json(posts);
};

module.exports.createPost = async (req, res) => {
    const { body } = req.body;
    const post = new Post({
        body,
        user: req.user._id,
    });
    await post.save();
    res.json();
};
