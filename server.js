const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const socket = require('socket.io');

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

// routes import
const auth = require('./routes/auth');
const tokenCheck = require('./routes/tokenCheck');
const messages = require('./routes/messages');
const Messages = require('./models/messages');

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
  res.header("Access-Control-Allow-Credentials","false")
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "auth-token,Access-Control-Allow-Origin,Access-Control-Allow-Headers,Allow,Content-Type,Content-Length,ETag,Date,Connection,Keep-Alive");
  res.header("Access-Control-Allow-Methods","GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH")
  next()
}


app.use("/api/auth",cors,auth);
app.use("/api/check",cors,tokenCheck);
app.use("/api/messages",cors,messages);

const port = process.env.PORT || 5500;
var server = app.listen(port,cors,() => {
  console.log("S E R V E R R U N N I N G O N 5 5 0 0");
})

const io = socket(server,{
    cors: {
      origin: "*"
    }});

//initializing the socket io connection 
io.on("connection", socket => {
  console.log("new connection");
  socket.on('send',(msg)=>{
    Messages.findOne({userId:msg.recieverId})
    .then(reciever => {
      if(reciever.online){
        socket.to(reciever.socketId).emit('recieve',msg);
      }
    })
    .catch(err => console.log(err));
  })
  socket.on('sendAck',(msg)=>{
      Messages.findOne({userId:msg.senderId})
    .then(sender => {
      if(sender.online){
        socket.to(sender.socketId).emit('recieveAck',msg.ref);
      }
    })
    .catch(err => console.log(err));
  })
  socket.on('goOnline',(user)=>{
    Messages.findOneAndUpdate({userId : user._id},{online:true,socketId:socket.id})
      .then(msg => io.emit('onlineStatus',true,msg.userId))
      .catch(err => console.log(err))
  })
  socket.on('goOffline',()=>{
    Messages.findOneAndUpdate({socketId : socket.id},{online:false,socketId:""})
      .then(msg => io.emit('onlineStatus',false,msg.userId))
      .catch(err => console.log(err))
  })
  socket.on('disconnect',()=>{
    console.log("user disconnected" + socket.id);
    console.log("emited")
  })
})


// cd driveX/js/chat-app
// npm start
// cd client
// npm start


// db.messages.drop()
// db.users.drop()
// db.createCollection("messages")
// db.createCollection("users")

// git remote add origin http://chatapp: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@github.com/virajBhavsar/chat-app.git

