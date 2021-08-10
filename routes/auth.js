const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../validation');
const secretToken = require('../config/token').TOKEN_SECRET;

router.post('/register', async(req, res) => {
	// validation of data
		const {error} = registerValidation(req.body);
		if(error) return res.status(400).send(error.details[0].message);

		// check if user already exist
		const emailExist = await User.findOne({email:req.body.email});
		if (emailExist) return res.send("email already exist");
	
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
			.then(user => res.json(user._id))
			.catch(err => res.json(err))
})
router.post('/login', async(req,res)=>{
	// validation
		const {error} = loginValidation(req.body);
		if (error) return res.send(error.details[0].message);

	// check if user exist
		const user = await User.findOne({email:req.body.email});
		if (!user)  res.status(400).send('user not found');
	
	//	varifying password
		const validPass = await bcrypt.compare(req.body.password,user.password);
		if (!validPass) return res.send('Incorrect password');
	
	// on success
		// create and asign jw token
		const token = jwt.sign({_id: user._id}, secretToken);
		res.header('auth-token',token).send(token);
	
})

module.exports = router;

// 7 - 5
// 5 - 11