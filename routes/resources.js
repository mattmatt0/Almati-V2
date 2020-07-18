const express = require("express")
const route = express.Router();

// Resources, such as wysiwyg editor, etc...
route.get("/wysiwyg",(req,res)=>{
	res.render('wysiwyg.ejs',{url:req.urlForLink})
})

module.exports = route;
