const session = require ("express-session")

module.exports = class mariadbStore extends session.Store{
	constructor(databasePool,table){
		super()
		this.pool = databasePool
		this.table = table
	}

	runQuery(query,args,callback,value=false,index="any"){
		this.pool.getConnection().then((conn)=>{
			conn.query(query,args).then(rows=>{
				if (value)
				{
					if (index == "any")
						callback(null,rows)
					else
						callback(null,rows[index])
				} else {
					callback(null)
				}
				
			}).catch(err=>{
				callback(err)
			})
			conn.release()
		}).catch(err=>{
			callback(err)
		})
	}

	all(callback){
		this.runQuery(`SELECT * FROM ${this.table}`,[],callback,true)
	}

	destroy(sid,callback){
		this.runQuery(`DELETE FROM ${this.table} WHERE sid=?`,[],callback)
	}

	clear(callback){
		this.runQuery(`DELETE FROM ${this.table}`,[],callback)
	}

	length(callback){
		this.runQuery(`SELECT count(*) FROM ${this.table}`,[],callback,true,0)
	}

	get(sid,callback){
		this.runQuery(`SELECT session FROM ${this.table} WHERE sid=?`,[sid],(err,result)=>{
			if (err)
				callback(err)
			else
			{
				if (result == undefined){
					return callback(null,null)
				} else {
					callback(null,JSON.parse(result.session))
				}
				
			}
		},true,0)
	}

	set(sid,session,callback){
		this.get(sid,(err,getSession) => {
			if (err)
				callback(err)
			else if (getSession){
				this.touch(sid,session,callback)
			} else {
				this.runQuery(`INSERT INTO ${this.table} (sid,session) VALUES (?,?)`,[sid,JSON.stringify(session)],callback)
			}
		})
	}

	touch(sid,session,callback){
		this.runQuery(`UPDATE ${this.table} SET session=? WHERE sid=?`,[JSON.stringify(session),sid],callback)
	}
}