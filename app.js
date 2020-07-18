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

// middle ware for get host name and use it in link
app.use((req,res,next)=>{
	url = req.url
	nb = 0
	urlForLink = "/"
	if (url != "/favicon.ico" && url != "/")
	{

		nb = url.split("/").length-1 //get nuber of slashes

		for (var i = 0; i < nb; i++) {
			urlForLink += "../"

        }

    }
	req.urlForLink = urlForLink
	next()

})

//main route
app.get('', function(req, res) {
    res.render('main.ejs',{url:req.urlForLink})

});

//external routes
app.use("/user",user)
app.use("/cours",cours)
app.use("/communaute",communaute)
app.use("/ressources", resources)
// If 404:
app.use(function(req, res, next){
    res.render('common/404.ejs',{url:req.urlForLink})
});


app.listen(port,()=>{
	console.log("Le serveur écoute sur",port)
})
