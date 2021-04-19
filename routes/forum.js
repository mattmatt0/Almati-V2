var express = require("express")
var forumModel = require("../models/forumModel")
const {csrfToken,csrfParse} = require("../middlewares/csrfToken")

module.exports = db =>{
	var router = express.Router()

	router.forumModel = new forumModel(db,"topic","category","subsection","messages","users")

	router.get("/",csrfToken,(req,res)=>{
		router.forumModel.getCategory((err,data)=>{
			res.render("pages/forum.ejs",{category:data})
		})
		
	})

	router.get("/test",(req,res)=>{
		router.forumModel.getCategory((err,data)=>{
			res.json({err:err,data:data})
		})
	})

	router.get("/:category",csrfToken,(req,res)=>{
		router.forumModel.getTopicsByCategory(req.params.category,10,(err,data)=>{
			res.render("pages/topicList.ejs",{topics:data})
		})
	})

	router.get("/:category/:topic",csrfToken,(req,res)=>{

	})

	return router
}