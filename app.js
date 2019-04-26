var express = require('express'); 
var cours = require("./routes/cours")
var user = require("./routes/user")
var communaute = require("./routes/communaute")

var app = express();

// For cookies
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

app.get('', function(req, res) {
    res.render('main.ejs');
});

app.use("/user",user)
app.use("/cours",cours)
app.use("/communaute",communaute)

// If 404:
app.use(function(req, res, next){
    res.render('404.ejs');
});



app.listen(8080);