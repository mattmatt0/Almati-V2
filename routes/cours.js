const express = require("express")
const route = express.Router();

//in this page we put cours, tuto...
route.get("",(req,res)=>{
	res.render('cours/cours.ejs',{})
})

route.get("/template",(req,res)=>{
	res.render('cours/template_cours.ejs',{})
})
route.get("/editor",(req,res)=>{
    res.render('editor.ejs',{})
})
module.exports = route;
