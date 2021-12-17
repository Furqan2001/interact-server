require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const commentRoutes = require("./routes/comments");
const { loginRequired, ensureCorrectUser } = require("./middleware/auth");
const db  = require("./models");
const PORT = 8080;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", authRoutes);

app.get("/api/users/:id/messages", loginRequired, async function(req, res, next) {
  try {
    let allMessages = await db.Message.find()
    .sort({ createdAt: "desc" })
    .populate("user", {
      username: true, 
      profileImageUrl: true 
    });
    let userMessages = await allMessages.filter(message => message.user._id == req.params.id);
    return res.status(200).json(userMessages);
  } catch(err) {
    return next(err);
  }
});

app.use("/api/users/:id/messages", 
  loginRequired, 
  ensureCorrectUser, 
  messageRoutes
);

app.use("/api/users/:id/messages/:message_id/comments", 
  loginRequired, 
  ensureCorrectUser, 
  commentRoutes);

app.get("/api/messages", async function(req, res, next) {
  try {
      let messages = await db.Message.find()
        .sort({ createdAt: "desc" })
        .populate("user", {
            username: true, 
            profileImageUrl: true 
      });
      return res.status(200).json(messages);    
  } catch (err) {
      return next(err);
  }
});

app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});