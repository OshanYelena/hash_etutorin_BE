const app = require("./app.js");
const { initSocket } = require('./soket/index.js')
const { Server } = require("socket.io");


const port = process.env.PORT || 8000;

const server = app.listen(port, (error) => {
  if (!error) console.log("Server successfully started on port: " + port);
  else console.log("Error occurred, server can't start", error);
});

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
initSocket(io);
