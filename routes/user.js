const express = require("express")
const route = express.Router();

//in this page we put parameters of users, Sign In forgoten password...
route.get("",(req,res)=>{
	res.end("C'est pas encore fait ;)",{url:req.urlForLink})
})
route.get("/signUp",(req,res)=>{
	res.end("C'est pas encore fait ;)",{url:req.urlForLink})
})
route.get("/motDePasseOublié",(req,res)=>{
	res.end("C'est pas encore fait ;)",{url:req.urlForLink})
})

module.exports = route;