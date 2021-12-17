const db = require("../models");

exports.createComment = async function(req, res, next) {
  try {
    let comment = await db.Comment.create({
      text: req.body.text,
      user: req.params.id
    });
    let foundMessage = await db.Message.findById(req.params.message_id);
    foundMessage.comments.push(comment._id);
    await foundMessage.save();
  
    let foundComment = await db.Comment.findById(comment._id).populate("user", {
      username: true,
      profileImageUrl: true
    });
    return res.status(200).json(foundComment);
  } catch(err) {
    return next(err);
  }
} 

exports.deleteComment = async function(req, res, next) {
  try {
    let foundMessage = await db.Message.findById(req.params.message_id);
    let foundComment = await db.Comment.findById(req.params.comment_id);

    if (req.params.id == foundComment.user) {
      foundMessage.comments.remove(foundComment._id);
      await foundMessage.save();
      foundComment.remove();
      return res.status(200).json(foundComment);
    } else {
      return next({
        status: 401,
        message: "Invalid User"
      });
    }

  } catch (err) {
    next(err);
  }
}