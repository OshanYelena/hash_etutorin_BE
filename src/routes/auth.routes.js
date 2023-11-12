const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  //to do: add auth middleware to restrict access

  app.post(
    "/api/auth/signup",
    // [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted],
    verifySignUp.checkDuplicateEmail,
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);

  app.get("/api/auth/getAllUsers", controller.getAllUsers);

  app.post("/api/auth/forgot-password", controller.forgotPassword);
};
