const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verify = require('./tokenVarifier');

// item model
const Message = require("../models/message");
const Users = require("../models/User");

router.get('/:id',verify,async(req,res)=>{

  const user = await Users.find({"_id":req.user._id})

  const msgs = await Message.find({$and:[{$or:[{"senderId" : req.params.id},{"recieverId":req.params.id}]},{$or:[{"senderId" : req.user._id},{"recieverId":req.user._id}]}]})
    .sort({date:-1})
  res.json(msgs);
  
});


router.post('/send',verify,(req,res)=>{

  const newMsg = new Message({
    content: req.body.content,
    senderId: req.user._id,
    recieverId: req.body.recieverId
  });
  newMsg.save()
    .then((msg) => res.json(msg))
    .catch((err) => res.json({success:err}))
});

router.delete("/:id", verify, (req, res) => {
  Message.deleteOne({ _id: req.params.id })
    .then((item) => res.json({ success: true }))
    .catch((err) => res.status(404).json({ success: false, message: err }));
});

router.patch("/:id", verify, (req, res) => {
  Message.updateOne({_id:ObjectId(req.params.id)},{$set:{"status":req.body.status}})
    .then((item) => res.json(item))
    .catch((error)=>res.status(400).json({error: err}))
  
})
module.exports = router;

// db.messages.find({$and:[{$or:[{"senderMail" : "frnd2@x.com"},{"recieverMail":"frnd2@x.com"}]},{$or:[{"senderMail" : "me@x.com"},{"recieverMail":"me@x.com"}]}]}).pretty()
// db.messages.update({_id:ObjectId("6112013f37f8e6f716ab83f1")},{$set:{"status":"seen"}})
