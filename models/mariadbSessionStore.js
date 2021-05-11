const session = require ("express-session")
const dbBaseModel = require("../models/dbBaseModel")

module.exports = class mariadbStore extends session.Store{
	constructor(options){
		super (options)
		if ((!options.pool || !options.table))
			throw "You must pass pool and table parameters"

		this.model = new dbBaseModel(options.pool,options.table)
		this.table = options.table
	}

	all(callback){
		this.model.runQuery(`SELECT * FROM ${this.table}`,[],callback,true)
	}

	destroy(sid,callback){
		this.model.runQuery(`DELETE FROM ${this.table} WHERE sid=?`,[sid],callback)
	}

	clear(callback){
		this.model.runQuery(`DELETE FROM ${this.table}`,[],callback)
	}

	length(callback){
		this.model.runQuery(`SELECT COUNT(*) AS count FROM ${this.table}`,[],(err,result)=>{
			callback(err,result[0].count)
		},true)
	}

	get(sid,callback){
		this.model.runQuery(`SELECT session FROM ${this.table} WHERE sid=?`,[sid],(err,result)=>{
			if (err)
				callback(err)
			else
			{
				if (result == undefined){
					callback(null,null)
				} else {
					callback(null,JSON.parse(result.session))
				}
			}
		},true,0)
	}

	dateToSql(date){
		return date.toISOString().slice(0, 19).replace('T', ' ')
	}

	set(sid,session,callback){
	    this.model.runQuery(`INSERT INTO ${this.table} (sid,expire,session) VALUES (?,?,?) ON DUPLICATE KEY UPDATE expire=VALUES(expire),session=VALUES(session)`,[sid,this.dateToSql(session.cookie.expires),JSON.stringify(session)],callback)
	}

	touch(sid,session,callback){
		this.model.runQuery(`UPDATE ${this.table} SET session=?,expire=? WHERE sid=?`,[JSON.stringify(session),this.dateToSql(session.cookie.expires),sid],callback)
	}
}