const { authJwt } = require("../middlewares");
const controller = require("../controllers/student.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  //to do: add auth middleware to restrict access
  app.get("/api/student/:user_id" , controller.getStudentById);
  app.get("/api/student/get-all-classes/:user_id" , controller.getAllClassesByStudentId);
  app.post("/api/student/update-basic-details" , controller.updateStudentBasicDetails);

};