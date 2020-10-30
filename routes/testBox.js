const express = require("express")
//setup csrf token for form
const {csrfToken,csrfParse} = require("../lib/csrfToken")

const route = express.Router();

//in this page we put cours, tuto...
route.get("",csrfToken,(req,res)=>{
    res.render("coursBox",{url:req.urlForLink})
})

module.exports = route;
