const Message = require("../models/messages");

const initializeSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("join_room", (data) => {
      socket.join(data.room);
      socket.emit("room_joined", data);
      console.log("user joined room: " + data.room);
    });

    socket.on("send_message", async (data) => {
      const newMessage = new Message({
        to: data.receiver,
        message: data.message,
        from: data.sender,
        room: data.room,
      });
      await newMessage.save();
      io.to(data.room).emit("receive_message", data.message);
    });

    socket.on("leave_room", (data) => {
      socket.leave(data.room);
      console.log("user left room: " + data.room);
    });
  });
  io.on("disconnect", () => {
    console.log("user disconnected");
  });
};

module.exports = initializeSocketIO;
