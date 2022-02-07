const { UserModel } = require("../models/user");
const config = require("config");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
// const getUsers = async (req, res, next) => {
//   const users = await User.find({}).select(" -__v");

//   const imageUrl =
//     req.protocol + "://" + path.join(req.headers.host, "/uploads/");

//   const allUsers = users.map((u) => {
//     u.file = imageUrl + u.file;
//     return u;
//   });
//   res.status(200).send(allUsers);
// };

const signUp = async (req, res) => {
  const email = await UserModel.findOne({ email: req.body.email });
  if (email) {
    return res.status(409).send("Email Already Exists!");
  }
  let user = new UserModel({
    name: req.body.name,
    email: req.body.email,
  });
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPass;

  user = await user.save();

  res.status(200).send(user);
};
const login = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid Email Or Password!");

  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(400).send("Invalid Email  Password!");

  res.status(200).send(user);
};

const forgetPassword = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("There is no user.");

    const otp = Math.ceil(Math.random() * 1000);

    await UserModel.updateOne(
      { email: user.email },
      {
        $set: {
          otp: {
            value: otp,
          },
        },
      }
    );
    //Send Mail for otp verification

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "codefrec@gmail.com",
        pass: config.get("mailPass"),
      },
    });

    var mailOptions = {
      from: "codefrec@gmail.com",
      to: user.email,
      subject: "Verify OTP",
      html: `<h2>OTP For Reset Password:</h2><br/><h1>${otp}</h1>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) res.status(500).send("Something Went wrong!Try again");
      else res.status(200).send("Otp Sent successfully!");
    });
  } catch (ex) {
    return res.status(401).send(ex.message);
  }
};

const verifyOtp = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("There is no user.");
  if (user.otp.value !== req.body.otp) {
    return res.status(403).send("Invalid Otp");
  }

  user.otp.verifyOtp = 1;
  await user.save();
  res.status(200).send("Otp verified successfully!");
};

const changePassword = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("There is no user.");
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPass;
  user.otp = {};

  await user.save();
  res.status(200).send("Password succssfully updated.");
};
const updateProfile = async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.query.id });
  if (!user) {
    if (req.file) {
      fs.unlinkSync(
        path.join(__dirname, "../public/profiles/") + req.file.filename
      );
    }

    return res.status(400).send("There is no user.");
  }

  // let post = new Post({
  //   message: req.body.message,
  //   user: req.params.id,
  // });

  user.profile = req.file.filename;

  await user.save();

  // const posts = await userModel.findOne({ _id: })
  //   .populate("user", "name _id file createdAt updatedAt")
  //   .populate("comments", "_id comment")
  //   .select(" -__v");

  res.status(200).send(user);
};

module.exports = {
  signUp,
  login,
  forgetPassword,
  verifyOtp,
  changePassword,
  updateProfile,
};
