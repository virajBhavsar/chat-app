const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const socket = require('socket.io');

const mongoose = require("mongoose");
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
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "auth-token");

  next()
}
app.use("/api/auth",cors,auth);
app.use("/api/check",cors,tokenCheck);
app.use("/api/messages",cors,messages);


const port = process.env.PORT || 5500;
var server = app.listen(port,() => {
  console.log("S E R V E R R U N N I N G O N 5 5 0 0");
})

const io = socket(server,{
    cors: {
      origin: "*"
    }});


//initializing the socket io connection 
io.on("connection", socket => {
  console.log("new connection")
  socket.on('send',(msg)=>{
    // console.log(msg.data);
    Messages.findOne({userId:msg.data.recieverId})
    .then(reciever => {
      if(reciever.online){
        socket.to(reciever.socketId).emit('recieve',msg.data);
        
      }
    })
    .catch(err => console.log(err));
  })
  socket.on('goOnline',(user)=>{
    console.log(socket.id + " onlline");
    Messages.updateOne({userId : user._id},{online:true,socketId:socket.id})
      .then(msg => console.log("useronline"))
      .catch(err => console.log(err))
  })
  socket.on('goOffline',()=>{
    // console.log("SOCKET : " + socket.id + "offline");
    Messages.updateOne({socketId : socket.id},{online:false,socketId:""})
      .then(msg => console.log("EXPRESS: user offline"))
      .catch(err => console.log(err))
  })
  socket.on('disconnect',()=>{
    console.log("user disconnected")
    socket.emit('goOffline')
  })
})




 // db.messages.drop()
 // db.users.drop()
 // db.createCollection("messages")
 // db.createCollection("users")

// git remote add origin http://chatapp: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@github.com/virajBhavsar/chat-app.git
