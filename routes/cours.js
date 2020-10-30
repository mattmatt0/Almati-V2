const express = require("express")
//setup csrf token for form
const {csrfToken,csrfParse} = require("../lib/csrfToken")
const route = express.Router();

//in this page we put cours, tuto...
route.get("",csrfToken,(req,res)=>{
	res.render('cours/cours.ejs',{})
})

route.get("/template",csrfToken,(req,res)=>{
	res.render('cours/template_cours.ejs',{})
})
route.get("/editor",csrfToken,(req,res)=>{
    res.render('editor.ejs',{})
})
module.exports = route;
