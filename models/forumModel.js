const dbBaseModel = require("../models/dbBaseModel")

module.exports = class forumModel extends dbBaseModel {
	constructor(databasePool,table,categoryTable,subsectionTable,topicTable,messagesTable,userTable){
		super(databasePool,table)
		this.categoryTable = categoryTable
		this.subsectionTable = subsectionTable
		this.topicTable = topicTable
		this.userTable = userTable
		this.messagesTable = messagesTable
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
				rows.forEach((category)=>{
					if (toReturn[category.name] == undefined){ //init category data
						toReturn[category.name] = {
							id:category.id,
							subsections:[]
						}	
					}
					
					toReturn[category.name].subsections.push({ //add sub category
						id:category.subsectionId,
						name:category.subsectionName,
						image:category.image,
						description:category.description
					})
				})
				
				callback(null,toReturn)
			}
		},true)
	}

	subsectionId(categoryName,callback){
		this.runQuery(`SELECT id FROM ${this.subsectionTable} WHERE name = ?`,[categoryName],(err,rows)=>{
			callback(err,rows)
		},true,0)
	}

	getTopicsByCategory(categoryName,maxAmout,pined,callback){
		this.subsectionId(categoryName,(err,id)=>{
			if (err){
				callback(err)
			}
			else if (id == undefined || id == null){
				callback("category")
			} else {
				id = id.id
				this.runQuery(`SELECT ${this.subsectionTable}.id AS subsectionId,`+
									` ${this.subsectionTable}.name AS categoryName,`+
									` ${this.subsectionTable}.image AS categoryImage,`+
									` ${this.subsectionTable}.description AS categoryDescription,`+
							  		` ${this.table}.id AS id,`+
							  		` ${this.table}.title AS title,`+
							  		` ${this.table}.creationDate AS creationDate,`+
							  		` ${this.table}.lastEditDate AS lastEditDate,`+
							  		` ${this.table}.solved AS solved,`+
							  		` (SELECT COUNT(*) FROM ${this.messagesTable} WHERE ${this.messagesTable}.topicId = ${this.table}.id) AS responses,`+
							  		` ${this.userTable}.pseudo AS pseudo,`+
							  		` ${this.userTable}.image AS image\n`+
							  		` FROM ${this.subsectionTable}`+
							  		` LEFT JOIN ${this.table} ON ${this.table}.subsectionId = ${this.subsectionTable}.id AND ${this.table}.pined = ?`+
							  		` LEFT JOIN ${this.userTable} ON ${this.table}.userId = ${this.userTable}.id `+
							  		` WHERE ${this.subsectionTable}.id = ?`+
							  		` ORDER BY ${this.table}.lastEditDate DESC`,[pined,id],(err,rows)=>{		  			
					

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
						if (rows[0].id != null)
							rows.forEach((topic)=>{
								toReturn.topics.push({
									id:topic.id,
									title:topic.title,
									creationDate:topic.creationDate,
									lastEditDate:topic.lastEditDate,
									solved:topic.solved,
									responses:topic.responses,
									pseudo:topic.pseudo,
									image:topic.image
								})
							})
						callback(null,toReturn)
					}

				},true)
			}
		})
	}

	getTopicsMessages(topic,maxAmout,callback){

	}

}
