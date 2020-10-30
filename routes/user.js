const express = require("express")
const bcrypt = require("bcrypt")
const saltRound = 10

const regex = require("../lib/regex")
const {csrfToken,csrfParse} = require("../lib/csrfToken")


module.exports = dbPool => {
	//define gloab functions
	userExists = (mode,userInfo,callback) =>{
		dbPool.getConnection().then(conn=>{
			if (mode == "dual"){
				var query = `SELECT * FROM users WHERE pseudo=? AND mail=?`
			} else {
				var query = `SELECT * FROM users WHERE ${mode}=?`
			}
			conn.query(query,[userInfo.pseudo ? userInfo.pseudo : userInfo.mail,userInfo.mail]).then(rows => {
				var result = undefined
				//console.log(rows)
				if (rows.length == 0){//if there is no match, the user doesn't exist
					result = false
				} else {
					result = true
				}
				callback({
					result:result,
					error:undefined
				})
			}).catch(err => {
				console.log('sql error:',err)
				callback({
					result:false,
					error:"internal error"
				})
			})
			conn.release()
		}).catch((err)=>{
			console.log('sql error:',err)
			callback({
				result:false,
				error:"internal error"
			})
		})
	}

	const route = express.Router();

	//in this page we put parameters of users, Sign In forgoten password...
	route.get("",csrfToken,(req,res)=>{
		res.end("C'est pas encore fait ;)",{})
	})

	route.get("/signup",csrfToken,(req,res)=>{
		res.render("signUp.ejs")
	})

	route.post("/signup",csrfParse,(req,res)=>{
		var body = req.body
		const savedInput = "&pseudo="+encodeURI(body.pseudo)+"&mail="+encodeURI(body.mail)

		//verify token
		if (!req.validToken){
			res.redirect("/user/signup?error="+encodeURI("csrfToken")+savedInput)
			return
		}
		//verify all fields
		

		//verify pseudo
		if (!body.pseudo.match(regex.pseudo)){
			res.redirect("/user/signup?error="+encodeURI("pseudo")+savedInput)
			return
		}

		//verify mail
		if (!body.mail.match(regex.mail)){
			res.redirect("/user/signup?error="+encodeURI("mail")+savedInput)
			return
		}

		//verify password
		if (!body.password.match(regex.password)){
			res.redirect("/user/signup?error="+encodeURI("password")+savedInput)
		}

		//verify match between password and password repeat
		if (body.password != body.passwordRepeat){
			res.redirect("/user/signup?error="+encodeURI("passwordMatch")+savedInput)
		}

		//verify is user exist
		userExists("dual",body,(result)=>{
			if (result.error){
				res.redirect("/user/signup?error="+encodeURI("internal")+savedInput)
				return
			}

			if (result.result) {
				res.redirect("/user/signup?error="+encodeURI("exist"))
				return
			}
			console.log(result)
			//process password
			bcrypt.hash(body.password, saltRound, (err, hash) => {
				if (err){
					console.log('hash error :',err)
					res.redirect("/user/signup?error="+encodeURI("internal")+savedInput)
					return
				}
			    //everithing is ok, so we can create user in bdd
				dbPool.getConnection().then(conn=>{
					conn.query("INSERT INTO users (pseudo, mail, password) VALUES (?,?,?)",[body.pseudo,body.mail,hash]).then((rows)=>{
							res.redirect("/")
						}).catch(err=>{
							console.log('connection insert error:',err)
							res.redirect("/user/signup?error="+encodeURI("internal")+savedInput)
						})

					conn.release()
				}).catch(err=>{
					console.log('connection bdd error:',err)
					res.redirect("/user/signup?error="+encodeURI("internal")+savedInput)
				})
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
										req.session.save()
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
		var mode = ""
		if (body.pseudo){//verify if pseudo is provided
			mode = "pseudo"
		} else if (body.mail){
			mode = "mail"
		} else {
			res.json({
				error:"null field"
			})
			return
		}

		userExists(mode,body,(result)=>{
			res.json(result)
		})
	})

	route.get("/motDePasseOublie",csrfToken,(req,res)=>{
		res.end("C'est pas encore fait ;)",{})
	})

	return route
}
