require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const cookieSession = require("cookie-session");
const db = require("./models");


const app = express();


app.use(cors());
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true,
  })
);


require("./routes/auth.routes")(app);
require("./routes/educator.routes")(app);
require("./routes/student.routes")(app);
require("./routes/user.routes")(app);
require("./routes/class.routes")(app);
require("./routes/chat.routes")(app);

db.mongoose
  .connect("mongodb+srv://oshanranasinghe25:hSOrF3nBZ3rQe9WJ@cluster0.txj0vpo.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
      // ssl: true, // Enable SSL connection
      // sslValidate: true, // Validate the SSL certificate
      // sslCA: [fs.readFileSync('path/to/rds-combined-ca-bundle.pem')],
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    // initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.status(200).send("Server is working");
});


// routes










module.exports = app;