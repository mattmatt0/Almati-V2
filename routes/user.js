const express = require("express")
const bcrypt = require("bcrypt")
const saltRound = 10


module.exports = dbPool => {
	const route = express.Router();

	//in this page we put parameters of users, Sign In forgoten password...
	route.get("",(req,res)=>{
		res.end("C'est pas encore fait ;)",{})
	})

	route.post("/login",(req,res)=>{
		var body = req.body
		if (body.pseudo && body.password){ //verify if fields are provided
			dbPool.getConnection().then(conn=>{
				conn.query("SELECT * FROM users WHERE pseudo=?",[body.pseudo]).then(rows=>{
					if (rows.length > 0){ //check if user exist
						var user = rows[0]
						bcrypt.compare(body.password,rows.password,(err,result)=>{ //check password
							if (err){
								console.log('bcrypt error:',err)
								res.json({
									error:"internal error",
									connected:false
								})
							} else {
								if (result){
									res.json({
										connected:true
									})
								} else {
									res.json({
										error:"password",
										connected:false
									})
								}
							}
						})
					} else {
						res.json({
							error:"pseudo",
							connected:false
						})
					}
				}).catch(err=>{
					console.log('sql error',err)
					res.json({
						error:"internal error",
						connected:false
					})
				})
			}).catch(err=>{
				console.log('sql error',err)
				res.json({
					error:"internal error",
					connected:false
				})
			})
		} else {
			res.json({
				error:"please provide a password and a pseudo",
				connected:false
			})
		}
	})

	route.post("/signin",(req,res)=>{

	})

	route.post("/userExist",(req,res)=>{ //API to verify if pseudo or email exists in real time.
		var body = req.body
		var action = ""
		if (body.pseudo){//verify if pseudo is provided
			action = "pseudo"
		} else if (body.mail){
			action = "mail"
		} else {
			res.json({
				error:"please provide a pseudo or an email"
			})
			return
		}
		dbPool.getConnection().then(conn=>{
				conn.query("SELECT id FROM users WHERE ?=?",[action,body.pseudo ? body.pseudo : body.mail]).then(rows => {
					var result = undefined
					if (rows.length == 0){//if there is no match, the user doesn't exist
						result = false
					} else {
						result = true
					}
					res.json({
						result:result,
						error:""
					})
				}).catch(err => {
					console.log('sql error:',err)
					res.json({
						error:"internal error"
					})
				})
			}).catch((err)=>{
				console.log('sql error:',err)
				res.json({
					error:"internal error"
				})
			})
	})

	route.get("/motDePasseOublie",(req,res)=>{
		res.end("C'est pas encore fait ;)",{})
	})

	return route
}
