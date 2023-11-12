const { authJwt } = require("../middlewares");
const controller = require("../controllers/chat.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });

    //to do: add auth middleware to restrict access
    app.get("/api/chat/get-all-users", controller.getAllUsers);
    app.get("/api/chat/get-contacts/:userId", controller.getContactsByUserId);
    app.post("/api/chat/get-messages", controller.getMessages);

};