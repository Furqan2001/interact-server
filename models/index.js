const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/interact", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.Promise = Promise;

module.exports.User = require("./user");
module.exports.Message = require("./message");
module.exports.Comment = require("./comment");