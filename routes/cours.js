const express = require("express")
const route = express.Router();

//in this page we put cours, tuto...
route.get("",(req,res)=>{
	res.end("C'est pas encore fait ;)",{url:req.urlForLink})
})

module.exports = route;