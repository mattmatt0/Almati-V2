const express = require("express")
const route = express.Router();

//in this page we put parameters of users, Sign In forgoten password...
route.get("",(req,res)=>{
	res.end("C'est pas encore fait ;)",{})
})
route.get("/signUp",(req,res)=>{
	res.render("common/signIn",{})
})
route.get("/motDePasseOublie",(req,res)=>{
	res.end("C'est pas encore fait ;)",{})
})

route.get("/courses/new",(req,res)=>{
	res.render("user/courseView.ejs",{})
})

module.exports = route;
