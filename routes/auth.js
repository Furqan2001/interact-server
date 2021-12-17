const express = require("express");
const router = express.Router();
const { signup, signin, upload } = require("../handlers/auth");

router.post("/signup", upload.single('profileImageUrl'), signup);
router.post("/signin", signin);

module.exports = router;