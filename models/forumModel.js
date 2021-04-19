const dbBaseModel = require("../models/dbBaseModel")

module.exports = class forumModel extends dbBaseModel {
	constructor(databasePool,table,categoryTable,subsectionTable,topicTable,userTable){
		super(databasePool,table)
		this.categoryTable = categoryTable
		this.subsectionTable = subsectionTable
		this.topicTable = topicTable
		this.userTable = userTable
	}

	getCategory(callback){
		this.runQuery(`SELECT ${this.subsectionTable}.name AS subsectionName,`+
					  `${this.categoryTable}.id AS id,`+
					  `${this.categoryTable}.name AS name,`+
					  `${this.subsectionTable}.id AS subsectionId,`+
					  `${this.subsectionTable}.image AS image,`+
					  `${this.subsectionTable}.description AS description`+
					  ` FROM ${this.categoryTable} INNER JOIN ${this.subsectionTable}`+
					  ` ON ${this.categoryTable}.id = ${this.subsectionTable}.categoryId`,
					  [],(err,rows)=>{
			if (err){
				console.log(err)
				callback(err)
			} else {
				// setup data
				var toReturn = {}
				for (var i = 0; i<rows.length; i++){ //for each elements in rows
					
					if (toReturn[rows[i].name] == undefined){ //init category data
						toReturn[rows[i].name] = {
							id:rows[i].id,
							subsections:[]
						}	
					}
					
					toReturn[rows[i].name].subsections.push({ //add sub category
						id:rows[i].subsectionId,
						name:rows[i].subsectionName,
						image:rows[i].image,
						description:rows[i].description
					})
				}
				callback(null,toReturn)
			}
		},true)
	}

	categoryId(categoryName,callback){
		this.runQuery(`SELECT id FROM ${this.categoryTable} WHERE name=?`,[categoryName],(err,rows)=>{
			callback(err,rows[0])
		},true)
	}

	getTopicsByCategory(categoryName,maxAmout,callback){
		this.categoryId(categoryName,(err,id)=>{
			if (err){
				console.log(err)
				callback(err)
			}
			else if (id == undefined || id == null){
				callback("category")
			} else {
				this.runQuery(`SELECT ${this.subsectionTable}.id AS categoryId,`+
									` ${this.subsectionTable}.name AS categoryName`+
									` ${this.subsectionTable}.image AS categoryImage`+
									` ${this.subsectionTable}.description AS categoryDescription`+
							  		` ${this.table}.id AS id`+
							  		` ${this.table}.title AS title`+
							  		` ${this.table}.creationDate AS creationDate`+
							  		` ${this.table}.solved AS solved`+
							  		` ${this.table}.responses AS responses`+
							  		` ${this.userTable}.pseudo AS pseudo `+
							  		` ${this.image}.pseudo AS image `+
							  		` FROM ${this.subsectionTable}`+
							  		` LEFT JOIN ${this.table} ON ${this.table}.categoryId = ${this.subsectionTable}.id `+
							  		` INNER JOIN ${this.userTable} ON ${this.table}.userId = ${this.userTable}.id`+
							  		` WHERE ${this.subsectionTable}.id = ?`,[id],(err,rows)=>{
					if (err)
						callback(err)
					else {
						var toReturn = {
							categoryId:rows[0].subsectionId,
							categoryName:rows[0].categoryName,
							categoryImage:rows[0].categoryImage,
							categoryDescription:rows[0].categoryDescription,
							topics:[]
						}
						for (topic in rows){
							roReturn.topics.push({
								id:topic.id,
								title:topic.title,
								creationDate:topic.creationDate,
								solved:topic.solved,
								responses:topic.responses,
								pseudo:topic.pseudo,
								image:topic.image
							})
						}
					}

				},true)
			}
		})
	}

	getTopicsMessages(topic,maxAmout,callback){

	}

}
