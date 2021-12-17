const db = require("../models");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const cloudinary = require('cloudinary');

const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

exports.upload = multer({ storage: storage, fileFilter: imageFilter});

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.signin = async function(req, res, next) {
    try {
        let user = await db.User.findOne({
            email: req.body.email
        });
        let { id, username, profileImageUrl } = user;
        let isMatch = await user.comparePassword(req.body.password);
        if (isMatch) {
            let token = jwt.sign({
                id,
                username,
                profileImageUrl
            }, process.env.SECRET_KEY);
            return res.status(200).json({
                id,
                username,
                profileImageUrl,
                token
            });
        } else {
            return next({
                status: 400,
                message: "Invalid email/password"
            });
        }
    } catch (err) {
        return next({
            status: 400,
            message: "Invalid email/password"
        });
    }

}

exports.signup = async function(req, res, next) {
    try {
      cloudinary.uploader.upload(req.file.path, async function(result) {
        // add cloudinary url for the image to the campground object under image property
        req.body.profileImageUrl = result.secure_url;
        
        //Create User
        let user = await db.User.create(req.body);
        let { id, username, profileImageUrl } = user;
        let token = jwt.sign({
            id,
            username,
            profileImageUrl
        }, process.env.SECRET_KEY);
        return res.status(200).json({
            id,
            username,
            profileImageUrl,
            token
        });
      });        
    } catch (err) {
        if (err.code === 11000) {
            err.message = "The email and/or username are already taken";
        }
        return next({
            status: 400,
            message: err.message
        });
    }
}