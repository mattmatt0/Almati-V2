const express = require("express")
const bcrypt = require("bcrypt")
const saltRound = 10

const regex = require("../lib/regex")
const {csrfToken,csrfParse} = require("../lib/csrfToken")


module.exports = dbPool => {
	const route = express.Router();

	//in this page we put parameters of users, Sign In forgoten password...
	route.get("",(req,res)=>{
		res.end("C'est pas encore fait ;)",{})
	})

	route.get("/signup",(req,res)=>{
		res.render("signUp.ejs")
	})

	route.post("/signup",csrfParse,(req,res)=>{
		//verify token
		if (!req.validToken){
			res.redirect("/user/signup?error="+encodeURI("csrfToken"))
			return
		}
		//verify all fields
		var body = req.body

		//verify pseudo
		if (!body.pseudo.match(regex.pseudo)){
			res.redirect("/user/signup?error="+encodeURI("pseudo"))
			return
		}

		//verify mail
		if (!body.mail.match(regex.mail)){
			res.redirect("/user/signup?error="+encodeURI("mail"))
			return
		}

		//verify password
		if (!body.password.match(regex.password)){
			res.redirect("/user/signup?error="+encodeURI("password"))
		}

		//verify match between password and password repeat
		if (body.password != body.passwordRepeat){
			res.redirect("/user/signup?error="+encodeURI("passwordMatch"))
		}

		//process password
		bcrypt.hash(body.password, saltRound, (err, hash) => {
			if (err){
				console.log('hash error :',err)
				res.redirect("/user/signup?error="+encodeURI("internal"))
				return
			}
		    //everithing is ok, so we can create user in bdd
			dbPool.getConnection().then(conn=>{
				conn.query("INSERT INTO users (pseudo, mail, password) VALUES (?,?,?)",[body.pseudo,body.mail,hash]).then((rows)=>{
						res.redirect("/")
					}).catch(err=>{
						console.log('connection insert error:',err)
						res.redirect("/user/signup?error="+encodeURI("internal"))
					})

				conn.release()
			}).catch(err=>{
				console.log('connection bdd error:',err)
				res.redirect("/user/signup?error="+encodeURI("internal"))
			})
		})
	})

	route.get("/disconnect",csrfParse,(req,res)=>{
		if (req.session.pseudo && req.validToken){
			req.session = {}
		}
		res.redirect("/")
	})

	route.post("/login",csrfParse,(req,res)=>{
		var body = req.body
		console.log(req.validToken)
		if (req.validToken)
			if (body.pseudo && body.password){ //verify if fields are provided
				dbPool.getConnection().then(conn=>{
					conn.query("SELECT * FROM users WHERE pseudo=?",[body.pseudo]).then(rows=>{
						if (rows.length > 0){ //check if user exist
							var user = rows[0]
							bcrypt.compare(body.password,user.password,(err,result)=>{ //check password
								if (err){
									console.log('bcrypt error:',err)
									res.json({
										error:"internal error",
										connected:false
									})
								} else {
									if (result){
										req.session.pseudo = user.pseudo
										/* only to avoid database verification on every request, 
										 * if user have necessary permission we check db else we do nothing
										 */
										req.session.permissions = user.permissions
										req.session.image = user.image
										req.session.mail = user.mail
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
					conn.release()
				}).catch(err=>{
					console.log('sql error',err)
					res.json({
						error:"internal error",
						connected:false
					})
				})
			} else {
				res.json({
					error:"null field",
					connected:false
				})
			}
		else {
			res.json({
				error:"token",
				connected:false
			})
		}
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
				error:"null field"
			})
			return
		}
		dbPool.getConnection().then(conn=>{
				conn.query(`SELECT * FROM users WHERE ${action}=?`,[body.pseudo ? body.pseudo : body.mail]).then(rows => {
					var result = undefined
					console.log(rows)
					if (rows.length == 0){//if there is no match, the user doesn't exist
						result = false
					} else {
						result = true
					}
					res.json({
						result:result,
						error:undefined
					})
				}).catch(err => {
					console.log('sql error:',err)
					res.json({
						result:false,
						error:"internal error"
					})
				})
				conn.release()
			}).catch((err)=>{
				console.log('sql error:',err)
				res.json({
					result:false,
					error:"internal error"
				})
			})
	})

	route.get("/motDePasseOublie",(req,res)=>{
		res.end("C'est pas encore fait ;)",{})
	})

	return route
}
