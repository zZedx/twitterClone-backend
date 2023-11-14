require("dotenv").config();
const mongoose = require("mongoose");
const Post = require("../models/post");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Mongoose Running");
  })
  .catch((e) => {
    console.log(e);
  });

const loadData = async () => {
  await Post.deleteMany({});

  const posts = Array.from({ length: 10 }, (_, index) => ({
    body: `This is the body of post ${index + 1}.`,
    user: "6553214fbaa2aa00ab3800e9",
  }));
  await Post.insertMany(posts)
};

loadData().then(() => {
    mongoose.connection.close();
});
