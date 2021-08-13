const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../validation');
const secretToken = require('../config/token').TOKEN_SECRET;
const Messages = require('../models/messages');

router.post('/register', async(req, res) => {
	console.log("user registered");
	// validation of data
		const {error} = registerValidation(req.body);
		if(error) return res.status(400).json({type:"validation",error:error.details[0].message});

		// check if user already exist
		const usernameExist = await User.findOne({name:req.body.name});
		if (usernameExist) return res.json({type:"usernameExist",error:"username already taken"});
	
		const emailExist = await User.findOne({email:req.body.email});
		if (emailExist) return res.json({type:"emailExist",error:"email already in use"});
	
		// hashing password
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.password, salt)

	// creating new user
		const user = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashPassword
		})

	// saving user to database
		user.save()
		.then(user => {
			const messenger = new Messages({
				userId: user._id,
				contacts : "1"
			});
			messenger.save()
				.then(msg => res.send(msg))
				.catch(err => res.send(err));
			})
		.catch(err => res.send(err))
})
router.post('/login', async(req,res)=>{
	// validation
		const {error} = loginValidation(req.body);
		if (error) return res.json({type:"validation",error:error.details[0].message});

	// check if user exist
		const user = await User.findOne({email:req.body.email});
		if (!user)  res.json({type:"notfound",error:'user not found'});
		console.log(user);
	//	varifying password
		const validPass = await bcrypt.compare(req.body.password,user.password);
		if (!validPass) return res.json({type:"varification",error:'Incorrect password'});
	
	// on success
		// create and asign jw token
		const token = jwt.sign({_id: user._id}, secretToken);
		res.header('auth-token',token).json({username:user.name,email:user.email,token:token});	
})

module.exports = router;
