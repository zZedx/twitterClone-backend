require('dotenv').config()

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const cors = require("cors");
const cookieParser = require('cookie-parser')

const usersRoutes = require("./routes/users");

mongoose
  .connect("mongodb://127.0.0.1:27017/twitter")
  .then(() => {
    console.log("Mongoose Running");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/users", usersRoutes)

app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(status).json({ err, message: err.message })
  })

app.listen(3000, () => {
  console.log("Listening");
});
