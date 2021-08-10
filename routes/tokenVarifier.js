const router = require('express').Router();
const jwt = require('jsonwebtoken')
const secretToken = require('../config/token').TOKEN_SECRET;

module.exports = function(req,res,next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('access denied');

    try{
        const verified = jwt.verify(token,secretToken);
        req.user = verified;
        next();
    }catch(err){
        res.status(400).send("invalid token");
    }
}

