const express = require("express");
const router = express.Router();
const verify = require('./tokenVarifier');

router.get('/',verify,async(req,res)=>{
  console.log("ping done..")
  res.json({status:"ok"});
});

module.exports = router;

