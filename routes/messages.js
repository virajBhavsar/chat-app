const router = require('express').Router();
const varify = require('./tokenVarifier')
const Messages = require('../models/messages');

router.get('/', (req, res) => {
	res.json({doiin : "great"})
});

router.patch('/send',varify,(req,res)=>{
	console.log(req.user._id);
	Messages.updateOne(
	{"userId" : req.user._id},
	{$push:{messages:{
		"content" : req.body.content,
		"senderId" : req.user._id,
		"recieverId" : req.body.recieverID
	}}})
	.then(msg => res.json({data:msg}))
	.catch(err => res.send(err))
})

module.exports = router;
