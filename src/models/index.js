const {country_array,grade_array,role_array} = require("../utils/enum");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.user = require("./user.model");
db.student = require("./student.model");
db.educator = require("./educator.model");
db.subject = require("./subject.model");
db.class = require("./class.model");
db.bank_detail = require("./bankDetail.model");
db.chat_msg = require("./chatMsg.model");

db.ROLES = role_array;
db.COUNTRIES = country_array;
db.GRADES = grade_array;

module.exports = db;
