module.exports = class dbBaseModel {
	
	constructor(databasePool,table){
		this.pool = databasePool
		this.table = table
	}

	runQuery(query,args,callback,value=false,index="all"){



		this.pool.getConnection().then(conn => {
			conn.query(query,args).then(rows => {
				if (value)
				{
					if (index == "all")
						callback(null,rows)
					else
						callback(null,rows[index])
				} else {
					callback(null)
				}
				
			}).catch(err => {
				callback(err)
			})
			conn.release()
		}).catch(err => {
			callback(err)
		})
	}
}