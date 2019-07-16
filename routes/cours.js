const express = require("express")
const route = express.Router();

//in this page we put cours, tuto...
route.get("",(req,res)=>{
	res.render('cours.ejs',{url:req.urlForLink})
})

route.get("/template",(req,res)=>{
	res.render('template_cours.ejs',{url:req.urlForLink})
})
route.get("/editor",(req,res)=>{
    res.render('editor.ejs',{url:req.urlForLink})
})
module.exports = route;
