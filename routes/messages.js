const router = require('express').Router();
const varify = require('./tokenVarifier')
const Messages = require('../models/messages');

router.get('/',varify, async(req, res) => {
	const messages = await Messages.findOne({userId : "61154b6c1d1c2517c4845336"});
	console.log(messages);
	console.log(req.user);
	res.send(messages);
});

router.patch('/send',varify,async(req,res)=>{
	Messages.updateOne(
	{userId : req.user._id},
	{$push:{messages:{
		"content" : req.body.content,
		"senderId" : req.user._id,
		"recieverId" : req.body.recieverId
	}}})
	.then(msg => res.json({data:msg}))
	.catch(err => res.send(err))
})

module.exports = router;
