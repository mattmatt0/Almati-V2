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


	return router
}