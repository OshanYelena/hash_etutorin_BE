const { authJwt } = require("../middlewares");
const controller = require("../controllers/educator.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  //to do: add auth middleware to restrict access
  app.get("/api/educator/:user_id" , controller.getEducatorById);
  app.post("/api/educator/update-basic-details" , controller.updateEducatorBasicDetails);
  app.post("/api/educator/update-bank-details" , controller.updateEducatorBankDetails);
  app.post("/api/educator/update-additional-details" , controller.updateEducatorAdditionalDetails);

};