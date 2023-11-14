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

module.exports.likePost = async (req, res) => {
    const {id} = req.params;
    const post = await Post.findById(id);
    if(!post.likes.includes(req.user._id)){
        post.likes.push(req.user._id);
    }else{
        post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    }
    await post.save();
    res.json();
}
