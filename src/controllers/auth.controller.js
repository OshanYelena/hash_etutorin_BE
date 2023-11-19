const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const config = require("../config/auth.config");
const db = require("../models");
const sendEmail = require("../utils/sendEmail");

const User = db.user;
const Student = db.student;
const Educator = db.educator;

exports.signup = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    console.log(req.body);
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    // 6551f65caa39b9232fd8c0a0
    if (req.body.role === "student") {
      //transaction start
      session.startTransaction();
      const temp_user = await user.save({ session });
      console.log(temp_user);
      const student = new Student({
        user_id: temp_user._id,
        //add other relevent fields
      });
      await student.save({ session });
      //transaction end
      await session.commitTransaction();
      return res
        .status(200)
        .send({ message: "Student was registered successfully!" });
    } else if (req.body.role === "educator") {
      //transaction start
      session.startTransaction();
      const temp_user = await user.save({ session });
      console.log(temp_user);
      const educator = new Educator({
        user_id: temp_user._id,
        country: req.body.country,
      });
      await educator.save({ session });
      //transaction end
      await session.commitTransaction();
      return res
        .status(200)
        .send({ message: "Educator was registered successfully!" });
    } else {
      return res.status(400).send({ message: "unknown role" });
    }
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.status(500).send({ "server erro": error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    // const authorities = user.roles.map(
    //   (role) => "ROLE_" + role.name.toUpperCase()
    // );

    req.session.token = token;

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.role,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User Not Found." });
    }

    // Generate a reset token and save it to the user's document
    const resetToken = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 3600,
    });

    user.resetToken = resetToken;
    await user.save();

    // Send email with reset password link
    const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      to: email,
      subject: "Password Reset",
      html: `<p>Please click the following link to reset your password: <a href="${resetPasswordLink}">${resetPasswordLink}</a></p>`,
    };

    const sent_res = await sendEmail(mailOptions);
    console.log(sent_res);

    res
      .status(200)
      .send({ message: "Password reset instructions sent to your email." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
