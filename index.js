require("dotenv").config();

const express = require("express");
const { createServer } = require("node:http");
const app = express();
const server = createServer(app);
const { Server } = require("socket.io");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");

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

const usersRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const messageRoutes = require("./routes/messages");

const initializeSocketIO = require("./socket.io/connection");
const { socketJwtAuth } = require("./middlewares/isLoggedIn");

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(socketJwtAuth);
initializeSocketIO(io);

app.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", usersRoutes);
app.use("/posts", postRoutes);
app.use("/messages", messageRoutes);

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(status).json({ err, message: err.message });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
