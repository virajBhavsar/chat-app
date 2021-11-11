const router = require('express').Router();
const varify = require('./tokenVarifier')
const Messages = require('../models/messages');
const User = require('../models/User');
const Sockets = require('../models/sockets');

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

// chatId through param
// page
router.get('/:_id/:page',varify, async(req, res) => {
	try{
	const chat = await Messages.findOne({_id : req.params._id});
	for(let i=0;i<chat.messages.length;i++){
		if(chat.messages[chat.messages.length - (i+1)].senderId !== req.user._id){
			
			if(chat.messages[chat.messages.length - 1 - i].status === 'seen'){
				break;
			}
			
			let updateEffect = await Messages.updateOne(
				{_id : chat._id,"messages._id":chat.messages[chat.messages.length - (i+1)]._id},
				{$set:{"messages.$.status":"seen"}})
		}
	}

	if(chat.members.includes(req.user._id)){
		let anotherOne = 'hi';
	
		if(chat.members[0] == req.user._id){
			 anotherOne = await Sockets.findOne({userId:chat.members[1]})
		}else{
			 anotherOne = await Sockets.findOne({userId:chat.members[0]})
		}
		
		const pageNo = req.params.page;
		const pagination = 100;

		const pages = Math.ceil(chat.messages.length / 100);
		let	msg = paginate(pageNo,pagination,chat.messages);
		res.json({"msgs":msg,"pages":pages,"online":anotherOne.online});	
	}else{
		res.json({"error" : "access denied!"});
	}
	
	}catch(err){
		res.json({"error":"no messages"});
	}
});


// req.user._id

router.get('/contacts',varify,async(req,res)=>{
	try{
		const chats = await Messages.find({members:{$all:[req.user._id]}}).sort({date:-1});
		let contacts = [];
		let user = '';
		for(let i=0;i<chats.length;i++){
			if(chats[i].members[1] === req.user._id){
				user = await User.findOne({_id:chats[i].members[0]})
			}else{
				user = await User.findOne({_id:chats[i].members[1]})
			}
			
			let newmsgs = 0;

			for(let j=0;j<chats[i].messages.length;j++){
				if(chats[i].messages[chats[i].messages.length - (j+1)].senderId !== req.user._id){
					if(chats[i].messages[chats[i].messages.length - (j+1)].status === 'seen'){
						break;
					}
					newmsgs = newmsgs + 1; 
				}
			}
			
			contacts.push({
					chatId : chats[i]._id,
					username : user.name,
					userId : user._id,
					lastMsg : chats[i].messages[chats[i].messages.length - 1],
					time : chats[i].date,
					unseen : newmsgs
				})
		}
		res.json(contacts);
	}catch(err){res.json({"error":"no contacts"})}
})


// req.user._id
// req.body.chatId
// req.body.content

router.patch('/send',varify,async(req,res)=>{	
	try{
	let updateEffect = await Messages.updateOne(
	{_id : req.body.chatId},
	{$push:{messages:{
		"senderId" : req.user._id,
		"content" : req.body.content
	}}})
	
	let updateEffect2 = await Messages.updateOne(
	{_id : req.body.chatId},
	{$set:{date: new Date().toISOString()}}
	)

	updateEffect = await Messages.findOne({_id : req.body.chatId})
	res.json({"senderMsg" : updateEffect.messages[updateEffect.messages.length - 1]})
	}catch(err){
		res.json({"error":"error ! sending msg check your internet connection" });
	}
	})

// req.body.email
// req.user._id

router.patch('/addcontact',varify, async(req,res)=>{
	try{		
	const chatUser = await User.findOne({email:req.body.email});

	if(chatUser._id == req.user._id){
		res.json({"error":"it's your email Id"});
	}else{
		const chat1 = await Messages.find({members:{$all:[chatUser._id,req.user._id]}});
		if(chat1.length !== 0){
			res.json({"error" : "already added"})
		}else{
		const chat = new Messages({
			socketId : '',
			members:[req.user._id,chatUser._id],
			messages:[{senderId:req.user._id,type:"greet",content:"added "+ chatUser.name +  " as friend"}]
		})

		chat.save().then(chat => {
			res.json(
				{
					username:chatUser.name,
					chatId:chat._id,
					lastMsg : chat.messages[chat.messages.length - 1],
					time : chat.date
				})}).catch(err => res.json({"error":"error"}))
	}}}catch(err){
		res.json({"error":"contact not found"})
	}
})

module.exports = router;


// req.body.chatId
// req.body.msgId

// router.patch('/messageSeen',varify,async(req,res)=>{
// 	try{
// 		let updateEffect = await Messages.updateOne(
// 			{_id : req.body.chatId,"messages._id":req.body.msgId},
// 			{$set:{"messages.$.status":"seen"}})
// 		res.send("success");
// 	}catch(err){res.send("" + err);}
// })
