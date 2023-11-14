require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const usersRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Mongoose Running");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/users", usersRoutes);
app.use('/posts' , postRoutes);

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(status).json({ err, message: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
