const express = require("express")
const route = express.Router();

//in this page we put news, forum, chat...
route.get("",(req,res)=>{
	res.end("C'est pas encore fait ;)",{})
})
route.get("/news",(req,res)=>{
	res.end("C'est pas encore fait ;)",{})
})
route.get("/chat",(req,res)=>{
	res.end("C'est pas encore fait ;)",{})
})
route.get("/forum",(req,res)=>{
	if(!req.url.endsWith('/'))
	{
		res.redirect('/communaute' + req.url + '/')
	}
	res.render('forum/forum.ejs',{})
})
route.get("/forum/:subsection/",(req,res)=>{
	res.render('forum/forumSubsectionTemplate.ejs',{
		category:req.params.subsection,
		categoryDescription:"CATEGORY DESCRIPTION"}
	)
})
route.get("/forum/:subsection/:postId",(req,res)=>{
	res.render("forum/postTemplate.ejs",{
		postTitle:"POST TITLE (id:" + req.params.postId + ")"}
	)
})
route.get("/QuiSommesNous",(req,res)=>{
	res.end("C'est pas encore fait ;)",{})
})
route.get("/contact",(req,res)=>{
	res.end("C'est pas encore fait ;)",{})
})
route.get("/FAQ",(req,res)=>{
	res.end("C'est pas encore fait ;)",{})
})
module.exports = route;
