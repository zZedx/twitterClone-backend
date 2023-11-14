const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
    body: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;