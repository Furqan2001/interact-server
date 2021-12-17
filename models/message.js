const mongoose = require("mongoose");
const User = require("./user");
const Comment = require("./comment");

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxlength: 300 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }]
},{
    timestamps: true
});

messageSchema.pre('remove', async function(next) {
    try {
        let commentsArray = this.comments;
        for (let i=0; i<commentsArray.length; i++) {
          let foundComment = await Comment.findById(commentsArray[i]);
          foundComment.remove();

        }

        let user = await User.findById(this.user);
        user.messages.remove(this._id);
        await user.save();
        next();
    } catch(err) {
        return next(err);
    }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;