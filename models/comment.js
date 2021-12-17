const mongoose = require('mongoose');
const User = require("./user");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 160 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;