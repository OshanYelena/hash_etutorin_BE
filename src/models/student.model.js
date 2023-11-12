const mongoose = require("mongoose");
const {country_array, grade_array} = require("../utils/enum");


const Student = mongoose.model("Student", new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  country: {
    type: String,
    enum:country_array
  },
  grade: {
    type: String,
    enum:grade_array
  },
  subject_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref : "Subject",
    // required: true,
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

}));

module.exports = Student;
