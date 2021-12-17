const express = require("express");
const router = express.Router({ mergeParams: true });
const { createComment, deleteComment } = require("../handlers/comments");

router.route("/")
  .post(createComment)

router.route("/:comment_id")
  .delete(deleteComment)
  
module.exports = router;  