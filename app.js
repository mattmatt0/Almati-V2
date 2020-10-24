const express    = require('express')
const cours      = require("./routes/cours")
const user       = require("./routes/user")
const communaute = require("./routes/communaute")
const resources  = require("./routes/resources")
const ejs        = require("ejs")

const app = express()
const port = 8080

const helmet = require("helmet")
app.use(helmet({
	contentSecurityPolicy: process.env.SECURE || false
}))

// For cookies
const cookieParser = require('cookie-parser')
app.use(cookieParser())

const expressSession = require("express-session")
app.use(expressSession({
	secret:process.env.SESSION_SECRET || "default secret 123548962@/*-+ ;)",
	name:"sessionID",
	resave:false,
	saveUninitialized:false,
	cookie:{
		SameSite:"Strict",
		httpOnly:true,
		maxAge:7 * 24 * 60 * 60 * 1000, //1 week
		secure: process.env.SECURE || false,
	}
}))

//setup db
const db = require("./lib/setupDb")

//setup body parser
const bodyparser = require("body-parser")
app.use(bodyparser.urlencoded({extended:false}))
 

//the view engine
app.set('view engine', 'ejs');

//add files in public folder (pictures, javascript, css...)
app.use(express.static(__dirname + '/public'))


//setup csrf token for form
const {csrfToken,csrfParse} = require("./lib/csrfToken")
app.use(csrfToken)

//main route
app.get('', function(req, res) {
    res.render('main.ejs',{})

});

//external routes
app.use("/user",user(db))
app.use("/cours",cours)
app.use("/communaute",communaute)
app.use("/ressources", resources)
// If 404:
app.use(function(req, res, next){
    res.render('common/404.ejs',{})
});


app.listen(port,()=>{
	console.log("Le serveur écoute sur",port)
})
