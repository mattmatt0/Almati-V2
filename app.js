const express    = require('express')
const ejs        = require("ejs")

const app = express()
const port = 8080

const helmet = require("helmet")
app.use(helmet({
	contentSecurityPolicy :false //setup it by my own
}))

//setup content security policy 

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy",
    			  "default-src 'self';"+
    			  "script-src 'self';" +
    			  "base-uri 'self';" +
    			  "frame-ancestors 'self';"+
    			  "img-src 'self';"+
    			  "object-src 'none';"+
    			  "form-action 'self';" +
    			  "style-src 'self' fonts.googleapis.com;"+
    			  "font-src 'self' fonts.gstatic.com;");
    next()
})

//setup db
const db = require("./models/setupDb")

//setup session and session store
const mariadbStore = require("./models/mariadbSessionStore")

const expressSession = require("express-session")
app.use(expressSession({
	secret:process.env.SESSION_SECRET || "default secret 123548962@/*-+ ;)",
	name:"sessionID",
	resave:false,
	saveUninitialized:false,
	store:new mariadbStore(db,"sessions"),
	cookie:{
		sameSite:"Strict",
		httpOnly:true,
		maxAge:7 * 24 * 60 * 60 * 1000, //1 week
		secure: process.env.SECURE || false,
	}
}))

//setup body parser
const bodyparser = require("body-parser")
app.use(bodyparser.urlencoded({extended:false}))
 

//the view engine
app.set('view engine', 'ejs');

//add files in public folder (pictures, javascript, css...)
app.use(express.static(__dirname + '/public'))


//setup csrf token for form
const {csrfToken,csrfParse} = require("./middlewares/csrfToken")

//setup middleware to know if user is connected or not
app.use(require("./middlewares/connected"))

//main route
app.get('',csrfToken,function(req, res) {
    res.render('pages/index.ejs')

});

//setup routes
app.use("/user",require("./routes/user")(db))
app.use("/forum",require("./routes/forum")(db))


// If 404:
app.use((req, res, next)=>{
	res.render('pages/404.ejs',{})
})


app.listen(port,()=>{
	console.log("Le serveur écoute sur",port)
})
