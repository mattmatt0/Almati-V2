const express = require("express")
const route = express.Router();

//in this page we put news, forum, chat...
route.get("",(req,res)=>{
	res.end("C'est pas encore fait ;)",{url:req.urlForLink})
})
route.get("/news",(req,res)=>{
	res.end("C'est pas encore fait ;)",{url:req.urlForLink})
})
route.get("/chat",(req,res)=>{
	res.end("C'est pas encore fait ;)",{url:req.urlForLink})
})
route.get("/forum",(req,res)=>{
	res.render('forum/forum.ejs',{url:req.urlForLink})
})
route.get("/QuiSommesNous",(req,res)=>{
	res.end("C'est pas encore fait ;)",{url:req.urlForLink})
})
route.get("/contact",(req,res)=>{
	res.end("C'est pas encore fait ;)",{url:req.urlForLink})
})
route.get("/FAQ",(req,res)=>{
	res.end("C'est pas encore fait ;)",{url:req.urlForLink})
})
module.exports = route;
