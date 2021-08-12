const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const server = require('http').Server(app);
const io = require('socket.io')(server);

const mongoose = require("mongoose");
// routes import
const auth = require('./routes/auth');
const tokenCheck = require('./routes/tokenCheck');
const messages = require('./routes/messages');

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
function cors(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "auth-token");

  next()
}
app.use("/api/auth",cors,auth);
app.use("/api/check",cors,tokenCheck);
app.use("/api/messages",messages);



const port = process.env.PORT || 5500;
server.listen(port,() => {
  console.log("S E R V E R R U N N I N G O N 5 5 0 0");
})




//  db.messages.drop()
//  db.users.drop()
//  db.createCollection("messages")
//  db.createCollection("users")

