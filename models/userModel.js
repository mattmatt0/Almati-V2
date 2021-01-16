const dbBaseModel = require("../models/dbBaseModel")
const regex = require("../utility/regex")
const bcrypt = require('bcrypt');
const saltRounds = 10; //only for dev change it to higuer value in production

module.exports = class user extends dbBaseModel{
	constructor(databasePool,table){
		super(databasePool,table)
	}

	autenticate(pseudo,password,callback){
		//check if pseudo is pseudo or mail
		if (pseudo.match(regex.mail))
			var field = "mail"
		else 
			var field = "pseudo"

		//verify if ther is any match in db
		this.runQuery(`SELECT * FROM ${this.table} WHERE ${field}=?`,[pseudo],(err,rows)=>{
			if (err)
				console.error(err)
			if (rows[0]){ //if user exist
				var user = rows[0]
				bcrypt.compare(password,user.password,(err,result)=>{ //check password
					if (err){
						console.error(err)
						callback(false,"hash")
					}
					if (result)
						callback(true,"",{pseudo:user.pseudo,permissions:user.permissions,image:user.image,id:user.id})
					else
						callback(false,"password",{})

				})
			} else {
				callback(false,"pseudo",{})
			}
		},true)
	}

	//create new user
	create(pseudo,password,mail,callback) {
		if (!pseudo.match(regex.pseudo))
			callback(false,"pseudo")
		else if (!password.match(regex.password))
			callback(false,"password")
		else if (!mail.match(regex.mail))
			callback(false,"mail")

		else//check pseudo
			this.pseudoExist(pseudo,(result,err)=>{
				if (err){
					console.log(err)
					callback(false,"database")
				} else if (result){
					callback(false,"pseudoExist")
				} else
					this.mailExist(mail,(result,err)=>{
						if (err){
							console.log(err)
							callback(false,"database")
						} else if (result){
							console.log(err)
							callback(false,"mailExist")
						} else 
						bcrypt.hash(password,saltRounds,(err,hash)=>{
							if (err){
								console.log(err)
								callback(false,"hash")
							}
							this.runQuery(`INSERT INTO ${this.table} (pseudo,password,mail) VALUES (?,?,?)`,
										[pseudo,hash,mail],
										(err)=>{
											if (err){
												console.log(err)
												callback(false,"database")
											} else
												callback(true,"")
										})
						})
					})
			})
	}

	//check if user exist
	pseudoExist(pseudo,callback){
		this.runQuery(`SELECT id FROM ${this.table} WHERE pseudo=?`,[pseudo],(err,rows)=>{
			if (err)
				callback(false,"database")
			else if (rows[0])
				callback(true,"")
			else
				callback(false,"")
		},true)
	}

	mailExist(mail,callback){
		this.runQuery(`SELECT id FROM ${this.table} WHERE mail=?`,[mail],(err,rows)=>{
			if (err)
				callback(false,"database")
			else if (rows[0])
				callback(true,"")
			else
				callback(false,"")
		},true)
	}
}