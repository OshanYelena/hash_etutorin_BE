const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
  // Email
  if (req.body.email) {
    User.findOne({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user) {
          return res
            .status(400)
            .send({ message: "Failed! Email is already in use!" });
        }
        next();
      })
      .catch((err) => {
        return res.status(500).send({ message: err });
      });
  }
  else {
    return res.status(500).send({ message: "No email found" });
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    console.log(req.body.roles.length);
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
    next();
  }
  else {
    return res.status(500).send({ message: "No role found" });
  }
};

const verifySignUp = {
  checkDuplicateEmail,
  checkRolesExisted,
};

module.exports = verifySignUp;
