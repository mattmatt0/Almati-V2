const express = require("express")
//setup csrf token for form
const {csrfToken,csrfParse} = require("../lib/csrfToken")
const route = express.Router();

//in this page we put news, forum, chat...
route.get("",csrfToken,(req,res)=>{
	res.end("C'est pas encore fait ;)",{})
})
route.get("/news",csrfToken,(req,res)=>{
	res.end("C'est pas encore fait ;)",{})
})
route.get("/chat",csrfToken,(req,res)=>{
	res.end("C'est pas encore fait ;)",{})
})
route.get("/forum",csrfToken,(req,res)=>{
	res.render('forum/forum.ejs',{})
})
route.use("/forum",csrfToken,(req,res)=>{
	res.render('forum/forumSubsectionTemplate.ejs',{url:req.urlForLink})
})
route.get("/QuiSommesNous",csrfToken,(req,res)=>{
	res.end("C'est pas encore fait ;)",{})
})
route.get("/contact",csrfToken,(req,res)=>{
	res.end("C'est pas encore fait ;)",{})
})
route.get("/FAQ",csrfToken,(req,res)=>{
	res.end("C'est pas encore fait ;)",{})
})
module.exports = route;
