const router = require('express').Router();
const varify = require('./tokenVarifier')
const Messages = require('../models/messages');
const User = require('../models/User');

function paginate(pageNo,pagination,msg){
	if(pageNo > ((msg.length / pagination) | 0)){
		return msg.slice(0,msg.length % pagination);
	}else{
		if(pageNo == 1){
			return msg.slice(-pagination);
		}else{
			return msg.slice(-(pageNo*pagination),-(pageNo*pagination -pagination));
		}
}}

router.get('/:_id/:page',varify, async(req, res) => {
	const messages = await Messages.findOne({userId : req.user._id});
	const pageNo = req.params.page;
	const pagination = 100;
	let msg = messages.messages.filter(msg =>  msg.senderId === req.params._id || msg.recieverId === req.params._id);
	const pages = Math.ceil(msg.length / 100);
	msg = paginate(pageNo,pagination,msg);
	res.json({"msg":msg,"pages":pages});
});

router.get('/contacts',varify,async(req,res)=>{
	const messages = await Messages.findOne({userId : req.user._id});
	let contactx = [];

	for(let i=0;i<messages.contacts.length;i++){
		let user = await User.findOne({_id:messages.contacts[i]})
		let data = {_id:user._id,username:user.name,email:user.email}
		contactx.push(data);
	}
	res.send(contactx);
})

router.patch('/send',varify,async(req,res)=>{
	try{
	const updateEffect = await Messages.updateOne(
	{userId : req.user._id},
	{$push:{messages:{
		"content" : req.body.content,
		"senderId" : req.user._id,
		"recieverId" : req.body.recieverId
	}}})
	const msg = await Messages.findOne({userId : req.user._id})
	res.json(msg.messages[msg.messages.length - 1])
	}catch(err){
		res.json({"error":err});
	}
	})

router.patch('/recieve',varify,(req,res)=>{
	Messages.updateOne(
	{userId : req.user._id},
	{$push:{messages:{
		"content" : req.body.content,
		"senderId" :req.body.senderId,
		"recieverId" :req.user._id
	}}})
	.then(msg => res.json({data : msg}))
	.catch(err => res.send(err))
})

router.patch('/addcontact',varify, async(req,res)=>{
	try{
	const chatUser = await User.findOne({email:req.body.email});
	const messages = await Messages.findOne({userId : req.user._id});
	let contact = messages.contacts.filter(contact => contact == chatUser._id)

	if(contact.length == 0){
		if(chatUser){
		Messages.updateOne(
			{userId : req.user._id},
			{$push:{contacts : chatUser._id}}
		)
		.then(msg => res.json({_id:chatUser._id,email:chatUser.email,username:chatUser.name}))
		.catch(err => res.send(err))
		}else{
			res.json({"error":"contact not found"})
		}}else{
		res.json({"error":"contact already added"});
	}}catch(err){
		res.json({"error":"contact not found"})
	}
})

module.exports = router;
