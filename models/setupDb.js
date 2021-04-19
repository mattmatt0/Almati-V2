const mariadb = require('mariadb')
const db = mariadb.createPool({
	host    :process.env.DB_HOST||"127.0.0.1",
	user    :process.env.DB_USER||"Almati",
	password:process.env.DB_PASSWORD||"localPassword",
	database:process.env.DB_DATABASE||"Almati"
})


module.exports = db