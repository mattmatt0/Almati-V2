const express = require('express')
const cours = require("./routes/cours")
const user = require("./routes/user")
const communaute = require("./routes/communaute")
const resources = require("./routes/resources")
const ejs = require("ejs")

const app = express()
const port = 8080

// For cookies
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//the view engine
app.set('view engine', 'ejs');

//add files in public folder (pictures, javascript, css...)
app.use(express.static(__dirname + '/public'))


//main route
app.get('', function(req, res) {
    res.render('main.ejs',{})

});

//external routes
app.use("/user",user)
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
