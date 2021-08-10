const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require("mongoose");
const messaging = require("./routes/messaging");
const auth = require('./routes/auth');
// Body Parser middleware
app.use(bodyParser.json());

// db connection
const db = require("./config/keys").mongoURI;

// Connecting to db
mongoose
  .connect(db)
  .then(() => {
    console.log("C O N N E C T E D W I T H M O N G O");
  })
  .catch((err) => {
    console.log(err);
  });

// use routes
app.use("/api/message",messaging);
app.use("/api/auth",auth);

const port = process.env.PORT || 5500;
server.listen(port,() => {
  console.log("S E R V E R R U N N I N G O N 5 5 0 0");
})

