const { authJwt } = require("../middlewares");
const controller = require("../controllers/class.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  //to do: add auth middleware to restrict access
  app.get("/api/class/:class_id" , controller.getClassDetailsById);
  app.get("/api/class/get-all-student/:class_id" , controller.getAllStudentByClassID);
  app.post("/api/class/update-class-details" , controller.updateClassDetails);
  app.post("/api/class/create-class" , controller.createClass);
  app.post("/api/class/add-announcement" , controller.addAnnouncement);
  app.post("/api/class/add-resource" , controller.addResource);

};
