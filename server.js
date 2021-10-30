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
const Sockets = require('./models/sockets');

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
  
  
  socket.on('send',(active,msg)=>{
    Sockets.findOne({userId:active.userId})
    .then(reciever => { 
      if(reciever.online){
        socket.to(reciever.socketId).emit('recieve',msg,active.chatId);
      }
    })
    .catch(err => console.log(err));
  })

  socket.on('sendAck',(userId,recieverId)=>{
  
      Sockets.findOne({userId:userId})
        .then(sender => {

        if(sender.online){
          socket.to(sender.socketId).emit('recieveAck',recieverId);
      }
    })
    .catch(err => console.log(err));
  })
  
  socket.on('goOnline',(user)=>{
    Sockets.findOneAndUpdate({userId : user._id},{online:true,socketId:socket.id})
      .then(socketInfo => io.emit('onlineStatus',true,socketInfo.userId))
      .catch(err => "")
  })
  
  socket.on('goOffline',()=>{
    Sockets.findOneAndUpdate({socketId : socket.id},{online:false,socketId:""})
      .then(socketInfo => io.emit('onlineStatus',false,socketInfo.userId))
      .catch(err => "")
  })
  
  socket.on('disconnect',()=>{
    Sockets.findOneAndUpdate({socketId : socket.id},{online:false,socketId:""})
      .then(socketInfo => io.emit('onlineStatus',false,socketInfo.userId))
      .catch(err => "")
    
  })
})


