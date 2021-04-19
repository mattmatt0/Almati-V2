const dbBaseModel = require("../models/dbBaseModel")

module.exports = class categoryModel extends dbBaseModel {
	constructor(databasePool,table){
		super(databasePool,table)
	}

	getAll(callback){
		this.runQuery(`SELECT * FROM `)
	}
}