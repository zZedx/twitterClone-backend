const initializeSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected")
    socket.on("join_room", (data) => {
      socket.join(data.room);
      socket.emit("room_joined", data);
      console.log("user joined room: " + data.room);
    });

    socket.on("send_message", (data) => {
      console.log(data);
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
