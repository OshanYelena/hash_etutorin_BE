const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  //to do: add auth middleware to restrict access
  app.post("/api/user/enum" , controller.getEnum);
  app.post("/api/user/update-password" , controller.updateUserPassword);
};