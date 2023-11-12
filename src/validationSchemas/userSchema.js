const Joi = require("joi");

const userLogInSchema = Joi.object({
  email: Joi.string().email().max(255).required(),
  password: Joi.string()
    .regex(/\d+/, "Password should contain at least one number")
    .regex(/[a-z]+/, "Password should contain at least one lowercase character")
    .regex(
      /[A-Z]+/,
      "Passoword should contain at least one uppercase character"
    )
    .regex(
      /[!@#$%^&*()-+]+/,
      "Password should contain at least one special character"
    ),
});

const userRegisterSchema = Joi.object({
  firstName: Joi.string().required().min(3).max(255),
  lastName: Joi.string().required().min(3).max(255),
  email: Joi.string().email().max(255).required(),
  // telephoneNo: Joi.string().required().min(10).max(10),
  // username: Joi.string().required().min(3).max(255),
  // role: Joi.string(),
  password: Joi.string()
    .regex(/\d+/, "Password should contain at least one number")
    .regex(/[a-z]+/, "Password should contain at least one lowercase character")
    .regex(
      /[A-Z]+/,
      "Passoword should contain at least one uppercase character"
    )
    .regex(
      /[!@#$%^&*()-+]+/,
      "Password should contain at least one special character"
    ),
});

module.exports = {
  userLogInSchema,
  userRegisterSchema,
};
