const mongoose = require("mongoose");
const {role_array} = require("../utils/enum");

const User = mongoose.model("User", new mongoose.Schema({

  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: role_array,
    required: true,
  },
  mobile_no: {
    type: String,
  },



}));

module.exports = User;
