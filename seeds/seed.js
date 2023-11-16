require("dotenv").config();
const mongoose = require("mongoose");
const Post = require("../models/post");
const User = require("../models/user");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Mongoose Running");
  })
  .catch((e) => {
    console.log(e);
  });

const loadData = async () => {
  await User.deleteMany({})
  // await Post.deleteMany({});
  // await User.updateMany({}, { $set: { posts: [] } });

  // const user = await User.findById("65560d1d2dec2ae835fe50a5");
  // const posts = Array.from({ length: 10 }, (_, index) => ({
  //   body: `This is the body of post ${index + 1}.`,
  //   user : user._id,
  // }));
  // const createdPosts = await Post.insertMany(posts);
  // const postIds = createdPosts.map((post) => post._id);
  // user.posts = postIds;
  // await user.save();
};

loadData().then(() => {
  mongoose.connection.close();
});
