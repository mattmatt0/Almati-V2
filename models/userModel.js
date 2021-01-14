const dbBaseModel = require("../models/dbBaseModel")
const bcrypt = require('bcrypt');
const saltRounds = 10; //only for dev change it to higuer value in production

module.exports = class user extends dbBaseModel{
	constructor(databasePool,table){
		super(databasePool,table)
	}

	autenticate(pseudo,password,callback){
		this.runQuery(`SELECT * FROM ${this.table} WHERE pseudo=?`,[pseudo],(err,rows)=>{
			if (err)
				console.error(err)
			if (rows){
				var user = rows[0]
				bcrypt.compare(password,user.password,(err,result)=>{
					if (err)
						console.error(err)
					if (result)
						callback(true,"",{pseudo:user.pseudo,permissions:user.permissions,image:user.image})
					else
						callback(false,"password",{})

				})
			} else {
				callback(false,"pseudo",{})
			}
		},true)
	}
}