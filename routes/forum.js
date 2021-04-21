var express = require("express")
var forumModel = require("../models/forumModel")
const {csrfToken,csrfParse} = require("../middlewares/csrfToken")

module.exports = db =>{
	var router = express.Router()

	router.forumModel = new forumModel(db,"topic","category","subsection","topic","messages","users")

	router.get("/",csrfToken,(req,res)=>{
		router.forumModel.getCategory((err,data)=>{
			if (err){
				console.log(err)
				res.status(500).send("Erreur interne")
			} else
				res.render("forum/forum.ejs",{category:data})
		})
		
	})

	router.get("/test",(req,res)=>{
		router.forumModel.getCategory((err,data)=>{
			if (err){
				console.log(err)
				res.status(500).send("Erreur interne")
			} else
				res.json({err:err,data:data})
		})
	})

	router.get("/:category",csrfToken,(req,res)=>{
		router.forumModel.getTopicsByCategory(req.params.category,10,false,(err,topics)=>{
			if (err){
				console.log(err)
				res.status(500).send("Erreur interne")
			}
			else
				router.forumModel.getTopicsByCategory(req.params.category,10,true,(err,pined)=>{
					if (err){
						console.log(err)
						res.status(500).send("Erreur interne")
					} else {
						res.render("forum/topicList.ejs",{topics:topics,pined:pined})
					}
				})
		})
	})

	router.get("/:category/:topic",csrfToken,(req,res)=>{

	})

	return router
}