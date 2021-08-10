const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },senderId: {
    type: String,
    required: true,
  },recieverId: {
    type: String,
    required: true,
  },status: {
    type: String,
    required: true,
    default:"time"
  },date:{
    type: Date,
    default: Date.now,
  },
});

module.exports = Message = mongoose.model("messages", MessageSchema);
