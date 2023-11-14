const Post = require("../models/post");

module.exports.getAllPosts = async (req, res) => {
    const posts = await Post.find().populate("user", "username avatar displayName");
    res.json(posts);
};
