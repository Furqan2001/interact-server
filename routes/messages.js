const express = require("express");
const router = express.Router({ mergeParams: true });
const { createMessage, getMessage, deleteMessage, addLike, removeLike } = require("../handlers/messages");

router.route("/")
  .post(createMessage)

router.route("/:message_id")
  .get(getMessage)
  .delete(deleteMessage)  
  
router.route("/:message_id/likes/add")
  .post(addLike)

router.route("/:message_id/likes/remove")
  .post(removeLike)

module.exports = router;  