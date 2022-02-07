const { string } = require("joi");
const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 255,
  },
  profile: {
    type: String,
  },
  otp:{
    value:{
      type:String,
    },
    time:{
      type:Date,
      default:new Date()
    }
  }
  
},{timestamp:true});

// userSchema.methods.genrateToken = function () {
//   const userInfo = {
//     _id: this._id,
//     name: this.name,
//     email: this.email,
//     file: this.file,
//     isAdmin: this.isAdmin,
//   };
//   return jwt.sign(userInfo, config.get("jwtPrivateKey"));
// };

const UserModel = mongoose.model("users", userSchema);

module.exports= {UserModel,userSchema};
