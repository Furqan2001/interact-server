const db = require("../models");

exports.createMessage = async function(req, res, next) {
    try {
        let message = await db.Message.create({
            text: req.body.text,
            user: req.params.id
        });
        let foundUser = await db.User.findById(req.params.id);
        foundUser.messages.push(message._id);
        foundUser.save();
        let foundMessage = await db.Message.findById(message._id).populate("user", {
            username: true,
            profileImageUrl: true
        });
        return res.status(200).json(foundMessage);
    } catch (err) {
        return next(err);
    }
}


exports.getMessage = async function(req, res, next) {
    try {
      let message = await db.Message.findById(req.params.message_id).populate([
        {
          path: 'comments',
          model: 'Comment',
          select: 'text user',
          populate: {
            path: 'user',
            model: 'User',
            select: 'username profileImageUrl'
          }
        }, {
          path: 'user',
          model: 'User',
          select: 'username profileImageUrl'
        }
      ]);
      return res.status(200).json(message);
    } catch (err) {
      return next(err);
    }
}

exports.deleteMessage = async function(req, res, next) {
    try {
        let foundMessage = await db.Message.findById(req.params.message_id);
        if (req.params.id == foundMessage.user) {
          await foundMessage.remove();
          return res.status(200).json(foundMessage);          
        } else {
          return next({
            status: 401,
            message: "Invalid User"
          });
        }
    } catch (err) {
        return next(err);
    }
}

exports.addLike = async function(req, res, next) {
  try {
    let foundMessage = await db.Message.findById(req.params.message_id).populate("user",{
      username: true,
      profileImageUrl: true
    });
    if (!foundMessage.likes.includes(req.params.id)) {
      foundMessage.likes.push(req.params.id);
    }
    await foundMessage.save();
    return res.status(200).json(foundMessage);
  } catch (err) {
    return next(err);
  }
}

exports.removeLike = async function(req, res, next) {
  try {
    let foundMessage = await db.Message.findById(req.params.message_id).populate("user", {
      username: true,
      profileImageUrl: true
    });
    foundMessage.likes = foundMessage.likes.filter(userId => userId != req.params.id);
    await foundMessage.save();
    return res.status(200).json(foundMessage);
  } catch (err) {
    return next(err);
  }
}