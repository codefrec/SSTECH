const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  forgetPassword,
  verifyOtp,
  changePassword,
  updateProfile,
} = require("../controllers/user");
const multer = require("multer");
const path = require("path");

// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     cb(null, "./public/profiles/");
// //   },
// //   filename: function (req, file, cb) {
// //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
// //     cb(null, Date.now() + path.extname(file.originalname));
// //   },
// // });

// // const upload = multer({ storage: storage });
// var upload = multer({storage: multer.diskStorage({
//   destination: function (req, file, callback)
//   { callback(null, './uploads');},
//   filename: function (req, file, callback)
//   {
//     callback(null, (file.originalname));
//   }
// }),
// fileFilter: function(req, file, callback) {
//   var ext = path.extname(file.originalname)
//   if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
//     return callback(/res.end('Only images are allowed')/ null, false)
//   }
//   callback(null, true)
// }
// });

var storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, "./public/profiles/");
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

var upload = multer({
  //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 1024 * 1024 * 1023,
  },
});
const { validateUser, validateObjectId } = require("../validations/user");
router.post("/sign_up", validateUser, signUp);
router.post("/login", login);
router.post("/forget_password", forgetPassword);
router.post("/verify_otp", verifyOtp);
router.post("/change_password", changePassword);
router.post(
  "/edit_profile",
  upload.single("profile"),
  // validate,
  // validateObjectId,  
  updateProfile
);

module.exports = router;
