const express = require("express")
const route = express.Router();

//in this page we put cours, tuto...
route.get("",(req,res)=>{
    res.render("coursBox",{url:req.urlForLink})
})

module.exports = route;
