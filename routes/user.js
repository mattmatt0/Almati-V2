var express = require("express")
var userModel = require("../models/userModel")
const {csrfToken,csrfParse} = require("../middlewares/csrfToken")


module.exports = db => {

	var router = express.Router();

	router.userModel = new userModel(db,"users")
	

	router.post("/signin",csrfParse,(req,res)=>{
		const body = req.body
		const redirect = req.query.noJavascript

		if (!req.validToken)
			res.json({result:false,err:"token"})
		else if (body.pseudo != undefined && body.password != undefined)
			router.userModel.autenticate(req.body.pseudo,req.body.password,(result,err,user)=>{
				if (result){
					req.session.id = user.id
					req.session.pseudo = user.pseudo
					req.session.image = user.image
					req.session.permission = user.permission
					if (redirect)
						res.redirect("/")
					else
						res.json({result:true,err:""})
				} else {
					if (redirect)
						res.redirect("/#signIn")
					else
						res.json({result:false,err:err})
				}
			})
		else{
			if (redirect)
				res.redirect("/#signIn")
			else
				res.json({result:false,err:"input"})
		}
	})

	router.get("/signup",csrfToken,(req,res)=>{
		res.render("pages/signup.ejs")
	})

	router.post("/signup",csrfParse,(req,res)=>{
		const body = req.body
		const redirect = req.query.noJavascript

		if (!req.validToken)
			res.json({result:false,err:"token"})

		else if (body.pseudo != undefined && body.password != undefined && body.mail != undefined && body.passwordRepeat != undefined){
			if (body.password != body.passwordRepeat)
				res.json({result:false,err:"passwordRepeat"})

			else
				router.userModel.create(body.pseudo,body.password,body.mail,(result,err)=>{
					res.json({result:result,err:err})
				})
		} else 
			res.json({result:false,err:"input"})
	})

	router.post("/userExist",(req,res)=>{
		const body = req.body
		if (body.mail){
			router.userModel.mailExist(body.mail,(result,err)=>{
				res.json({result:result,err:err})
			})
		} else if (body.pseudo) {
			router.userModel.pseudoExist(body.pseudo,(result,err)=>{
				res.json({result:result,err:err})
			})
		} else {
			res.json({result:false,err:"input"})
		}
	})

	//disconnect route
	router.get("/disconnect",(req,res)=>{
		req.session.destroy(err => {
		  	console.error("error append when destroy session:")
		  	console.error(err)
		  	res.redirect("/")
		})
	})

	return router
}