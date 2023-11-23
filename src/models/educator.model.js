const mongoose = require("mongoose");
const { country_array, grade_array } = require("../utils/enum");


const Educator = mongoose.model("Educator", new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  country: {
    type: String,
    // enum: country_array
  },
  grades:[ {
    type: String,
    // enum: grade_array
  }],
  subject_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  }],
  description: {
    type: String,
  },
  profile_image_ref: {
    type: String,
  },
  class_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  }],
  //
  language: {
    type: String,
  },
  occupation: {
    type: String,
  },
  fb_link: {
    type: String,
  },
  linkedin_link: {
    type: String,
  },
  cv_ref: {
    type: String,
  },
  is_verified: {
    type: Boolean,
  },
  bank_details_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankDetail",
  }],

}));

module.exports = Educator;
