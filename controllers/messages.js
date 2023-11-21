const Message = require("../models/messages");

module.exports.getMessages = async (req, res) => {
    const {room} = req.params;
  const messages = await Message.find({room}).populate("to");
  res.json({ messages });
};

// module.exports.sendMessage = async (req, res) => {
//   const { to, message } = req.body;
//   const newMessage = new Message({ to, message, from: req.user._id });
//   await newMessage.save();
//   res.json();
// };
