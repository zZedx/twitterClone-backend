const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  to: { type: Schema.Types.ObjectId, ref: "User" },
  from: { type: Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  room : {type : String}
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
